import express from 'express';
import {
    createPost,
    getAllPosts,
    getPublishedPosts,
    getPostById,
    updatePost,
    deletePost,
    getBlogHome
} from '../controllers/postController.js';
import { authenticateUser, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Home page / Blog listing (public route)
router.get('/', getBlogHome);

// Get all posts (admin only)
router.get('/all', authenticateUser, authorizeAdmin, getAllPosts);

// Get only published posts (public route)
router.get('/published', getPublishedPosts);

// Get a specific post by ID
router.get('/:id', getPostById);

// Create a new post (admin only)
router.post('/', authenticateUser, authorizeAdmin, createPost);

// Update a post (admin only)
router.put('/:id', authenticateUser, authorizeAdmin, updatePost);

// Delete a post (admin only)
router.delete('/:id', authenticateUser, authorizeAdmin, deletePost);

export default router;