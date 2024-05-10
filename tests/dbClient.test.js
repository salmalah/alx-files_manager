// __tests__/dbClient.test.js
const dbClient = require('../utils/db');

describe('dbClient', () => {
  beforeAll(async () => {
    // Connect to a test database or use a mock library
    await dbClient.connect();
  });

  afterAll(async () => {
    // Disconnect from the test database or clean up mock
    await dbClient.disconnect();
  });

  it('should check if MongoDB connection is alive', async () => {
    const alive = dbClient.isAlive();
    expect(alive).toBe(true);
  });

  it('should return the number of users in the collection', async () => {
    const nbUsers = await dbClient.nbUsers();
    expect(nbUsers).toBeGreaterThanOrEqual(0);
  });

  it('should return the number of files in the collection', async () => {
    const nbFiles = await dbClient.nbFiles();
    expect(nbFiles).toBeGreaterThanOrEqual(0);
  });
});
