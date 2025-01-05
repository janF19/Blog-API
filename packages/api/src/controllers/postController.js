import { PrismaClient } from '@prisma/client';
import { z } from 'zod'; // Recommended for validation

const prisma = new PrismaClient();

// Input validation schemas
const PostCreateSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  content: z.string().min(10, { message: "Content must be at least 10 characters" }),
  published: z.boolean().optional().default(false)
});

const PostUpdateSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }).optional(),
  content: z.string().min(10, { message: "Content must be at least 10 characters" }).optional(),
  published: z.boolean().optional()
});

// Home page / Blog listing route
export const getBlogHome = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const posts = await prisma.post.findMany({
      where: { published: true },
      include: {
        author: { select: { name: true } },
        _count: { select: { comments: true } }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize
    });

    const totalPosts = await prisma.post.count({ where: { published: true } });

    res.json({
      posts,
      currentPage: page,
      pageSize,
      totalPosts,
      totalPages: Math.ceil(totalPosts / pageSize)
    });
  } catch (error) {
    console.error('Error fetching blog home:', error);
    res.status(500).json({ error: 'Unable to fetch blog posts' });
  }
};

// Create a new post
export const createPost = async (req, res) => {
  try {
    // Validate input
    const validatedData = PostCreateSchema.parse(req.body);
    const authorId = req.user.id;

    const post = await prisma.post.create({
      data: {
        ...validatedData,
        authorId
      }
    });

    res.status(201).json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Unable to create post' });
  }
};

// Get all posts (for admin)
export const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: { select: { name: true } },
        _count: { select: { comments: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Unable to fetch posts' });
  }
};

// Get only published posts
export const getPublishedPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: {
        author: { select: { name: true } },
        _count: { select: { comments: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(posts);
  } catch (error) {
    console.error('Error fetching published posts:', error);
    res.status(500).json({ error: 'Unable to fetch published posts' });
  }
};

// Get a specific post by ID
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: { select: { name: true } },
        comments: {
          include: {
            author: { select: { name: true } }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Unable to fetch post' });
  }
};

// Update a post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate input
    const validatedData = PostUpdateSchema.parse(req.body);

    // Optional: Check if the post belongs to the current user or if user is an admin
    const existingPost = await prisma.post.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Ensure only the post author or an admin can update
    if (existingPost.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to update this post' });
    }

    const updatedPost = await prisma.post.update({
      where: { id: parseInt(id) },
      data: validatedData
    });

    res.json(updatedPost);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Unable to update post' });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    // Optional: Check if the post belongs to the current user or if user is an admin
    const existingPost = await prisma.post.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Ensure only the post author or an admin can delete
    if (existingPost.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await prisma.post.delete({
      where: { id: parseInt(id) }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Unable to delete post' });
  }
};