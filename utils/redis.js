const redis = require('redis');
const { promisify } = require('util');

/**
 * performing operations with Redis service
 *
 */
class RedisClient {
  constructor() {
    // Creates a Redis client
    this.client = redis.createClient();

    // Promisifies Redis client methods
    this.getAsync = promisify(this.client.get).bind(this.client);

    // Handles Redis client errors
    this.client.on('error', (error) => {
      console.error(`Redis client error: ${error.message}`);
    });
  }

  /**
   * Check if connection to Redis is successful
   * @returns bool
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * Gets the value corresponding to a key in Redis
   * @param {string} keys
   * @returns {Promise<string|null>}
   */
  async get(key) {
    try {
      const value = await this.getAsync(key);
      return value;
    } catch (error) {
      console.error(`Error retrieving value from Redis: ${error.message}`);
      return null;
    }
  }

  /**
   * Sets a new key in Redis with a specific TTL
   * @param {string} key,value
   * @param {number} time
   * @returns {Promise<void>}
   */
  async set(key, value, time) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, time, value, (err) => {
        if (err) {
          console.error(`Error setting value in Redis: ${err.message}`);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Deletes a key in the Redis service
   * @param {string} key
   * @returns {Promise<void>}
   */
  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err) => {
        if (err) {
          console.error(`Error deleting key in Redis: ${err.message}`);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
