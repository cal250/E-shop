
import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();

router.post('/register', UserController.register);
router.get('/:id', UserController.getProfile);

export default router;