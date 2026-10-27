import vm from 'vm';
import { spawn } from 'child_process';
import { ITestCase } from '../models/Challenge.js';

export interface TestExecutionResult {
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  error?: string;
  isHidden?: boolean;
}

export interface ExecutionSummary {
  allPassed: boolean;
  totalPassed: number;
  totalTests: number;
  executionTimeMs: number;
  results: TestExecutionResult[];
  compilationError?: string;
}

export class CodeExecutionService {
  /**
   * Run code against sample and private test cases
   */
  static async evaluateSolution(
    language: string,
    code: string,
    testCases: ITestCase[],
    timeoutMs = 2500
  ): Promise<ExecutionSummary> {
    const startTime = Date.now();
    const results: TestExecutionResult[] = [];
    let allPassed = true;
    let totalPassed = 0;

    for (const test of testCases) {
      let result: TestExecutionResult;

      if (language === 'javascript') {
        result = await this.runJavaScriptTest(code, test, timeoutMs);
      } else if (language === 'python') {
        result = await this.runPythonTest(code, test, timeoutMs);
      } else if (language === 'html') {
        // HTML verification: checks presence of required tags/elements specified in expectedOutput
        result = this.runHtmlVerification(code, test);
      } else {
        result = {
          passed: false,
          input: test.input,
          expected: test.expectedOutput,
          actual: '',
          error: `Unsupported execution language: ${language}`,
          isHidden: test.isHidden,
        };
      }

      if (result.passed) {
        totalPassed++;
      } else {
        allPassed = false;
      }

      // If test is hidden, mask input and expected output details in the response
      if (test.isHidden) {
        results.push({
          passed: result.passed,
          input: '[Hidden Test Case]',
          expected: '[Hidden]',
          actual: result.passed ? '[Passed]' : result.error || '[Failed - Output Mismatch]',
          error: result.error,
          isHidden: true,
        });
      } else {
        results.push(result);
      }
    }

    const executionTimeMs = Date.now() - startTime;

    return {
      allPassed,
      totalPassed,
      totalTests: testCases.length,
      executionTimeMs,
      results,
    };
  }

  /**
   * Safe JavaScript execution in an isolated Node VM Context
   */
  private static async runJavaScriptTest(
    code: string,
    test: ITestCase,
    timeoutMs: number
  ): Promise<TestExecutionResult> {
    try {
      const logs: string[] = [];
      const sandbox = {
        console: {
          log: (...args: any[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
          error: (...args: any[]) => logs.push('[error] ' + args.map(a => String(a)).join(' ')),
          warn: (...args: any[]) => logs.push('[warn] ' + args.map(a => String(a)).join(' ')),
        },
        Math,
        Date,
        parseInt,
        parseFloat,
        isNaN,
        isFinite,
        Array,
        Object,
        String,
        Number,
        Boolean,
        RegExp,
        JSON,
      };

      const context = vm.createContext(sandbox);

      // Wrapper script that calls user function with input argument or evaluates expression
      const wrappedScript = `
        ${code}
        ;
        (function() {
          try {
            // Find the primary function defined in user code
            const candidateFn = typeof solution === 'function' ? solution :
              (typeof main === 'function' ? main :
              (Object.values(this).find(v => typeof v === 'function' && v !== console.log)));

            let testInput;
            try {
              testInput = JSON.parse(${JSON.stringify(test.input)});
            } catch(e) {
              testInput = ${JSON.stringify(test.input)};
            }

            let result;
            if (typeof candidateFn === 'function') {
              if (Array.isArray(testInput)) {
                result = candidateFn(...testInput);
              } else {
                result = candidateFn(testInput);
              }
            } else {
              // Direct statement execution
              result = logs.length ? logs[logs.length - 1] : undefined;
            }

            return result !== undefined ? (typeof result === 'object' ? JSON.stringify(result) : String(result)) : logs.join('\\n');
          } catch(err) {
            return '__ERR__:' + err.message;
          }
        })();
      `;

      const script = new vm.Script(wrappedScript);
      const executionResult = script.runInContext(context, {
        timeout: timeoutMs,
      });

      if (typeof executionResult === 'string' && executionResult.startsWith('__ERR__:')) {
        return {
          passed: false,
          input: test.input,
          expected: test.expectedOutput,
          actual: '',
          error: executionResult.replace('__ERR__:', ''),
          isHidden: test.isHidden,
        };
      }

      const actualTrimmed = String(executionResult ?? '').trim();
      const expectedTrimmed = String(test.expectedOutput).trim();

      const passed = this.compareOutputs(actualTrimmed, expectedTrimmed);

      return {
        passed,
        input: test.input,
        expected: test.expectedOutput,
        actual: actualTrimmed,
        isHidden: test.isHidden,
      };
    } catch (err: any) {
      const isTimeout = err.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT' || err.message?.includes('timed out');
      return {
        passed: false,
        input: test.input,
        expected: test.expectedOutput,
        actual: '',
        error: isTimeout ? `Time Limit Exceeded (> ${timeoutMs}ms)` : (err.message || 'Runtime error'),
        isHidden: test.isHidden,
      };
    }
  }

  /**
   * Safe Python test runner via child_process with timeout
   */
  private static async runPythonTest(
    code: string,
    test: ITestCase,
    timeoutMs: number
  ): Promise<TestExecutionResult> {
    return new Promise((resolve) => {
      const pythonCommands = ['python3', 'python'];
      let chosenCmd = 'python';

      // Script runner wrapper
      const scriptCode = `
import sys
import json

${code}

try:
    test_input = json.loads(${JSON.stringify(test.input)})
except Exception:
    test_input = ${JSON.stringify(test.input)}

try:
    if 'solution' in globals() and callable(globals()['solution']):
        fn = globals()['solution']
        if isinstance(test_input, list):
            res = fn(*test_input)
        else:
            res = fn(test_input)
        if isinstance(res, (dict, list)):
            print(json.dumps(res))
        else:
            print(res)
    elif 'main' in globals() and callable(globals()['main']):
        print(globals()['main']())
except Exception as e:
    print(f"__ERR__:{e}")
`;

      const proc = spawn(chosenCmd, ['-c', scriptCode], {
        timeout: timeoutMs,
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      let stdout = '';
      let stderr = '';

      proc.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      proc.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      proc.on('error', () => {
        // Python might not be installed on host system
        resolve({
          passed: false,
          input: test.input,
          expected: test.expectedOutput,
          actual: '',
          error: 'Python environment is not available on host. Please use JavaScript or ensure Python is configured.',
          isHidden: test.isHidden,
        });
      });

      proc.on('close', (code) => {
        if (code !== 0 && stderr) {
          resolve({
            passed: false,
            input: test.input,
            expected: test.expectedOutput,
            actual: '',
            error: stderr.trim() || 'Python runtime error',
            isHidden: test.isHidden,
          });
          return;
        }

        const out = stdout.trim();
        if (out.startsWith('__ERR__:')) {
          resolve({
            passed: false,
            input: test.input,
            expected: test.expectedOutput,
            actual: '',
            error: out.replace('__ERR__:', ''),
            isHidden: test.isHidden,
          });
          return;
        }

        const passed = CodeExecutionService.compareOutputs(out, test.expectedOutput.trim());
        resolve({
          passed,
          input: test.input,
          expected: test.expectedOutput,
          actual: out,
          isHidden: test.isHidden,
        });
      });
    });
  }

  /**
   * HTML/CSS basic verification checks
   */
  private static runHtmlVerification(code: string, test: ITestCase): TestExecutionResult {
    const requiredPatterns = test.expectedOutput.split(';').map(p => p.trim()).filter(Boolean);
    const missing: string[] = [];

    for (const pattern of requiredPatterns) {
      if (!code.toLowerCase().includes(pattern.toLowerCase())) {
        missing.push(pattern);
      }
    }

    const passed = missing.length === 0;
    return {
      passed,
      input: test.input || 'HTML markup check',
      expected: test.expectedOutput,
      actual: passed ? 'All required elements found' : `Missing expected pattern(s): ${missing.join(', ')}`,
      error: passed ? undefined : `Requirements not met`,
      isHidden: test.isHidden,
    };
  }

  private static compareOutputs(actual: string, expected: string): boolean {
    if (actual === expected) return true;
    try {
      // Compare parsed JSON if both are objects/arrays
      const parsedActual = JSON.parse(actual);
      const parsedExpected = JSON.parse(expected);
      return JSON.stringify(parsedActual) === JSON.stringify(parsedExpected);
    } catch {
      return actual.replace(/\r\n/g, '\n').trim() === expected.replace(/\r\n/g, '\n').trim();
    }
  }
}
