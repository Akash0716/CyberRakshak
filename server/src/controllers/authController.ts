import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { isUsingFallbackDB } from '../config/db.js';
import { UserModel, IUser } from '../models/User.js';
import { memoryDb } from '../services/memoryDbFallback.js';
import { AuthRequest } from '../middleware/auth.js';

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, role = 'student', department, studentId } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user exists
    let existingUser = null;
    if (isUsingFallbackDB()) {
      existingUser = memoryDb.users.find(u => u.email === cleanEmail);
    } else {
      try {
        existingUser = await UserModel.findOne({ email: cleanEmail });
      } catch {
        existingUser = memoryDb.users.find(u => u.email === cleanEmail);
      }
    }

    if (existingUser) {
      res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const validRole = ['student', 'administrator', 'approver'].includes(role) ? role : 'student';

    let newUser: any;
    if (isUsingFallbackDB()) {
      newUser = {
        _id: `usr_${Date.now()}`,
        name,
        email: cleanEmail,
        passwordHash,
        role: validRole,
        department: department || 'Computer Science & Engineering',
        studentId: studentId || '',
        createdAt: new Date()
      };
      memoryDb.users.push(newUser);
    } else {
      try {
        newUser = await UserModel.create({
          name,
          email: cleanEmail,
          passwordHash,
          role: validRole,
          department: department || 'Computer Science & Engineering',
          studentId: studentId || ''
        });
      } catch {
        newUser = {
          _id: `usr_${Date.now()}`,
          name,
          email: cleanEmail,
          passwordHash,
          role: validRole,
          department: department || 'Computer Science & Engineering',
          studentId: studentId || '',
          createdAt: new Date()
        };
        memoryDb.users.push(newUser);
      }
    }

    const token = jwt.sign(
      {
        userId: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department
      },
      ENV.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        studentId: newUser.studentId
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Registration failed.' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();

    let user: any = null;
    if (isUsingFallbackDB()) {
      user = memoryDb.users.find(u => u.email === cleanEmail);
    } else {
      try {
        user = await UserModel.findOne({ email: cleanEmail });
      } catch {
        user = memoryDb.users.find(u => u.email === cleanEmail);
      }
    }

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
      return;
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      },
      ENV.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        studentId: user.studentId
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Login failed.' });
  }
}

export async function getProfile(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    let user: any = null;
    if (isUsingFallbackDB()) {
      user = memoryDb.users.find(u => u._id.toString() === req.user?.userId);
    } else {
      try {
        user = await UserModel.findById(req.user.userId).select('-passwordHash');
      } catch {
        user = memoryDb.users.find(u => u._id.toString() === req.user?.userId);
      }
    }

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        studentId: user.studentId
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch profile' });
  }
}

