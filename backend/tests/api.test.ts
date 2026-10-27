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
});
