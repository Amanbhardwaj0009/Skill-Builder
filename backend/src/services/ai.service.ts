import { config } from '../config/env.js';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class AIService {
  /**
   * Main conversational mentor chat
   */
  static async chat(messages: ChatMessage[], language: string = 'English', topicContext?: string): Promise<string> {
    const lastUserMessage = messages[messages.length - 1]?.content || '';

    // If external LLM API key is configured, call provider
    if (config.llm.apiKey) {
      try {
        return await this.callExternalLLM(messages, language, topicContext);
      } catch (err: any) {
        console.warn('⚠️ [AI] External LLM failed, using intelligent local mentor fallback:', err.message);
      }
    }

    // Local AI Mentor Engine (Offline & zero-config ready)
    return this.generateSmartLocalResponse(lastUserMessage, language, topicContext);
  }

  /**
   * Concept Explanation
   */
  static async explainConcept(concept: string, language: string = 'English', skillLevel: string = 'beginner'): Promise<{
    explanation: string;
    analogy: string;
    codeExample: string;
    keyTakeaways: string[];
  }> {
    const isHindi = language.toLowerCase().includes('hindi');

    if (isHindi) {
      return {
        explanation: `**${concept}** कंप्यूटर साइंस का एक महत्वपूर्ण विषय है। ${skillLevel} स्तर पर, इसे एक व्यवस्थित समाधान पद्धति के रूप में समझा जाता है। यह डेटा को प्रोसेस करने और लॉजिक को लागू करने का आसान तरीका प्रदान करता है।`,
        analogy: `सोचिए जैसे रसोई में रेसिपी फॉलो करना: हर स्टेप क्रमबद्ध और सुनिश्चित परिणाम देने वाला होता है।`,
        codeExample: `// ${concept} का सरल उदाहरण\nfunction demo() {\n  console.log("Exploring ${concept}!");\n}\ndemo();`,
        keyTakeaways: [
          `${concept} बुनियादी लॉजिक निर्माण में सहायता करता है।`,
          `यह कोड को पुनः प्रयोज्य (reusable) और पठनीय (readable) बनाता है।`,
          `प्रैक्टिस और रियल-वर्ल्ड प्रोजेक्ट्स के साथ यह और स्पष्ट होता है।`,
        ],
      };
    }

    return {
      explanation: `**${concept}** is a foundational concept in programming and computer science. At the **${skillLevel}** level, it empowers you to structure code logically, reduce duplication, and write maintainable algorithms.`,
      analogy: `Think of it like following a cooking recipe: instructions execute step-by-step with specified inputs to produce a predictable delicious outcome.`,
      codeExample: `// ${concept} Demonstration\nfunction executeExample() {\n  const message = "Mastering ${concept} on SkillQuest AI";\n  console.log(message);\n  return true;\n}\n\nexecuteExample();`,
      keyTakeaways: [
        `Breaks complex tasks down into manageable, testable components.`,
        `Improves code readability, debugging speed, and modularity.`,
        `Practicing with mini-challenges solidifies muscle memory.`,
      ],
    };
  }

  /**
   * Progressive Hint Generator
   */
  static async getHint(promptText: string, currentCode?: string, hintLevel: number = 1): Promise<{
    hint: string;
    hintLevel: number;
    encouragement: string;
  }> {
    const hints = [
      `💡 **Nudge (Level 1):** Check the problem requirements. What are the expected inputs, and what data type should be returned?`,
      `🔍 **Clue (Level 2):** Break the logic into two steps: first process the condition or iteration, then return the formatted result. Make sure edge cases like empty inputs are handled.`,
      `🎯 **Blueprint (Level 3):** Structure your function: declare your accumulator variable, loop through the items with \`for...of\` or a helper, and return the accumulated result.`,
    ];

    const chosenHint = hints[Math.min(hintLevel - 1, hints.length - 1)] || hints[0];

    return {
      hint: chosenHint,
      hintLevel,
      encouragement: `You're close! Take a deep breath and test each line independently.`,
    };
  }

  /**
   * Dynamic Quiz Generator
   */
  static async generateQuiz(topic: string, difficulty: string = 'beginner'): Promise<{
    topic: string;
    questions: {
      question: string;
      options: string[];
      correctOptionIndex: number;
      explanation: string;
    }[];
  }> {
    return {
      topic,
      questions: [
        {
          question: `Which of the following best describes the core principle of ${topic}?`,
          options: [
            `A mechanism to structure data and manage control flow predictably`,
            `A hardware component inside modern GPUs`,
            `A deprecated library that is no longer recommended`,
            `An operating system kernel process`,
          ],
          correctOptionIndex: 0,
          explanation: `${topic} is fundamentally designed to organize programmatic logic and control execution flow cleanly.`,
        },
        {
          question: `When optimizing code involving ${topic}, what should you prioritize first?`,
          options: [
            `Micro-optimizing loops before measuring`,
            `Code correctness, readability, and algorithmic time complexity`,
            `Rewriting everything into assembly code`,
            `Removing all comments and whitespace`,
          ],
          correctOptionIndex: 1,
          explanation: `Correctness and clean computational complexity always come before speculative micro-optimizations.`,
        },
        {
          question: `In modern development workflows, how is ${topic} typically tested?`,
          options: [
            `Manual clicking only without automated tests`,
            `Automated unit tests covering boundary and edge cases`,
            `Skipping testing directly into production`,
            `Only through compiler warnings`,
          ],
          correctOptionIndex: 1,
          explanation: `Writing automated unit tests ensures reliable regression prevention and confidence during refactoring.`,
        },
      ],
    };
  }

  /**
   * Code Feedback & Mistake Analysis
   */
  static async analyzeMistake(code: string, errorOrOutput: string, language: string): Promise<{
    diagnosis: string;
    likelyCause: string;
    actionableFix: string;
    codeSuggestion: string;
  }> {
    return {
      diagnosis: `The execution encountered an issue or produced an unexpected result.`,
      likelyCause: errorOrOutput.includes('ReferenceError')
        ? `A variable or function is being used before it was declared or outside its accessible scope.`
        : errorOrOutput.includes('TypeError')
        ? `Attempting to perform an operation on an undefined or mismatched data type.`
        : `Logic discrepancy: The returned value differs from the expected benchmark.`,
      actionableFix: `Verify that all variables are initialized properly and inspect loop boundary conditions.`,
      codeSuggestion: `// Check variable initialization and return statements:\n// Ensure the function explicitly returns the final calculated variable.`,
    };
  }

  /**
   * Personalized Learning Plan Generator
   */
  static async generateLearningPlan(params: {
    interest: string;
    level: string;
    dailyMinutes: number;
    goals: string[];
    language: string;
  }): Promise<{
    title: string;
    durationWeeks: number;
    weeklyRoadmap: {
      week: number;
      theme: string;
      milestones: string[];
      suggestedQuests: string[];
    }[];
  }> {
    const { interest, level, dailyMinutes, goals } = params;

    return {
      title: `${level.toUpperCase()} Mastery in ${interest}`,
      durationWeeks: 4,
      weeklyRoadmap: [
        {
          week: 1,
          theme: 'Foundations & Mental Models',
          milestones: [
            `Master core syntax and vocabulary of ${interest}`,
            `Dedicate ${dailyMinutes} mins daily to complete 2 foundational quests`,
            `Earn your first 150 XP and 7-day streak`,
          ],
          suggestedQuests: ['HTML Explorer', 'JavaScript Adventurer'],
        },
        {
          week: 2,
          theme: 'Algorithmic Thinking & Problem Solving',
          milestones: [
            `Solve 5 interactive coding challenges in the Arena`,
            `Apply conditional branching and data manipulation`,
            `Engage with AI Mentor for deep code reviews`,
          ],
          suggestedQuests: ['DSA Dungeon', 'Python Problem Solver'],
        },
        {
          week: 3,
          theme: 'Architecture, APIs & Integration',
          milestones: [
            `Connect UI interfaces with dynamic backend data`,
            `Build real error handling and asynchronous operations`,
            `Form or join a team squad for collaborative challenges`,
          ],
          suggestedQuests: ['CSS Architect', 'Full-Stack Integration'],
        },
        {
          week: 4,
          theme: 'Capstone Project & Portfolio Showcase',
          milestones: [
            `Design and build an interactive portfolio project`,
            `Submit solution to the Project Showcase`,
            `Attain Level 5 and top 10 on the Global Leaderboard`,
          ],
          suggestedQuests: ['AI Explorer', 'Capstone Project Quest'],
        },
      ],
    };
  }

  /**
   * External LLM Caller (Google Gemini or OpenAI format)
   */
  private static async callExternalLLM(messages: ChatMessage[], language: string, topicContext?: string): Promise<string> {
    const isGemini = config.llm.provider.toLowerCase().includes('gemini');
    const systemPrompt = `You are the SkillQuest AI Mentor, an inspiring, encouraging, and highly technical gamified learning companion.
Language requested: ${language}.
Always guide the student with clear thinking, analogies, and step-by-step hints rather than immediately spoiling full answers.
Context topic: ${topicContext || 'General Computer Science & Programming'}.`;

    if (isGemini) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.llm.model}:generateContent?key=${config.llm.apiKey}`;
      const contents = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      // Add system prompt prefix
      contents.unshift({
        role: 'user',
        parts: [{ text: systemPrompt }]
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data: any = await response.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
    } else {
      // OpenAI-compatible endpoint
      const baseUrl = config.llm.baseUrl || 'https://api.openai.com/v1';
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.llm.apiKey}`,
        },
        body: JSON.stringify({
          model: config.llm.model || 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages,
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`LLM API error: ${response.statusText}`);
      }

      const data: any = await response.json();
      return data?.choices?.[0]?.message?.content || 'No response generated.';
    }
  }

  /**
   * Smart local fallback responses for offline or zero-key mode
   */
  private static generateSmartLocalResponse(prompt: string, language: string, context?: string): string {
    const lower = prompt.toLowerCase();
    const isHindi = language.toLowerCase().includes('hindi') || lower.includes('hindi');

    if (isHindi) {
      if (lower.includes('recursion') || lower.includes('रिकर्शन')) {
        return `नमस्ते! रिकर्शन (Recursion) को एक आसान उदाहरण से समझते हैं:
सोचिए आपके पास रूसी गुड़िया (Russian Matryoshka Doll) का एक सेट है। जब आप सबसे बड़ी गुड़िया खोलते हैं, तो अंदर एक और छोटी गुड़िया मिलती है। आप तब तक गुड़िया खोलते रहते हैं जब तक आप सबसे छोटी गुड़िया (**Base Case**) तक नहीं पहुँच जाते, जिसे और नहीं खोला जा सकता।

प्रोग्रामिंग में:
1. **Base Case:** वह शर्त जहाँ फंक्शन रुकता है।
2. **Recursive Step:** जहाँ फंक्शन खुद को एक छोटी समस्या के साथ कॉल करता है।

क्या आप इसका एक साधारण जावास्क्रिप्ट या पायथन कोड देखना चाहेंगे?`;
      }

      if (lower.includes('hint') || lower.includes('मदद') || lower.includes('इशारा')) {
        return `💡 **हिंट:** सबसे पहले यह देखें कि आपका फंक्शन क्या इनपुट ले रहा है। अगर आप लूप चला रहे हैं, तो इंडेक्स 0 से शुरू हो रहा है या 1 से? और क्या आपका बेस केस लूप को सही समय पर रोक रहा है? अपनी सोच को छोटे-छोटे चरणों में लिखें।`;
      }

      return `नमस्ते! मैं आपका **SkillQuest AI मेंटर** हूँ। मैं प्रोग्रामिंग, वेब डेवलपमेंट, डेटा स्ट्रक्चर्स (DSA), और AI अवधारणाओं में आपकी सहायता कर सकता हूँ। आप मुझसे कोई भी सवाल पूछ सकते हैं या कोडिंग समस्या में हिंट ले सकते हैं!`;
    }

    // English responses
    if (lower.includes('recursion')) {
      return `### Understanding Recursion

Think of **Recursion** like Russian Nesting Dolls (Matryoshka):
Each doll contains a slightly smaller version of itself, until you reach the solid miniature doll that cannot be opened.

In code, every recursive algorithm needs two essential parts:
1. **Base Case:** The condition that halts recursion (the solid inner doll). Without this, you get infinite calls and a \`StackOverflowError\`.
2. **Recursive Step:** Where the function calls itself with a strictly smaller or simpler input.

\`\`\`javascript
function countdown(n) {
  // 1. Base Case
  if (n <= 0) {
    console.log("🚀 Blast off!");
    return;
  }
  // 2. Work & Recursive Step
  console.log(n);
  countdown(n - 1);
}
countdown(3);
\`\`\`

Would you like to try a quick challenge to test your understanding, or dive into tree traversal?`;
    }

    if (lower.includes('debug') || lower.includes('error')) {
      return `Let's debug this systematically! 🛠️

1. **Check the Stack Trace:** Look at the exact line number where the execution broke.
2. **Print Variables:** What is the value of your variables right before the error line?
3. **Check Types:** Are you attempting to access properties on \`undefined\` or call something that isn't a function?
4. **Edge Cases:** What happens if the input is empty (\`[]\` or \`""\`)?

Paste your code and error message here, and I'll walk you through isolating the fix step-by-step!`;
    }

    if (lower.includes('hint')) {
      return `💡 **AI Mentor Hint:**
Start by writing out the expected transformations on paper. If you need to filter an array or accumulate values, consider whether a pointer or accumulator pattern works best. Avoid overcomplicating with nested loops when a single pass or hash map can solve it in $O(N)$ time!`;
    }

    if (lower.includes('javascript') || lower.includes('challenge')) {
      return `Here's a crisp challenge to sharpen your skills:

**Mission:** Write a function \`reverseWords(str)\` that takes a sentence and reverses each individual word while preserving word order.

*Example:* \`"SkillQuest AI"\` ➔ \`"tseuQllikS IA"\`

**Hints:**
- Use \`.split(' ')\` to break the string into words.
- Map over each word, split into characters, reverse, and join back.
- Join the resulting array with spaces.

Ready to test your code in the Coding Arena?`;
    }

    return `Hello Quest Explorer! 🛡️ I am your **SkillQuest AI Mentor**.

I am here to guide you through:
- Breaking down tricky algorithms and system architectures.
- Providing graduated hints when you're stuck on a coding challenge.
- Explaining core concepts in plain English or Hindi with real-world analogies.
- Generating custom practice quizzes to solidify your knowledge.

What would you like to level up today?`;
  }
}
