import { v4 as uuidv4 } from 'uuid';
import sha1 from 'sha1';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AuthController {
  /**
   * Sign-in the user by generating a new authentication token
   */
  static async getConnect(request, response) {
    const authHeader = request.header('Authorization') || '';
    const credentials = authHeader.split(' ')[1];
    if (!credentials) return response.status(401).send({ error: 'Unauthorized' });
    const dedCredentials = Buffer.from(credentials, 'base64').toString('utf-8');

    const [email, password] = dedCredentials.split(':');
    if (!email || !password) return response.status(401).send({ error: 'Unauthorized' });

    const shaPassword = sha1(password);

    // Finds the user associate to this email and with this password
    const finalCreds = { email, password: shaPassword };
    const user = await dbClient.users.findOne(finalCreds);

    if (!user) return response.status(401).send({ error: 'Unauthorized' });

    // Generates a random token
    const token = uuidv4();
    const key = `auth_${token}`;
    const ExpirationPeriod = 24;

    // Use this key for storing in Redis the user ID for 24 hours
    await redisClient.set(key, user._id.toString(), ExpirationPeriod * 3600);

    return response.status(200).send({ token });
  }

  /**
   * sign-out the user based on the token
   */
  static async getDisconnect(request, response) {
    // retrieves the user from the token
    const token = request.headers['x-token'];
    const user = await redisClient.get(`auth_${token}`);
    if (!user) return response.status(401).send({ error: 'Unauthorized' });

    // deletes the token in Redis
    await redisClient.del(`auth_${token}`);
    return response.status(204).end();
  }
}

module.exports = AuthController;
