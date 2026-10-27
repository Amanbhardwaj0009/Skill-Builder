import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Quest } from '../models/Quest.js';
import { Challenge } from '../models/Challenge.js';
import { Achievement } from '../models/Achievement.js';
import { Project } from '../models/Project.js';
import { Team } from '../models/Team.js';
import { XPTransaction } from '../models/XPTransaction.js';
import { QuestProgress } from '../models/QuestProgress.js';

export const seedInitialData = async () => {
  const existingQuestCount = await Quest.countDocuments();
  if (existingQuestCount > 0) {
    console.log(`[Seed] Database already contains ${existingQuestCount} quests. Skipping full re-seed.`);
    return;
  }

  console.log('🌱 [Seed] Populating SkillQuest AI database with quests, challenges, and users...');

  // 1. Achievements
  const achievementsData = [
    {
      code: 'first_quest',
      title: 'First Blood',
      description: 'Complete your first quest mission.',
      icon: 'Sword',
      category: 'quest',
      conditionType: 'quest_count',
      threshold: 1,
      xpReward: 50,
    },
    {
      code: 'five_quests',
      title: 'Quest Master',
      description: 'Conquer 5 complete quests across any tracks.',
      icon: 'Shield',
      category: 'quest',
      conditionType: 'quest_count',
      threshold: 5,
      xpReward: 150,
    },
    {
      code: 'first_code',
      title: 'Syntax Sorcerer',
      description: 'Successfully solve your first coding arena challenge.',
      icon: 'Code2',
      category: 'challenge',
      conditionType: 'challenge_count',
      threshold: 1,
      xpReward: 50,
    },
    {
      code: 'streak_3',
      title: 'Consistency Spark',
      description: 'Maintain a 3-day active learning streak.',
      icon: 'Flame',
      category: 'streak',
      conditionType: 'streak_days',
      threshold: 3,
      xpReward: 75,
    },
    {
      code: 'streak_7',
      title: 'Unstoppable Momentum',
      description: 'Maintain a 7-day active learning streak.',
      icon: 'Zap',
      category: 'streak',
      conditionType: 'streak_days',
      threshold: 7,
      xpReward: 200,
    },
    {
      code: 'xp_500',
      title: 'Rising Hero',
      description: 'Amass 500 total XP throughout your journey.',
      icon: 'Trophy',
      category: 'quest',
      conditionType: 'xp_earned',
      threshold: 500,
      xpReward: 100,
    },
    {
      code: 'first_project',
      title: 'Grand Architect',
      description: 'Complete and submit your first real-world project.',
      icon: 'Layers',
      category: 'project',
      conditionType: 'project_count',
      threshold: 1,
      xpReward: 150,
    },
    {
      code: 'squad_recruit',
      title: 'United Front',
      description: 'Join or create a learning squad.',
      icon: 'Users',
      category: 'team',
      conditionType: 'team_joined',
      threshold: 1,
      xpReward: 50,
    },
  ];

  await Achievement.deleteMany({});
  await Achievement.insertMany(achievementsData);
  console.log(`✅ [Seed] Inserted ${achievementsData.length} achievements.`);

  // 2. Demo Users
  const salt = await bcrypt.genSalt(10);
  const studentPasswordHash = await bcrypt.hash('StudentPass123!', salt);
  const adminPasswordHash = await bcrypt.hash('AdminPass123!', salt);

  const studentUser = await User.create({
    name: 'Alex Mercer',
    email: 'student@skillquest.ai',
    passwordHash: studentPasswordHash,
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AlexMercer',
    currentXP: 320,
    currentLevel: 2,
    preferredLanguage: 'English',
    interests: ['Web Development', 'JavaScript', 'Artificial Intelligence'],
    skillLevel: 'intermediate',
    learningGoals: ['Master Full-Stack', 'Learn Algorithmic Patterns', 'Build AI Assistants'],
    dailyStudyMinutes: 45,
    onboardingCompleted: true,
    streak: {
      currentStreak: 4,
      longestStreak: 7,
      lastActiveDate: new Date().toISOString().split('T')[0],
    },
    privacy: { isPublic: true, showOnLeaderboard: true },
  });

  const adminUser = await User.create({
    name: 'Commander Nova',
    email: 'admin@skillquest.ai',
    passwordHash: adminPasswordHash,
    role: 'administrator',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=CommanderNova',
    currentXP: 1450,
    currentLevel: 4,
    preferredLanguage: 'English',
    interests: ['Web Development', 'Python', 'Data Structures and Algorithms', 'Artificial Intelligence'],
    skillLevel: 'advanced',
    learningGoals: ['Platform Governance', 'Curriculum Design'],
    dailyStudyMinutes: 60,
    onboardingCompleted: true,
    streak: {
      currentStreak: 12,
      longestStreak: 21,
      lastActiveDate: new Date().toISOString().split('T')[0],
    },
    privacy: { isPublic: true, showOnLeaderboard: true },
  });

  // Seed demo rivals for a lively leaderboard
  const rivalUsers = [
    { name: 'Elena Rostova', email: 'elena@example.com', currentXP: 980, currentLevel: 3, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Elena' },
    { name: 'Marcus Vance', email: 'marcus@example.com', currentXP: 820, currentLevel: 3, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Marcus' },
    { name: 'Zara Chen', email: 'zara@example.com', currentXP: 640, currentLevel: 2, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Zara' },
    { name: 'Kai Takahashi', email: 'kai@example.com', currentXP: 510, currentLevel: 2, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Kai' },
  ];

  for (const rival of rivalUsers) {
    const rivalHash = await bcrypt.hash('RivalPass123!', salt);
    await User.create({
      ...rival,
      passwordHash: rivalHash,
      role: 'student',
      onboardingCompleted: true,
      interests: ['Python', 'Data Structures and Algorithms'],
      streak: { currentStreak: 3, longestStreak: 5, lastActiveDate: new Date().toISOString().split('T')[0] },
      privacy: { isPublic: true, showOnLeaderboard: true },
    });
  }

  // 3. Quests
  const questsData = [
    {
      title: 'HTML Explorer: Foundations of the Web',
      slug: 'html-explorer',
      description: 'Venture into the foundational building blocks of the World Wide Web. Learn semantic HTML tags, structural layout, and construct an interactive developer showcase.',
      category: 'Web Development',
      difficulty: 'beginner',
      learningObjectives: [
        'Understand DOM tree hierarchy and semantic element usage',
        'Build structured forms, tables, and hyperlinks',
        'Create accessible semantic markups for screen readers',
      ],
      estimatedDuration: '25 mins',
      xpReward: 60,
      prerequisites: [],
      published: true,
      stages: [
        {
          stageNumber: 1,
          title: 'The Semantic Skeleton',
          type: 'concept',
          content: `### Welcome to the Realm of HTML

HTML (**HyperText Markup Language**) is the essential skeleton of every website in existence. Unlike programming languages that execute computations, HTML provides **structure and meaning** to raw data.

Modern web standards strictly require **Semantic Elements**:
- \`<header>\`: Introductory content and site navigation
- \`<nav>\`: Set of navigation links
- \`<main>\`: The central unique content of the page
- \`<article>\`: Standalone self-contained composition
- \`<section>\`: Thematic grouping of content
- \`<footer>\`: Authorship, copyright, and auxiliary links

Using semantic tags boosts search engine optimization (SEO) and ensures accessibility for assistive screen readers.`,
          codeExample: `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>My First Cyber Page</title>
  </head>
  <body>
    <header>
      <h1>SkillQuest Terminal</h1>
    </header>
    <main>
      <section>
        <h2>Status: Active</h2>
        <p>System operational and ready for mission commands.</p>
      </section>
    </main>
  </body>
</html>`,
        },
        {
          stageNumber: 2,
          title: 'Reviewing Semantic Architecture',
          type: 'example',
          content: `### Deconstructing a Clean Web Document

Notice how each element nests cleanly within its parent container without overlapping tags:

1. \`<section>\` groups related elements together with a descriptive heading (\`<h2>\`).
2. \`<article>\` is ideal for blog posts or quest logs that could be syndicated anywhere.
3. Accessible form controls always connect an \`<input>\` with a descriptive \`<label>\` using the \`for\` and \`id\` attributes.`,
          codeExample: `<article class="quest-log">
  <h3>Mission Log: Alpha</h3>
  <p>Telemetry data collected successfully.</p>
  <button type="button">Confirm Uplink</button>
</article>`,
        },
        {
          stageNumber: 3,
          title: 'Checkpoint: Semantic Precision',
          type: 'quiz',
          content: `Test your mastery of HTML standards before proceeding to the live arena challenge.`,
          quiz: {
            question: 'Which HTML element should wrap the dominant, unique content of a webpage to adhere to accessibility standards?',
            options: [
              '<div id="content">',
              '<main>',
              '<section>',
              '<body>',
            ],
            correctOptionIndex: 1,
            explanation: '<main> represents the dominant, non-repeated content of the <body>. There must not be more than one visible <main> element in a document.',
          },
        },
        {
          stageNumber: 4,
          title: 'Live Arena: Construct a Profile Badge',
          type: 'challenge',
          content: `### Your Mission:
Construct a cybernetic profile card containing:
1. A \`<header>\` with a \`<h1>\` tag containing your hero name.
2. A \`<p>\` tag describing your quest status.
3. A \`<button>\` tag with text "Initiate Quest".`,
          challenge: {
            prompt: 'Build a cybernetic profile card using semantic tags.',
            starterCode: `<div class="card">
  <!-- Insert header, h1, p, and button tags here -->
  <header>
    <h1>Agent Zero</h1>
  </header>
  <p>Status: Ready for quest deployment.</p>
  <button>Initiate Quest</button>
</div>`,
            language: 'html',
            testCases: [
              {
                input: 'Check header tag',
                expectedOutput: '<header>',
                isHidden: false,
              },
              {
                input: 'Check button element',
                expectedOutput: '<button',
                isHidden: false,
              },
              {
                input: 'Check h1 heading',
                expectedOutput: '<h1',
                isHidden: true,
              },
            ],
          },
        },
        {
          stageNumber: 5,
          title: 'Mission Debrief & Next Horizon',
          type: 'concept',
          content: `### Outstanding Execution!

You have mastered the foundational semantics of the web. With HTML structure securely under your belt, your next step is **CSS Architect**, where you will wield stylesheets to craft responsive layouts, glowing gradients, and futuristic flexbox matrices.`,
        },
      ],
    },
    {
      title: 'CSS Architect: Styling the Cyber Grid',
      slug: 'css-architect',
      description: 'Master visual styling, Flexbox layout algorithms, CSS Grid matrices, responsive viewport units, and neon glassmorphism aesthetics.',
      category: 'Web Development',
      difficulty: 'beginner',
      learningObjectives: [
        'Harness Flexbox for dynamic, one-dimensional alignments',
        'Design responsive layouts using modern media queries and rem units',
        'Implement glowing gradients, box shadows, and transitions',
      ],
      estimatedDuration: '30 mins',
      xpReward: 70,
      prerequisites: ['html-explorer'],
      published: true,
      stages: [
        {
          stageNumber: 1,
          title: 'The Power of Modern Flexbox',
          type: 'concept',
          content: `### Mastering the Flexbox Axis

In classic CSS, centering elements was notoriously difficult. Modern Flexbox completely transformed web layout:

- \`display: flex;\` activates the flex container.
- \`justify-content\` controls distribution along the **Main Axis** (\`flex-start\`, \`center\`, \`space-between\`).
- \`align-items\` controls positioning along the **Cross Axis** (\`stretch\`, \`center\`, \`flex-start\`).
- \`gap\` cleanly spaces child items without margin hacks.`,
          codeExample: `.hud-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  background: #121B2D;
  padding: 1.25rem;
  border-radius: 12px;
}`,
        },
        {
          stageNumber: 2,
          title: 'Glassmorphism & Cyber Gradients',
          type: 'example',
          content: `### Crafting the Dark Futuristic Aesthetic

To achieve the SkillQuest neon look:
1. Use dark charcoal backgrounds (\`#080B14\`).
2. Add a translucent backdrop with blur: \`backdrop-filter: blur(16px)\`.
3. Add a soft border with purple or cyan alpha: \`border: 1px solid rgba(139, 92, 246, 0.3)\`.
4. Apply an ambient drop shadow with matching glow!`,
          codeExample: `.glass-panel {
  background: rgba(18, 27, 45, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(56, 189, 248, 0.3);
  box-shadow: 0 0 20px rgba(56, 189, 248, 0.2);
  border-radius: 16px;
}`,
        },
        {
          stageNumber: 3,
          title: 'Checkpoint: Flexbox Mastery',
          type: 'quiz',
          content: `Verify your understanding of Flexbox alignment properties.`,
          quiz: {
            question: 'Which CSS property centers flex children perpendicularly along the cross-axis?',
            options: [
              'justify-content: center;',
              'align-items: center;',
              'text-align: center;',
              'float: center;',
            ],
            correctOptionIndex: 1,
            explanation: 'align-items aligns flex items along the cross axis (vertically in a row container).',
          },
        },
        {
          stageNumber: 4,
          title: 'Challenge: Perfect Cyber Alignment',
          type: 'challenge',
          content: `Create a centered action container with \`display: flex\`, \`justify-content: center\`, and \`align-items: center\`.`,
          challenge: {
            prompt: 'Declare a flex container centered on both axes.',
            starterCode: `<div style="display: flex; justify-content: center; align-items: center; min-height: 120px;">
  <span class="badge">MISSION READY</span>
</div>`,
            language: 'html',
            testCases: [
              {
                input: 'Verify flex display',
                expectedOutput: 'display: flex',
                isHidden: false,
              },
              {
                input: 'Verify justify-content',
                expectedOutput: 'justify-content: center',
                isHidden: false,
              },
              {
                input: 'Verify align-items',
                expectedOutput: 'align-items: center',
                isHidden: true,
              },
            ],
          },
        },
      ],
    },
    {
      title: 'JavaScript Adventurer: Logic and Automation',
      slug: 'javascript-adventurer',
      description: 'Unlock programming superpowers. Explore variables, higher-order functions, async control flow, and algorithmic problem-solving.',
      category: 'JavaScript',
      difficulty: 'beginner',
      learningObjectives: [
        'Master const, let, and arrow function syntax',
        'Transform datasets using map, filter, and reduce',
        'Handle asynchronous promises and async/await cleanly',
      ],
      estimatedDuration: '35 mins',
      xpReward: 80,
      prerequisites: ['html-explorer'],
      published: true,
      stages: [
        {
          stageNumber: 1,
          title: 'Functional Transformations',
          type: 'concept',
          content: `### Transforming Data Like a Pro

Modern JavaScript prioritizes declarative array methods over manual \`for\` loops:

- \`.map(fn)\`: Transforms each item into a new array.
- \`.filter(fn)\`: Retains items matching a predicate condition.
- \`.reduce(fn, initial)\`: Folds an array into a single accumulated value (sum, object map, etc.).`,
          codeExample: `const scores = [10, 25, 45, 60, 80];

// Filter high performers and double their bounty
const eliteBounties = scores
  .filter(s => s >= 40)
  .map(s => s * 2);

console.log(eliteBounties); // [90, 120, 160]`,
        },
        {
          stageNumber: 2,
          title: 'Checkpoint: Array Methods',
          type: 'quiz',
          content: `Test your knowledge of JavaScript array transformations.`,
          quiz: {
            question: 'Which method returns a new array with elements that pass a test condition without mutating the original array?',
            options: [
              '.slice()',
              '.filter()',
              '.splice()',
              '.push()',
            ],
            correctOptionIndex: 1,
            explanation: '.filter() produces a shallow copy containing only the elements that return truthy from the callback function.',
          },
        },
        {
          stageNumber: 3,
          title: 'Challenge: Filter Even Numbers',
          type: 'challenge',
          content: `### Mission Task:
Write a function \`solution(numbers)\` that takes an array of integers and returns only the even numbers in the same order.`,
          challenge: {
            prompt: 'Return an array of only the even integers.',
            starterCode: `function solution(numbers) {
  // Your code here:
  return numbers.filter(n => n % 2 === 0);
}`,
            language: 'javascript',
            testCases: [
              {
                input: '[1, 2, 3, 4, 5, 6]',
                expectedOutput: '[2,4,6]',
                isHidden: false,
              },
              {
                input: '[10, 15, 20, 25]',
                expectedOutput: '[10,20]',
                isHidden: false,
              },
              {
                input: '[1, 3, 5, 7]',
                expectedOutput: '[]',
                isHidden: true,
              },
            ],
          },
        },
      ],
    },
    {
      title: 'Python Problem Solver: Computational Thinking',
      slug: 'python-problem-solver',
      description: 'Immerse yourself in clean Python syntax, list comprehensions, dictionary lookups, and algorithmic string processing.',
      category: 'Python',
      difficulty: 'beginner',
      learningObjectives: [
        'Write idiomatic Python scripts and functions',
        'Utilize dictionary hash tables for O(1) lookups',
        'Manipulate strings and lists with slicing syntax',
      ],
      estimatedDuration: '30 mins',
      xpReward: 80,
      prerequisites: [],
      published: true,
      stages: [
        {
          stageNumber: 1,
          title: 'The Zen of Python',
          type: 'concept',
          content: `### Clean, Readable, Powerful

Python is renowned for readable syntax and rich standard libraries.

Key tools in your belt:
- **List comprehensions**: \`[x ** 2 for x in nums if x > 0]\`
- **Dictionary mapping**: Key-value pairs for instantaneous retrieval
- **String slicing**: \`word[::-1]\` reverses any string effortlessly!`,
          codeExample: `def format_user_badge(username: str, level: int) -> str:
    return f"Rank #{level}: {username.title()}"

print(format_user_badge("alex_mercer", 5))`,
        },
        {
          stageNumber: 2,
          title: 'Checkpoint: Python Slicing',
          type: 'quiz',
          content: `Test your understanding of Python list slicing.`,
          quiz: {
            question: 'What is the outcome of "SkillQuest"[0:5] in Python?',
            options: [
              '"Skill"',
              '"SkillQ"',
              '"killQ"',
              '"Quest"',
            ],
            correctOptionIndex: 0,
            explanation: 'Slicing [0:5] extracts indices 0, 1, 2, 3, and 4 (the end index is exclusive), producing "Skill".',
          },
        },
        {
          stageNumber: 3,
          title: 'Challenge: String Reversal',
          type: 'challenge',
          content: `### Mission:
Implement \`solution(text)\` in JavaScript/Python to reverse any given input string.`,
          challenge: {
            prompt: 'Reverse the input string.',
            starterCode: `function solution(text) {
  return text.split('').reverse().join('');
}`,
            language: 'javascript',
            testCases: [
              {
                input: '"quest"',
                expectedOutput: '"tseuq"',
                isHidden: false,
              },
              {
                input: '"SkillQuest"',
                expectedOutput: '"tseuQllikS"',
                isHidden: false,
              },
              {
                input: '"racecar"',
                expectedOutput: '"racecar"',
                isHidden: true,
              },
            ],
          },
        },
      ],
    },
    {
      title: 'DSA Dungeon: Algorithms and Complexity',
      slug: 'dsa-dungeon',
      description: 'Conquer the algorithmic trials. Master Big O notation, two-pointer techniques, hash maps, and binary search.',
      category: 'Data Structures and Algorithms',
      difficulty: 'intermediate',
      learningObjectives: [
        'Analyze asymptotic time and space complexity with Big O',
        'Implement optimal Two-Sum in O(N) using Hash Maps',
        'Apply Two-Pointer techniques for palindrome validation',
      ],
      estimatedDuration: '45 mins',
      xpReward: 120,
      prerequisites: ['javascript-adventurer'],
      published: true,
      stages: [
        {
          stageNumber: 1,
          title: 'Big-O Notation: The Universal Language of Speed',
          type: 'concept',
          content: `### How We Measure Efficiency

In coding interviews and scalable systems, efficiency is king:
- $O(1)$: Constant time (Dictionary/Hash table lookup)
- $O(\\log N)$: Logarithmic time (Binary Search)
- $O(N)$: Linear time (Single loop through $N$ items)
- $O(N^2)$: Quadratic time (Nested loops - watch out for bottlenecks!)

Always strive to reduce $O(N^2)$ brute-force solutions to $O(N)$ using hash maps.`,
        },
        {
          stageNumber: 2,
          title: 'Checkpoint: Asymptotic Complexity',
          type: 'quiz',
          content: `Which time complexity represents finding an element in a balanced binary search tree or sorted array via binary search?`,
          quiz: {
            question: 'What is the worst-case time complexity of Binary Search on a sorted array of N elements?',
            options: [
              'O(1)',
              'O(log N)',
              'O(N)',
              'O(N^2)',
            ],
            correctOptionIndex: 1,
            explanation: 'Binary Search halves the search space at each iteration, resulting in O(log N) logarithmic steps.',
          },
        },
        {
          stageNumber: 3,
          title: 'Challenge: Two Sum (Optimal O(N))',
          type: 'challenge',
          content: `### Mission:
Given an array of numbers \`nums\` and an integer \`target\`, return the indices of the two numbers such that they add up to \`target\`.`,
          challenge: {
            prompt: 'Find indices of two numbers that add up to target.',
            starterCode: `function solution(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
            language: 'javascript',
            testCases: [
              {
                input: '[[2, 7, 11, 15], 9]',
                expectedOutput: '[0,1]',
                isHidden: false,
              },
              {
                input: '[[3, 2, 4], 6]',
                expectedOutput: '[1,2]',
                isHidden: false,
              },
              {
                input: '[[3, 3], 6]',
                expectedOutput: '[0,1]',
                isHidden: true,
              },
            ],
          },
        },
      ],
    },
    {
      title: 'AI Explorer: Neural Nets and LLM Foundations',
      slug: 'ai-explorer',
      description: 'Demystify Artificial Intelligence. Explore embeddings, transformer attention mechanisms, prompt engineering, and intelligent agents.',
      category: 'Artificial Intelligence',
      difficulty: 'intermediate',
      learningObjectives: [
        'Understand tokenization, context windows, and vector embeddings',
        'Implement prompt patterns for deterministic AI outputs',
        'Learn how retrieval-augmented generation (RAG) grounds LLMs',
      ],
      estimatedDuration: '40 mins',
      xpReward: 110,
      prerequisites: ['python-problem-solver'],
      published: true,
      stages: [
        {
          stageNumber: 1,
          title: 'How Large Language Models Work',
          type: 'concept',
          content: `### Beyond the Magic: Next-Token Prediction

Modern Large Language Models (LLMs) operate fundamentally by calculating the probability distribution over the next token:

1. **Tokenization**: Text is split into sub-word tokens (words, fragments, symbols).
2. **Embeddings**: Tokens are converted into dense vector coordinates in high-dimensional semantic space.
3. **Self-Attention**: Transformer layers calculate relationships between every token in the context window.
4. **Generation**: The model samples tokens according to probability, guided by temperature.`,
        },
        {
          stageNumber: 2,
          title: 'Checkpoint: AI Architecture',
          type: 'quiz',
          content: `Verify your understanding of modern transformer architectures.`,
          quiz: {
            question: 'In modern generative AI, what mechanism enables the model to weigh the relevance of different words in a sentence regardless of distance?',
            options: [
              'Bubble Sort',
              'Self-Attention Mechanism',
              'Linear Regression',
              'Depth-First Search',
            ],
            correctOptionIndex: 1,
            explanation: 'Self-attention, introduced in the seminal "Attention Is All You Need" paper, dynamically weights relationships across all tokens in the context window.',
          },
        },
        {
          stageNumber: 3,
          title: 'Challenge: Token Counter Helper',
          type: 'challenge',
          content: `### Mission:
Implement a function \`solution(text)\` that estimates token count by splitting words on whitespace and punctuation, returning total estimated tokens.`,
          challenge: {
            prompt: 'Return word count of sentence.',
            starterCode: `function solution(text) {
  if (!text.trim()) return 0;
  return text.trim().split(/\\s+/).length;
}`,
            language: 'javascript',
            testCases: [
              {
                input: '"SkillQuest AI platform empowers students"',
                expectedOutput: '5',
                isHidden: false,
              },
              {
                input: '"Learn by Playing. Build by Doing."',
                expectedOutput: '6',
                isHidden: false,
              },
              {
                input: '"Hello"',
                expectedOutput: '1',
                isHidden: true,
              },
            ],
          },
        },
      ],
    },
  ];

  await Quest.deleteMany({});
  await Quest.insertMany(questsData);
  console.log(`✅ [Seed] Inserted ${questsData.length} comprehensive quests.`);

  // 4. Standalone Coding Arena Challenges
  const challengesData = [
    {
      title: 'Two Sum Target',
      slug: 'two-sum-target',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. Each input has exactly one solution.',
      category: 'Algorithms',
      difficulty: 'beginner',
      supportedLanguage: 'javascript',
      starterCode: `function solution(nums, target) {
  // Your code here
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (seen.has(diff)) {
      return [seen.get(diff), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}`,
      sampleTestCases: [
        { input: '[[2, 7, 11, 15], 9]', expectedOutput: '[0,1]', isHidden: false, explanation: 'nums[0] + nums[1] == 9' },
        { input: '[[3, 2, 4], 6]', expectedOutput: '[1,2]', isHidden: false, explanation: 'nums[1] + nums[2] == 6' },
      ],
      privateTestCases: [
        { input: '[[3, 3], 6]', expectedOutput: '[0,1]', isHidden: true },
        { input: '[[1, 5, 8, 12, 19], 20]', expectedOutput: '[0,4]', isHidden: true },
      ],
      xpReward: 30,
      published: true,
    },
    {
      title: 'Palindrome Validator',
      slug: 'palindrome-validator',
      description: 'Determine if a given string is a palindrome, ignoring non-alphanumeric characters and casing.',
      category: 'Strings',
      difficulty: 'beginner',
      supportedLanguage: 'javascript',
      starterCode: `function solution(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}`,
      sampleTestCases: [
        { input: '"A man, a plan, a canal: Panama"', expectedOutput: 'true', isHidden: false },
        { input: '"race a car"', expectedOutput: 'false', isHidden: false },
      ],
      privateTestCases: [
        { input: '"Was it a car or a cat I saw?"', expectedOutput: 'true', isHidden: true },
        { input: '"hello"', expectedOutput: 'false', isHidden: true },
      ],
      xpReward: 25,
      published: true,
    },
    {
      title: 'FizzBuzz Classic',
      slug: 'fizzbuzz-classic',
      description: 'Return an array of strings representing numbers from 1 to n, substituting multiples of 3 with "Fizz", multiples of 5 with "Buzz", and both with "FizzBuzz".',
      category: 'Logic',
      difficulty: 'beginner',
      supportedLanguage: 'javascript',
      starterCode: `function solution(n) {
  const res = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) res.push('FizzBuzz');
    else if (i % 3 === 0) res.push('Fizz');
    else if (i % 5 === 0) res.push('Buzz');
    else res.push(String(i));
  }
  return res;
}`,
      sampleTestCases: [
        { input: '3', expectedOutput: '["1","2","Fizz"]', isHidden: false },
        { input: '5', expectedOutput: '["1","2","Fizz","4","Buzz"]', isHidden: false },
      ],
      privateTestCases: [
        { input: '15', expectedOutput: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]', isHidden: true },
      ],
      xpReward: 35,
      published: true,
    },
    {
      title: 'Max Subarray Sum (Kadane)',
      slug: 'max-subarray-sum',
      description: 'Find the subarray within an array of numbers which has the largest sum and return its sum in O(N) time.',
      category: 'Algorithms',
      difficulty: 'intermediate',
      supportedLanguage: 'javascript',
      starterCode: `function solution(nums) {
  let maxSum = nums[0];
  let curr = nums[0];
  for (let i = 1; i < nums.length; i++) {
    curr = Math.max(nums[i], curr + nums[i]);
    maxSum = Math.max(maxSum, curr);
  }
  return maxSum;
}`,
      sampleTestCases: [
        { input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]', expectedOutput: '6', isHidden: false },
        { input: '[1]', expectedOutput: '1', isHidden: false },
      ],
      privateTestCases: [
        { input: '[5, 4, -1, 7, 8]', expectedOutput: '23', isHidden: true },
      ],
      xpReward: 50,
      published: true,
    },
  ];

  await Challenge.deleteMany({});
  await Challenge.insertMany(challengesData);
  console.log(`✅ [Seed] Inserted ${challengesData.length} coding arena challenges.`);

  // 5. Demo Projects
  await Project.deleteMany({});
  await Project.create({
    ownerId: studentUser._id,
    title: 'Cyberpunk Portfolio Showcase',
    description: 'An interactive portfolio featuring dynamic theme switching, 3D card tilts, and GitHub activity feeds.',
    category: 'Web Development',
    difficulty: 'intermediate',
    learningObjectives: ['Modern CSS animations', 'Accessible component trees', 'Responsive layouts'],
    tasks: [
      { id: 'p1', title: 'Setup responsive grid layout with Tailwind', completed: true },
      { id: 'p2', title: 'Integrate glassmorphism aesthetic and neon buttons', completed: true },
      { id: 'p3', title: 'Connect contact form with input validation', completed: false },
      { id: 'p4', title: 'Deploy on Vercel and optimize Lighthouse score', completed: false },
    ],
    status: 'in_progress',
    visibility: 'public',
    repositoryUrl: 'https://github.com/alex-mercer/cyber-portfolio',
  });

  // 6. Demo Squad
  await Team.deleteMany({});
  await Team.create({
    name: 'CyberPhantoms',
    invitationCode: 'SQUAD-7788',
    leaderId: adminUser._id,
    memberIds: [adminUser._id, studentUser._id],
    challengeTitle: 'Autonomous AI Agent Challenge',
    challengeDescription: 'Build an autonomous agent with reasoning capabilities, tool-calling interfaces, and local memory retrieval.',
    progress: 75,
    tasks: [
      { id: 'sq1', title: 'Establish squad communication & repository', completed: true, assignedTo: 'Commander Nova' },
      { id: 'sq2', title: 'Implement prompt chain pipeline', completed: true, assignedTo: 'Alex Mercer' },
      { id: 'sq3', title: 'Write integration test suite', completed: true, assignedTo: 'Alex Mercer' },
      { id: 'sq4', title: 'Deploy final squad showcase', completed: false, assignedTo: 'Commander Nova' },
    ],
    score: 250,
  });

  // 7. Initialize QuestProgress for student on HTML Explorer
  const htmlQuest = await Quest.findOne({ slug: 'html-explorer' });
  if (htmlQuest) {
    await QuestProgress.create({
      userId: studentUser._id,
      questId: htmlQuest._id,
      currentStage: 2,
      completedStages: [1],
      isCompleted: false,
    });
  }

  console.log('✨ [Seed] SkillQuest AI database seeded successfully!');
};
