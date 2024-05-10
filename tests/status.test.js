// __tests__/status.test.js
const request = require('supertest');
const app = require('../server'); // Import your Express app

describe('GET /status', () => {
  it('should return status of Redis and DB', async () => {
    const response = await request(app).get('/status');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('redis', expect.any(Boolean));
    expect(response.body).toHaveProperty('db', expect.any(Boolean));
  });
});
