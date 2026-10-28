import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import { seedInitialData } from '../src/scripts/seed.js';

let app: any;
let studentToken: string;

beforeAll(async () => {
  await connectDatabase();
  await seedInitialData();
  app = createApp();

  const studentRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'student@skillquest.ai', password: 'StudentPass123!' });
  studentToken = studentRes.body.token;
}, 60000);

afterAll(async () => {
  await disconnectDatabase();
}, 60000);

describe('SkillQuest AI — General-Purpose Conversational AI Assistant Test Suite', () => {
  it('1. Handles standard greeting "Hello." naturally without predefined list rejection', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        messages: [{ role: 'user', content: 'Hello.' }],
      });

    expect(res.status).toBe(200);
    expect(res.body.reply).toBeDefined();
    expect(res.body.reply.toLowerCase()).toMatch(/hello|how can i help|assist/);
    expect(res.body.routingMode).toBe('general');
  });

  it('2. Handles casual conversational greeting "How are you?"', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        messages: [{ role: 'user', content: 'How are you?' }],
      });

    expect(res.status).toBe(200);
    expect(res.body.reply).toBeDefined();
    expect(res.body.reply.toLowerCase()).toMatch(/well|good|thank|assist/);
  });

  it('3. Answers general science & physics inquiry "Explain quantum computing."', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        messages: [{ role: 'user', content: 'Explain quantum computing.' }],
      });

    expect(res.status).toBe(200);
    expect(res.body.reply.toLowerCase()).toContain('quantum');
    expect(res.body.routingMode).toBe('general');
  });

  it('4. Writes dynamic programming code "Write a Python program to sort a list."', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        messages: [{ role: 'user', content: 'Write a Python program to sort a list.' }],
      });

    expect(res.status).toBe(200);
    expect(res.body.reply).toContain('python');
    expect(res.body.reply).toMatch(/sort/);
  });

  it('5. Answers creative writing requests outside curriculum: "Write a romantic story."', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        messages: [{ role: 'user', content: 'Write a romantic story.' }],
      });

    expect(res.status).toBe(200);
    expect(res.body.reply.length).toBeGreaterThan(50);
    // Verifies it does not reject or say "Topic not allowed"
    expect(res.body.reply.toLowerCase()).not.toContain('not allowed');
    expect(res.body.reply.toLowerCase()).not.toContain('invalid topic');
  });

  it('6. Decomposes multi-part request "Explain HTML versus CSS and provide an example."', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        messages: [{ role: 'user', content: 'Explain HTML versus CSS and provide an example.' }],
      });

    expect(res.status).toBe(200);
    expect(res.body.reply).toBeDefined();
    expect(res.body.multiQuestionHandled).toBe(true);
  });

  it('7. Handles technical debugging request "Help me debug this code."', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        messages: [{ role: 'user', content: 'Help me debug this code.' }],
      });

    expect(res.status).toBe(200);
    expect(res.body.reply.toLowerCase()).toMatch(/debug|trace|error|snippet/);
  });

  it('8. Answers general geography question "What is the capital of Japan?"', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        messages: [{ role: 'user', content: 'What is the capital of Japan?' }],
      });

    expect(res.status).toBe(200);
    expect(res.body.reply).toContain('Tokyo');
  });

  it('9. Document RAG: Answers "Explain the contents of my uploaded PDF."', async () => {
    // 1. Upload mock document
    await request(app)
      .post('/api/ai/documents/upload')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        filename: 'machine_learning_course.pdf',
        content: 'Machine Learning (ML) is the study of computer algorithms that improve automatically through experience and data.',
      });

    // 2. Query document
    const res = await request(app)
      .post('/api/ai/chat')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        messages: [{ role: 'user', content: 'Explain the contents of my uploaded PDF.' }],
        enableRag: true,
      });

    expect(res.status).toBe(200);
    expect(res.body.routingMode).toBe('rag');
    expect(res.body.sources.length).toBeGreaterThan(0);
    expect(res.body.sources[0].filename).toBe('machine_learning_course.pdf');
  });

  it('10. Conversational follow-up: "Explain that again in simpler language."', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        messages: [
          { role: 'user', content: 'What is an API?' },
          { role: 'assistant', content: 'An Application Programming Interface defines rules for software communication.' },
          { role: 'user', content: 'Explain that again in simpler language.' },
        ],
      });

    expect(res.status).toBe(200);
    expect(res.body.reply.toLowerCase()).toMatch(/simpler|recipe|step/);
  });

  it('11. AI Status endpoint returns LLM provider details', async () => {
    const res = await request(app).get('/api/ai/status');
    expect(res.status).toBe(200);
    expect(res.body.provider).toBeDefined();
    expect(res.body.model).toBeDefined();
  });
});
