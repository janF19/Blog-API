import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Input validation schemas
const CommentCreateSchema = z.object({
  content: z.string().min(1, { message: "Comment cannot be empty" }).max(500, { message: "Comment is too long" }),
  postId: z.number().int().positive()
});

const CommentUpdateSchema = z.object({
  content: z.string().min(1, { message: "Comment cannot be empty" }).max(500, { message: "Comment is too long" })
});

// Create a new comment
export const createComment = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('User ID:', req.user.id);
    // Validate input
    const { content, postId } = CommentCreateSchema.parse(req.body);
    const authorId = req.user.id;

    // Check if the post exists and is published
    const post = await prisma.post.findUnique({
      where: { id: postId, published: true }
    });

    console.log('Post details:', post);

    if (!post) {
      return res.status(404).json({ error: 'Post not found or not published' });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId
      },
      include: {
        author: {
          select: { name: true }
        }
      }
    });

    res.status(201).json(comment);
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    }

    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Unable to create comment' });
  }
};

// Get comments for a specific post
export const getCommentsByPostId = async (req, res) => {
  try {
    const { postId } = req.params;
    const parsedPostId = parseInt(postId);

    // Validate postId
    if (isNaN(parsedPostId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    // First, verify the post exists and is published
    const post = await prisma.post.findUnique({
      where: {
        id: parsedPostId,
        published: true
      }
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found or not published' });
    }

    const comments = await prisma.comment.findMany({
      where: {
        postId: parsedPostId
      },
      include: {
        author: {
          select: { name: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Unable to fetch comments' });
  }
};

// Update a comment
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);

    // Validate input
    const { content } = CommentUpdateSchema.parse(req.body);
    const userId = req.user.id;

    // Check if the comment exists and belongs to the user
    const comment = await prisma.comment.findUnique({
      where: { id: parsedId }
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Ensure only the comment author or an admin can update
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (comment.authorId !== userId && user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to update this comment' });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: parsedId },
      data: { content },
      include: {
        author: {
          select: { name: true }
        }
      }
    });

    res.json(updatedComment);
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    }

    console.error('Error updating comment:', error);
    res.status(500).json({ error: 'Unable to update comment' });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    const userId = req.user.id;

    // Check if the comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: parsedId }
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if user is the author of the comment or an admin
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (comment.authorId !== userId && user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    await prisma.comment.delete({
      where: { id: parsedId }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Unable to delete comment' });
  }
};