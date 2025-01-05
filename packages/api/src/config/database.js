import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config(); // Load environment variables

// Database configuration
export const dbConfig = {
  url: process.env.DATABASE_URL, // Use an environment variable for the database URL
};

// Initialize Prisma Client
const prisma = new PrismaClient();

export default prisma; // Export the Prisma Client instance
