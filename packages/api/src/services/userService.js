import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const userService = {
  getAll: async () => {
    return await prisma.user.findMany();
  },
  // Add more service methods here
};
