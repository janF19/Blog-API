
// packages/api/src/middleware/validate.js
import { body } from 'express-validator';

export const validatePost = [
  body('title').notEmpty().trim().escape()
    .withMessage('Title is required'),
  body('content').notEmpty()
    .withMessage('Content is required'),
  body('authorId').isInt()
    .withMessage('Valid author ID is required'),
  body('published').isBoolean().optional()
    .withMessage('Published must be a boolean')
];