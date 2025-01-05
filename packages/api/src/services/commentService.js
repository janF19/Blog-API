import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const commentService = {
  getAll: async () => {
    return await prisma.comment.findMany();
  },
  // Add more service methods here
};
