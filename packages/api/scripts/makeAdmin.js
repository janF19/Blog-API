import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function makeUserAdmin() {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: 6 }, // Use the ID of the user you want to make an admin
      data: {
        role: 'ADMIN'
      }
    });
    console.log('User updated to admin:', updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

makeUserAdmin();