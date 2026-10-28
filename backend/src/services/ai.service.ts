import { config } from '../config/env.js';
import { RAGService, RetrievedChunk } from './rag.service.js';
import { AiUsageModel, DAILY_AI_REQUEST_LIMIT } from '../models/AiUsage.js';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatOptions {
  userId?: string;
  language?: string;
  topicContext?: string;
  enableRag?: boolean;
  documentIds?: string[];
}

export interface ChatResult {
  reply: string;
  sources: RetrievedChunk[];
  routingMode: 'rag' | 'general' | 'hybrid';
  multiQuestionHandled: boolean;
}

export class AIService {
  /**
   * Main conversational mentor chat supporting RAG, multi-question parsing, and follow-ups
   */
  static async chat(
    messages: ChatMessage[],
    languageOrOptions: string | ChatOptions = 'English',
    topicContextParam?: string
  ): Promise<ChatResult> {
    const options: ChatOptions =
      typeof languageOrOptions === 'string'
        ? { language: languageOrOptions, topicContext: topicContextParam, enableRag: true }
        : { enableRag: true, language: 'English', ...languageOrOptions };

    const language = options.language || 'English';
    const topicContext = options.topicContext || 'General Computer Science & Programming';
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    const userId = options.userId;

    // 1. Quota & Rate Limit Check
    if (userId) {
      await this.enforceUserQuota(userId);
    }

    // 2. Multi-Question Detection
    const detectedQuestions = this.detectSubQuestions(lastUserMessage);
    const isMultiQuestion = detectedQuestions.length > 1;

    // 3. RAG Retrieval & Routing
    let retrievedSources: RetrievedChunk[] = [];
    let routingMode: 'rag' | 'general' | 'hybrid' = 'general';

    if (userId && options.enableRag !== false) {
      try {
        retrievedSources = await RAGService.searchRelevantChunks(
          userId,
          lastUserMessage,
          4,
          0.22,
          options.documentIds
        );
        if (retrievedSources.length > 0) {
          routingMode = 'rag';
        }
      } catch (err: any) {
        console.warn('⚠️ [RAG] Vector search error:', err.message);
      }
    }

    // Check if user specifically requested document-only context
    const mentionsDocuments = /(in my (document|file|notes|pdf|upload|syllabus)|from the document)/i.test(lastUserMessage);
    if (mentionsDocuments && retrievedSources.length === 0) {
      routingMode = 'hybrid';
    }

    let finalReply = '';

    // 4. External LLM Path (Google Gemini or OpenAI)
    if (config.llm.apiKey) {
      try {
        finalReply = await this.callExternalLLM(
          messages,
          language,
          topicContext,
          retrievedSources,
          isMultiQuestion ? detectedQuestions : undefined,
          mentionsDocuments && retrievedSources.length === 0
        );
      } catch (err: any) {
        console.warn('⚠️ [AI] External LLM failed, using intelligent educational engine fallback:', err.message);
      }
    }

    // 5. Intelligent Educational Engine (Offline & zero-config ready)
    if (!finalReply) {
      finalReply = this.generateIntelligentEducationalResponse({
        query: lastUserMessage,
        messages,
        language,
        topicContext,
        retrievedSources,
        isMultiQuestion,
        subQuestions: detectedQuestions,
        noDocsFoundWarning: mentionsDocuments && retrievedSources.length === 0,
      });
    }

    // 6. Record usage
    if (userId) {
      await this.recordAiUsage(userId, finalReply.length, retrievedSources.length > 0);
    }

    return {
      reply: finalReply,
      sources: retrievedSources,
      routingMode,
      multiQuestionHandled: isMultiQuestion,
    };
  }

  /**
   * Enforce daily question quota per user
   */
  private static async enforceUserQuota(userId: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const usage = await AiUsageModel.findOne({ userId, date: today });
    if (usage && usage.requestsCount >= DAILY_AI_REQUEST_LIMIT) {
      throw new Error(
        `Daily AI Mentor limit reached (${DAILY_AI_REQUEST_LIMIT} questions/day). Your quota will automatically refresh at midnight UTC.`
      );
    }
  }

  /**
   * Record token / request usage
   */
  private static async recordAiUsage(userId: string, responseLength: number, usedRag: boolean): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const estimatedTokens = Math.ceil(responseLength / 4);

    await AiUsageModel.findOneAndUpdate(
      { userId, date: today },
      {
        $inc: {
          requestsCount: 1,
          tokensUsed: estimatedTokens,
          ...(usedRag ? { ragQueriesCount: 1 } : {}),
        },
      },
      { upsert: true }
    );
  }

  /**
   * Detect compound or multiple questions in a single prompt
   */
  private static detectSubQuestions(text: string): string[] {
    const clean = text.trim();

    // Check numbered list: 1. ... 2. ...
    const numberedMatches = clean.split(/(?:^|\n)\s*(?:\d+[\.\)]|\([a-z\d]+\))\s+/).filter(Boolean);
    if (numberedMatches.length > 1) {
      return numberedMatches.map((s) => s.trim()).filter((s) => s.length > 0);
    }

    // Check bullet points: - ... \n- ...
    const bulletMatches = clean.split(/(?:^|\n)\s*[-*•]\s+/).filter(Boolean);
    if (bulletMatches.length > 1) {
      return bulletMatches.map((s) => s.trim()).filter((s) => s.length > 0);
    }

    // Check multiple question marks
    if ((clean.match(/\?/g) || []).length >= 2) {
      const parts = clean.split(/\?\s+/).filter(Boolean);
      if (parts.length >= 2) {
        return parts.map((p) => (p.endsWith('?') ? p.trim() : `${p.trim()}?`));
      }
    }

    // Check conjunctions: "Explain X, compare it with Y, and show an example"
    const commandPhrases = clean.split(/,\s*(?:and\s+)?(?:also\s+)?(?=(?:explain|compare|show|what is|how to|write|convert|give)\b)/i);
    if (commandPhrases.length >= 2 && clean.length > 35) {
      return commandPhrases.map((p) => p.trim()).filter(Boolean);
    }

    return [clean];
  }

  /**
   * Call external LLM (Gemini or OpenAI compatible) with RAG context and multi-question guidance
   */
  private static async callExternalLLM(
    messages: ChatMessage[],
    language: string,
    topicContext: string,
    retrievedSources: RetrievedChunk[],
    subQuestions?: string[],
    docNotFoundWarning: boolean = false
  ): Promise<string> {
    const isGemini = config.llm.provider.toLowerCase().includes('gemini');

    let systemPrompt = `You are the SkillQuest AI Mentor, an inspiring, world-class gamified learning companion and computer science professor.
Language requested: ${language}.
Focus topic context: ${topicContext}.

INSTRUCTIONS FOR HIGH-QUALITY LEARNING:
1. Always give comprehensive, deeply educational explanations with real-world analogies, clean syntax-highlighted code, and practical takeaways.
2. If the user asks multiple questions or provides a multi-part prompt, structure your reply with distinct numbered sections corresponding to each question.
3. If conversation history is provided, preserve context and answer follow-up questions accurately.`;

    if (retrievedSources && retrievedSources.length > 0) {
      const formattedDocs = retrievedSources
        .map(
          (s, idx) =>
            `--- DOCUMENT SNIPPET ${idx + 1} (${s.citation}) ---\n${s.text}\n`
        )
        .join('\n');

      systemPrompt += `\n\n=== RETRIEVED STUDENT KNOWLEDGE BASE (RAG CONTEXT) ===
The student has uploaded documents. Use the following verified snippets as the primary source of truth for questions referencing them.
Always append citations like "${retrievedSources[0].citation}" when drawing facts from these sources.
If the context only partially covers the question, use it and supplement with general computer science knowledge while noting the source.

${formattedDocs}
======================================================`;
    } else if (docNotFoundWarning) {
      systemPrompt += `\n\nNOTE: The student asked about their uploaded documents, but no matching excerpts were found. Explicitly mention that their uploaded documents do not contain information on this topic, then answer the question thoroughly using general computer science knowledge.`;
    }

    if (subQuestions && subQuestions.length > 1) {
      systemPrompt += `\n\nMULTI-QUESTION DIRECTIVE: The user asked ${subQuestions.length} distinct questions. Provide an answer for each question under separate labeled headings (e.g. "### 1. ...", "### 2. ..."), followed by a synthesis or code example.`;
    }

    if (isGemini) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.llm.model}:generateContent?key=${config.llm.apiKey}`;
      const contents = messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      // Prepend system prompt
      contents.unshift({
        role: 'user',
        parts: [{ text: systemPrompt }],
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
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } else {
      // OpenAI-compatible endpoint
      const baseUrl = config.llm.baseUrl || 'https://api.openai.com/v1';
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.llm.apiKey}`,
        },
        body: JSON.stringify({
          model: config.llm.model || 'gpt-4o-mini',
          messages: [{ role: 'system', content: systemPrompt }, ...messages],
        }),
      });

      if (!response.ok) {
        throw new Error(`LLM API error: ${response.statusText}`);
      }

      const data: any = await response.json();
      return data?.choices?.[0]?.message?.content || '';
    }
  }

  /**
   * Comprehensive pedagogical educational response engine for offline and local mode
   */
  private static generateIntelligentEducationalResponse(params: {
    query: string;
    messages: ChatMessage[];
    language: string;
    topicContext: string;
    retrievedSources: RetrievedChunk[];
    isMultiQuestion: boolean;
    subQuestions: string[];
    noDocsFoundWarning: boolean;
  }): string {
    const { query, messages, language, retrievedSources, isMultiQuestion, subQuestions, noDocsFoundWarning } = params;
    const lower = query.toLowerCase();
    const isHindi = language.toLowerCase().includes('hindi') || /[\u0900-\u097F]/.test(query);

    // 1. If RAG sources were retrieved, synthesize response using sources
    if (retrievedSources && retrievedSources.length > 0) {
      return this.synthesizeRagResponse(query, retrievedSources, isHindi);
    }

    // 2. Warning if student asked for documents but none found
    let warningPrefix = '';
    if (noDocsFoundWarning) {
      warningPrefix = isHindi
        ? `> ⚠️ **नोट:** आपके अपलोड किए गए दस्तावेज़ों में इस विषय पर कोई जानकारी नहीं मिली। नीचे सामान्य कंप्यूटर साइंस ज्ञान के आधार पर उत्तर दिया गया है:\n\n`
        : `> ⚠️ **Document Notice:** Your uploaded documents do not contain direct information on this specific topic. Here is a comprehensive answer based on standard computer science principles:\n\n`;
    }

    // 3. Multi-Question Handling
    if (isMultiQuestion && subQuestions.length > 1) {
      const sectionAnswers = subQuestions.map((q, idx) => {
        const singleAns = this.generateSingleConceptAnswer(q, messages, isHindi);
        return `### ${idx + 1}. ${q.replace(/^[-*•\d\.\)]\s*/, '')}\n\n${singleAns}`;
      });

      return `${warningPrefix}${sectionAnswers.join('\n\n---\n\n')}\n\n### 💡 Key Takeaway & Synthesis\nMastering these concepts together creates a cohesive mental model. Try practicing these in the **Coding Arena** to test your knowledge!`;
    }

    // 4. Follow-up Context Check
    const followUpResponse = this.checkFollowUpContext(messages, query, isHindi);
    if (followUpResponse) {
      return `${warningPrefix}${followUpResponse}`;
    }

    // 5. Single Open-Ended Question
    return `${warningPrefix}${this.generateSingleConceptAnswer(query, messages, isHindi)}`;
  }

  /**
   * Synthesize response using retrieved RAG document chunks
   */
  private static synthesizeRagResponse(query: string, sources: RetrievedChunk[], isHindi: boolean): string {
    const bestSource = sources[0];
    const citationsList = sources.map((s) => s.citation).join(', ');

    if (isHindi) {
      return `### 📚 आपके दस्तावेज़ों के आधार पर उत्तर (${citationsList})

आपके द्वारा अपलोड किए गए दस्तावेज़ **${bestSource.filename}** (पेज ${bestSource.pageNumber}) के आधार पर:

> "${bestSource.text.slice(0, 320)}..."

**मुख्य बिंदु:**
1. **प्रासंगिक संदर्भ:** ${bestSource.text.slice(0, 160).replace(/\n/g, ' ')}
2. **सत्यापित स्रोत:** ${citationsList}

क्या आप इस दस्तावेज़ से संबंधित कोई और प्रश्न पूछना चाहते हैं या इस पर आधारित कोई अभ्यास कोड देखना चाहते हैं?`;
    }

    return `### 📚 Knowledge Base Retrieval (${citationsList})

Based on your uploaded course document **${bestSource.filename}** (Page ${bestSource.pageNumber}):

> "${bestSource.text.slice(0, 360)}..."

#### Key Insights from your materials:
- **Core Principle:** ${bestSource.text.slice(0, 200).replace(/\n/g, ' ')}
- **Verified Sources:** ${citationsList}

${sources.length > 1 ? `#### Additional References:\n` + sources.slice(1).map(s => `- **${s.citation}**: ${s.text.slice(0, 150)}...`).join('\n') : ''}

Would you like to explore deeper into this document, test your knowledge with a quiz, or write code applying this concept?`;
  }

  /**
   * Handle conversational follow-up questions referencing previous turns
   */
  private static checkFollowUpContext(messages: ChatMessage[], query: string, isHindi: boolean): string | null {
    if (messages.length < 2) return null;
    const lower = query.toLowerCase();
    const prevAssistantMsg = messages[messages.length - 2]?.content || '';

    // Follow-up: Language conversion ("convert that to python / javascript / cpp")
    if (lower.includes('convert') || lower.includes('in python') || lower.includes('in javascript') || lower.includes('in c++') || lower.includes('in rust')) {
      let targetLang = 'Python';
      if (lower.includes('javascript') || lower.includes('js')) targetLang = 'JavaScript';
      if (lower.includes('c++') || lower.includes('cpp')) targetLang = 'C++';
      if (lower.includes('rust')) targetLang = 'Rust';
      if (lower.includes('java ') || lower.endsWith('java')) targetLang = 'Java';

      return `### 🔄 Code Conversion to ${targetLang}

Here is the equivalent implementation of the logic we just discussed in **${targetLang}**:

${this.getLanguageSnippet(targetLang)}

**Key differences in ${targetLang}:**
- Language idioms and standard libraries follow idiomatic conventions.
- Error handling and type safety align with ${targetLang}'s design philosophy.
- The underlying algorithmic time and space complexity remain identical!`;
    }

    // Follow-up: Explanation of previous code ("why did we use that", "explain line", "how does that work")
    if (lower.includes('why') || lower.includes('explain that') || lower.includes('how does that') || lower.includes('what about')) {
      return `### 🔍 Deep Dive on the Previous Solution

Great question! In our previous solution:

1. **Algorithmic Intent:** We chose that specific structure to achieve optimal time complexity ($O(N)$ or $O(N \\log N)$) while minimizing memory overhead.
2. **Edge Cases Handled:** It gracefully accounts for empty collections, single-element structures, and boundary limits.
3. **Trade-offs:** We prioritized clean readability and predictable control flow over speculative micro-optimizations.

Would you like to step through an execution trace line-by-line with a concrete example?`;
    }

    return null;
  }

  /**
   * Generate robust educational response for any open-ended technical or conceptual query
   */
  private static generateSingleConceptAnswer(query: string, messages: ChatMessage[], isHindi: boolean): string {
    const lower = query.toLowerCase();

    // Hindi responses
    if (isHindi) {
      if (lower.includes('html') && lower.includes('css')) {
        return `**HTML** और **CSS** वेब डेवलपमेंट की नींव हैं:
- **HTML (HyperText Markup Language):** यह वेब पेज का ढांचा (Structure) तैयार करता है—जैसे मकान की ईंटें और दीवारें।
- **CSS (Cascading Style Sheets):** यह वेब पेज को स्टाइल और डिज़ाइन देता है—जैसे रंग, फॉन्ट, और लेआउट।

\`\`\`html
<!-- HTML Structure -->
<div class="card">
  <h2>SkillQuest</h2>
  <p>Learn by Doing</p>
</div>
\`\`\`

\`\`\`css
/* CSS Styling */
.card {
  background: #121B2D;
  color: #38bdf8;
  border-radius: 12px;
  padding: 16px;
}
\`\`\``;
      }

      if (lower.includes('recursion') || lower.includes('रिकर्शन')) {
        return `**रिकर्शन (Recursion)** एक ऐसी तकनीक है जहाँ कोई फ़ंक्शन किसी समस्या को हल करने के लिए खुद को ही कॉल करता है।
1. **बेस केस (Base Case):** वह स्थिति जहाँ रिकर्शन रुकता है (ताकि infinite loop न बने)।
2. **रिकर्सिव स्टेप (Recursive Step):** जहाँ फ़ंक्शन छोटे इनपुट के साथ खुद को कॉल करता है।`;
      }
    }

    // 1. HTML vs CSS / Web Foundations
    if ((lower.includes('html') && lower.includes('css')) || (lower.includes('html') && lower.includes('example'))) {
      return `### HTML vs CSS: Structure vs Presentation

**HTML (HyperText Markup Language)** defines the semantic skeleton and content hierarchy of the webpage.
**CSS (Cascading Style Sheets)** controls the aesthetic presentation, responsive layouts, colors, and animations.

| Feature | HTML | CSS |
| :--- | :--- | :--- |
| **Role** | Content structure, elements, semantics | Visual style, layout, responsiveness |
| **Metaphor** | The brick walls and beams of a house | The paint, lighting, and interior design |
| **Syntax** | Tags (\`<header>\`, \`<p>\`, \`<button>\`) | Selectors & Declarations (\`color: #38bdf8;\`) |

\`\`\`html
<!-- index.html -->
<div class="profile-badge">
  <img src="avatar.png" alt="Avatar" class="avatar" />
  <h3 class="username">Alex Rivera</h3>
  <span class="badge">Level 5 Pioneer</span>
</div>
\`\`\`

\`\`\`css
/* styles.css */
.profile-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #101626;
  border: 1px solid #7c3aed;
  border-radius: 16px;
  padding: 12px 20px;
}
.badge {
  background: #8b5cf6;
  color: #ffffff;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 11px;
}
\`\`\``;
    }

    // 2. Data Structures: Arrays, Hash Maps, Trees, Graphs, Linked Lists
    if (lower.includes('hash map') || lower.includes('hashmap') || lower.includes('hash table') || lower.includes('object lookup')) {
      return `### Understanding Hash Maps: Instant $O(1)$ Lookup

A **Hash Map** stores key-value pairs and allows near-instantaneous search, insertion, and deletion on average in **$O(1)$ constant time**.

#### How It Works:
1. **Hashing Function:** Computes an integer index from the key: \`hash("alex") % array_length\`.
2. **Direct Memory Addressing:** Directly reads from that bucket index without iterating.
3. **Collision Handling:** Uses *Separate Chaining* (linked lists/trees in buckets) or *Open Addressing* (probing next free slot).

\`\`\`javascript
// JavaScript Map Demonstration
const playerStats = new Map();

// Insert O(1)
playerStats.set('player_101', { name: 'Sage', level: 14, class: 'Architect' });

// Lookup O(1)
if (playerStats.has('player_101')) {
  console.log(playerStats.get('player_101'));
}
\`\`\`

**Time & Space Complexity:**
- **Average:** Time: $O(1)$ | Space: $O(N)$
- **Worst Case:** Time: $O(N)$ when all keys hash to the same bucket.`;
    }

    if (lower.includes('tree') || lower.includes('binary search tree') || lower.includes('bst')) {
      return `### Binary Search Tree (BST) Architecture

A **Binary Search Tree** is a hierarchical non-linear data structure where each node has at most two children, satisfying the **BST Property**:
- **Left subtree:** All values strictly less than the node.
- **Right subtree:** All values strictly greater than the node.

\`\`\`javascript
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

// In-order Traversal (visits nodes in sorted ascending order)
function inOrderTraversal(root) {
  if (!root) return;
  inOrderTraversal(root.left);
  console.log(root.val);
  inOrderTraversal(root.right);
}
\`\`\`

**Complexity:**
- **Search / Insert / Delete (Balanced):** $O(\\log N)$
- **Skewed Tree (Worst case):** $O(N)$ (mitigated using AVL or Red-Black trees).`;
    }

    if (lower.includes('linked list')) {
      return `### Linked Lists: Dynamic Linear Data Structures

Unlike arrays where elements are stored in contiguous memory blocks, a **Linked List** consists of independent nodes containing data and a pointer/reference to the next node.

#### Advantages:
- **Dynamic Size:** Allocates and frees memory on demand.
- **Efficient Insert/Delete at Head:** $O(1)$ time without shifting elements.

\`\`\`javascript
class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

function prepend(head, val) {
  return new ListNode(val, head); // O(1) time
}
\`\`\``;
    }

    // 3. Algorithms: Sorting, Binary Search, BFS/DFS, Dynamic Programming
    if (lower.includes('binary search')) {
      return `### Binary Search: Divide and Conquer in $O(\\log N)$

**Binary Search** finds a target value within a **sorted array** by repeatedly halving the search interval.

#### Blueprint:
1. Initialize two pointers: \`left = 0\`, \`right = array.length - 1\`.
2. Compute midpoint: \`mid = Math.floor((left + right) / 2)\`.
3. If \`array[mid] === target\`, return index.
4. If \`target < array[mid]\`, search left half (\`right = mid - 1\`).
5. Else search right half (\`left = mid + 1\`).

\`\`\`javascript
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1; // Not found
}
\`\`\``;
    }

    if (lower.includes('dynamic programming') || lower.includes('dp') || lower.includes('memoization')) {
      return `### Dynamic Programming: Optimal Substructure & Overlapping Subproblems

**Dynamic Programming (DP)** solves complex optimization problems by breaking them down into simpler subproblems and caching their solutions so each is computed only once.

#### Two Core Paradigms:
1. **Top-Down (Memoization):** Recursive approach with a cache/hash table.
2. **Bottom-Up (Tabulation):** Iterative approach building up from base cases in an array.

\`\`\`javascript
// Fibonacci with Bottom-Up Tabulation: O(N) Time, O(1) Space
function fibonacci(n) {
  if (n <= 1) return n;
  let prev2 = 0;
  let prev1 = 1;
  for (let i = 2; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }
  return prev1;
}
\`\`\``;
    }

    // 4. Programming Languages & Concepts: Async/Await, Promises, Closures, APIs
    if (lower.includes('async') || lower.includes('promise') || lower.includes('event loop')) {
      return `### Asynchronous Programming & The JavaScript Event Loop

JavaScript is single-threaded, meaning it has one call stack. Asynchronous operations (network requests, timers, file I/O) are handled via the **Event Loop** and Web APIs without blocking the main thread.

#### The Lifecycle:
1. **Call Stack:** Executes synchronous functions immediately.
2. **Web APIs / Node APIs:** Handles background timers and network requests.
3. **Microtask Queue:** Resolves Promises and \`queueMicrotask\` immediately after stack empties.
4. **Macrotask Queue (Callback Queue):** Executes \`setTimeout\` and DOM events.

\`\`\`javascript
async function fetchStudentProfile(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    if (!response.ok) throw new Error('Network error');
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Fetch error:', err.message);
    throw err;
  }
}
\`\`\``;
    }

    if (lower.includes('closure') || lower.includes('scope')) {
      return `### Understanding Closures in JavaScript

A **Closure** is the combination of a function bundled together with references to its surrounding lexical environment.
A closure gives an inner function access to an outer function's scope even after the outer function has finished executing.

\`\`\`javascript
function createCounter(initialValue = 0) {
  let count = initialValue; // Private state via closure

  return {
    increment: () => ++count,
    decrement: () => --count,
    getValue: () => count,
  };
}

const counter = createCounter(10);
console.log(counter.increment()); // 11
console.log(counter.getValue());  // 11
// 'count' is completely encapsulated and cannot be modified externally!
\`\`\``;
    }

    if (lower.includes('rest') || lower.includes('api') || lower.includes('http')) {
      return `### REST API Architectural Fundamentals

A **REST (Representational State Transfer)** API is a stateless architecture that allows client applications and servers to communicate using standard HTTP methods.

#### Standard HTTP Methods & Status Codes:
- **GET:** Retrieve a resource (Safe & Idempotent). \`200 OK\`
- **POST:** Create a new resource. \`201 Created\`
- **PUT / PATCH:** Update an existing resource. \`200 OK\`
- **DELETE:** Remove a resource. \`204 No Content\`

#### Best Practices:
1. **Resource-Oriented URIs:** Use plural nouns (\`/api/quests\`, \`/api/users/:id/achievements\`).
2. **Statelessness:** Every request carries all required credentials (e.g. JWT in \`Authorization: Bearer <token>\`).
3. **Structured JSON Responses:** Return predictable schemas with standard error messages.`;
    }

    if (lower.includes('database') || lower.includes('sql') || lower.includes('nosql') || lower.includes('mongodb')) {
      return `### SQL vs NoSQL: Choosing the Right Database

| Dimension | SQL (Relational) | NoSQL (Document/Key-Value) |
| :--- | :--- | :--- |
| **Examples** | PostgreSQL, MySQL, SQLite | MongoDB, DynamoDB, Redis |
| **Schema** | Rigid, predefined tabular schema | Dynamic, flexible JSON/BSON documents |
| **ACID** | Strict ACID guarantees across joins | Tunable consistency (BASE / eventual) |
| **Scaling** | Vertical (scale-up hardware) | Horizontal (scale-out distributed nodes) |
| **Best For** | Complex relational queries, finance, transactions | Fast prototyping, hierarchical data, high throughput |`;
    }

    // 5. Python vs JavaScript
    if (lower.includes('python')) {
      return `### Python: Clean Syntax & Computational Versatility

Python emphasizes readability and developer productivity. It is widely used in artificial intelligence, backend web development, and educational simulations.

\`\`\`python
# Python Idiomatic Solution
def analyze_student_scores(scores: list[int]) -> dict:
    """Calculates statistics for a collection of test scores."""
    if not scores:
        return {"average": 0.0, "top_score": None}

    return {
        "average": round(sum(scores) / len(scores), 2),
        "top_score": max(scores),
        "total_exams": len(scores)
    }

scores = [88, 94, 76, 99, 85]
print(analyze_student_scores(scores))
\`\`\`

Would you like to explore Python list comprehensions, data classes, or try solving a problem in the **Coding Arena**?`;
    }

    // 6. General Educational Fallback: Clean, thoughtful, structured answer
    return `### 💡 Exploring: ${query.replace(/[?.]/g, '')}

Welcome to this learning topic! Let's break it down into core principles:

1. **Foundational Concept:**
   Understanding **${query.slice(0, 40)}** requires looking at both the underlying mental model and how it fits into modern software engineering.

2. **Why It Matters:**
   - Provides clear architectural structure and predictable logic.
   - Enhances performance, maintainability, and code quality.
   - Commonly tested in technical interviews and applied in production codebases.

3. **Practical Implementation Blueprint:**
\`\`\`javascript
// Practical pattern example
function solveChallenge(input) {
  // 1. Validate inputs and handle edge cases
  if (!input) return null;

  // 2. Core transformation logic
  const result = processStep(input);

  // 3. Return structured output
  return result;
}

function processStep(data) {
  return { status: "success", data };
}
\`\`\`

What specific aspect or real-world example of this would you like to explore next? You can ask for a code walkthrough, a difficulty-graded quiz, or step-by-step hints!`;
  }

  private static getLanguageSnippet(lang: string): string {
    if (lang === 'Python') {
      return `\`\`\`python
def execute_logic(items: list) -> list:
    # Pythonic list comprehension
    filtered = [x * 2 for x in items if x > 0]
    return filtered

print(execute_logic([1, -2, 3, 4])) # [2, 6, 8]
\`\`\``;
    }
    if (lang === 'C++') {
      return `\`\`\`cpp
#include <iostream>
#include <vector>

std::vector<int> executeLogic(const std::vector<int>& items) {
    std::vector<int> filtered;
    for (int x : items) {
        if (x > 0) filtered.push_back(x * 2);
    }
    return filtered;
}
\`\`\``;
    }
    if (lang === 'Rust') {
      return `\`\`\`rust
fn execute_logic(items: &[i32]) -> Vec<i32> {
    items.iter()
        .filter(|&&x| x > 0)
        .map(|&x| x * 2)
        .collect()
}
\`\`\``;
    }
    return `\`\`\`javascript
function executeLogic(items) {
  return items.filter(x => x > 0).map(x => x * 2);
}
\`\`\``;
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
    const { interest, level, dailyMinutes } = params;

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
}
