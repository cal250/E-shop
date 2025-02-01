import { Router } from 'express';
import {

createUser,
getUserById,
getUserByEmail,
updateUser,
deleteUser,
getAllUsers,
} from '../controllers/user.controller';

const router = Router();

// Create a new user
router.post('/', createUser);

// Get all users with pagination
router.get('/', getAllUsers);

// Get user by ID
router.get('/:id', getUserById);

// Get user by email
router.get('/email/:email', getUserByEmail);

// Update user
router.put('/:id', updateUser);

// Delete user
router.delete('/:id', deleteUser);

export default router;