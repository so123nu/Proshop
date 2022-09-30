import express from 'express';
import { authUser, getUserById, getUserProfile, registerUser, removeUser, updateUser, updateUserProfile, users } from '../controllers/userController.js'
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, admin, users).post(registerUser);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/:id').get(protect, admin, getUserById).put(protect, admin, updateUser).delete(protect, admin, removeUser);

export default router;