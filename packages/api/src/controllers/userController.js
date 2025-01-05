import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Input validation schemas
const UserRegistrationSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
});

const UserLoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" })
});

const UserProfileUpdateSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).optional(),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .optional()
});

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Register a new user
export const registerUser = async (req, res) => {
  try {
    // Validate input
    const validatedData = UserRegistrationSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      ...user,
      token
    });

  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Unable to register user' });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    // Validate input
    const validatedData = UserLoginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(validatedData.password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id);

    // Return user info without password
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });

  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Unable to login' });
  }
};

// Get user profile (existing method remains the same)
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        posts: {
          select: {
            id: true,
            title: true,
            published: true,
            createdAt: true
          }
        },
        _count: {
          select: { comments: true }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Unable to fetch user profile' });
  }
};

// Update user profile (existing method remains the same)
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Validate input
    const validatedData = UserProfileUpdateSchema.parse(req.body);

    // Prepare update data
    const updateData = { ...validatedData };

    // Check if email is being updated and not already in use
    if (updateData.email) {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: updateData.email,
          NOT: {
            id: userId
          }
        }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Email is already in use' });
      }
    }

    // Hash password if it's being updated
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    // Perform the update
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Unable to update user profile' });
  }
};


export const logoutUser = async (req, res) => {
  const userId = req.user.id; // Get the user ID from the request object

  // Log the logout event (you can customize this as needed)
  console.log(`User with ID ${userId} has logged out.`);

  // Here you can perform any additional cleanup if necessary
  // For example, you might want to invalidate the token in a database if you're using a token blacklist

  res.json({ message: 'Successfully logged out' });
};

