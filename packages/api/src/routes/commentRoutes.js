import express from 'express';
import {
    createComment,
    getCommentsByPostId,
    updateComment,
    deleteComment
} from '../controllers/commentController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to get comments by post ID
router.get('/post/:postId', getCommentsByPostId);

// Create a comment (must be authenticated)
router.post('/', authenticateUser, createComment);

// Update a comment (must be the comment author or admin)
router.put('/:id', authenticateUser, updateComment);

// Delete a comment (must be the comment author or admin)
router.delete('/:id', authenticateUser, deleteComment);

export default router;