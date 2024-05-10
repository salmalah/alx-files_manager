import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  /**
   * should return if Redis is alive and if the DB is alive too
   */
  static getStatus(request, response) {
    response.statusCode = 200;
    response.send({
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    });
  }

  /**
   * should return the number of users and files in DB
   */
  static async getStats(request, response) {
    response.statusCode = 200;
    response.send({
      users: await dbClient.nbUsers(),
      files: await dbClient.nbFiles(),
    });
  }
}

export default AppController;
