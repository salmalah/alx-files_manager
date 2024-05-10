import express from 'express';
import UsersController from '../controllers/UsersController';
import AppController from '../controllers/AppController';

const router = express.Router();

router.post('/users', UsersController.postNew);
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

export default router;
