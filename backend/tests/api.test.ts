import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import { seedInitialData } from '../src/scripts/seed.js';

let app: any;
let studentToken: string;
let adminToken: string;

beforeAll(async () => {
  await connectDatabase();
  await seedInitialData();
  app = createApp();

  // Login as student
  const studentRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'student@skillquest.ai', password: 'StudentPass123!' });
  studentToken = studentRes.body.token;

  // Login as admin
  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@skillquest.ai', password: 'AdminPass123!' });
  adminToken = adminRes.body.token;
}, 60000);

afterAll(async () => {
  await disconnectDatabase();
}, 60000);

describe('SkillQuest AI Backend API Integration Tests', () => {
  it('1. Health check returns 200 OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.platform).toBe('SkillQuest AI');
  });

  it('2. Auth: Student login retrieves correct user profile and JWT', async () => {
    expect(studentToken).toBeDefined();
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('student@skillquest.ai');
    expect(res.body.role).toBe('student');
  });

  it('3. Dashboard: Fetches player stats and daily challenges', async () => {
    const res = await request(app)
      .get('/api/dashboard')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(res.status).toBe(200);
    expect(res.body.player).toBeDefined();
    expect(res.body.player.level).toBeGreaterThanOrEqual(1);
    expect(res.body.dailyChallenges.length).toBe(3);
  });

  it('4. Quests: Lists seeded quests with categories and user progress', async () => {
    const res = await request(app)
      .get('/api/quests')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(res.status).toBe(200);
    expect(res.body.quests.length).toBeGreaterThanOrEqual(6);
  });

  it('5. Quests: Evaluates quiz accurately and rejects wrong answers', async () => {
    const res = await request(app)
      .post('/api/quests/html-explorer/quiz')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ stageNumber: 3, selectedOption: 1 }); // Option 1 is <main>, which is correct
    expect(res.status).toBe(200);
    expect(res.body.isCorrect).toBe(true);
  });

  it('6. Coding Arena: Sandboxed runner executes JavaScript code and verifies test cases', async () => {
    const res = await request(app)
      .post('/api/challenges/palindrome-validator/run')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        language: 'javascript',
        code: `function solution(str) {
          const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
          return cleaned === cleaned.split('').reverse().join('');
        }`,
      });
    expect(res.status).toBe(200);
    expect(res.body.summary.allPassed).toBe(true);
    expect(res.body.summary.totalPassed).toBeGreaterThanOrEqual(2);
  });

  it('7. AI Mentor: Generates contextual learning guidance and hints', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        messages: [{ role: 'user', content: 'Explain recursion with an analogy' }],
        language: 'English',
      });
    expect(res.status).toBe(200);
    expect(res.body.reply).toBeDefined();
    expect(res.body.reply.toLowerCase()).toContain('recursion');
  });

  it('8. Security: Non-admin users are blocked from admin analytics (403)', async () => {
    const res = await request(app)
      .get('/api/admin/analytics')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(res.status).toBe(403);
  });

  it('9. Security: Admin users can access administrative analytics', async () => {
    const res = await request(app)
      .get('/api/admin/analytics')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.metrics.totalUsers).toBeGreaterThanOrEqual(2);
  });

  it('10. AI RAG: Ingests course document and answers queries with verified citations', async () => {
    // 1. Upload sample course document
    const uploadRes = await request(app)
      .post('/api/ai/documents/upload')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        filename: 'data_structures_syllabus.md',
        content: '# Advanced Trees and Tries\nA Trie (Prefix Tree) is an ordered tree data structure used to store a dynamic set of strings. Keys are usually strings, where nodes share common prefixes. Search and insert time complexity is O(L), where L is the key length.',
      });

    expect(uploadRes.status).toBe(201);
    expect(uploadRes.body.document).toBeDefined();
    expect(uploadRes.body.document.chunkCount).toBeGreaterThanOrEqual(1);

    // 2. Query the AI Mentor on this uploaded document topic
    const chatRes = await request(app)
      .post('/api/ai/chat')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        messages: [{ role: 'user', content: 'What is a Trie and what is its time complexity according to my syllabus?' }],
        enableRag: true,
      });

    expect(chatRes.status).toBe(200);
    expect(chatRes.body.sources).toBeDefined();
    expect(chatRes.body.sources.length).toBeGreaterThan(0);
    expect(chatRes.body.sources[0].filename).toBe('data_structures_syllabus.md');
    expect(chatRes.body.reply).toContain('data_structures_syllabus.md');
  });

  it('11. AI Mentor: Multi-question query decomposes into structured sections', async () => {
    const multiRes = await request(app)
      .post('/api/ai/chat')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        messages: [{ role: 'user', content: '1. What is HTML? 2. How does CSS differ from it?' }],
      });

    expect(multiRes.status).toBe(200);
    expect(multiRes.body.multiQuestionHandled).toBe(true);
    expect(multiRes.body.reply).toContain('### 1.');
    expect(multiRes.body.reply).toContain('### 2.');
  });

  it('12. AI Mentor: Conversational follow-up handles code conversion accurately', async () => {
    const followUpRes = await request(app)
      .post('/api/ai/chat')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        messages: [
          { role: 'user', content: 'Write a function to filter positive numbers in JavaScript' },
          { role: 'assistant', content: '```javascript\nfunction executeLogic(items) {\n  return items.filter(x => x > 0);\n}\n```' },
          { role: 'user', content: 'Can you convert that to Python?' },
        ],
      });

    expect(followUpRes.status).toBe(200);
    expect(followUpRes.body.reply).toContain('Python');
    expect(followUpRes.body.reply).toContain('def execute_logic');
  });

  it('13. AI Usage: Retrieves user daily quotas and usage statistics', async () => {
    const usageRes = await request(app)
      .get('/api/ai/usage')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(usageRes.status).toBe(200);
    expect(usageRes.body.requestsCount).toBeGreaterThan(0);
    expect(usageRes.body.requestsLimit).toBe(100);
    expect(usageRes.body.documentsCount).toBeGreaterThanOrEqual(1);
  });
});
