// packages/api/src/services/postService.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const postService = {
  getAllPosts: async () => {
    return await prisma.post.findMany({
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        },
        comments: true
      }
    });
  },

  getPostById: async (id) => {
    return await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });
  },

  createPost: async (data) => {
    return await prisma.post.create({
      data,
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
  },

  updatePost: async (id, data) => {
    return await prisma.post.update({
      where: { id },
      data,
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
  },

  deletePost: async (id) => {
    return await prisma.post.delete({
      where: { id }
    });
  }
};