// __tests__/redisClient.test.js
const redisClient = require('../utils/redis');

describe('redisClient', () => {
  beforeAll(() => {
    // Start a local Redis server for testing or use a mock library
  });

  afterAll(() => {
    // Close the connection to the local Redis server or clean up mock
  });

  it('should check if Redis connection is alive', async () => {
    const alive = await redisClient.isAlive();
    expect(alive).toBe(true);
  });

  it('should set and get values in Redis', async () => {
    const key = 'testKey';
    const value = 'testValue';

    await redisClient.set(key, value, 10);
    const retrievedValue = await redisClient.get(key);

    expect(retrievedValue).toBe(value);
  });

  it('should delete a value in Redis', async () => {
    const key = 'testKey';

    await redisClient.set(key, 'testValue', 10);
    await redisClient.del(key);
    const retrievedValue = await redisClient.get(key);

    expect(retrievedValue).toBe(null);
  });
});
