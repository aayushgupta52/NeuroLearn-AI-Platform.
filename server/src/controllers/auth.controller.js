import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role === 'ADMIN' ? 'ADMIN' : 'STUDENT'
      },
      select: { id: true, name: true, email: true, role: true, xp: true, level: true, streak: true, isPremium: true, createdAt: true }
    });

    // Grant first achievement
    await prisma.achievement.create({
      data: {
        userId: user.id,
        type: 'WELCOME',
        title: 'Welcome to NeuroLearn!',
        description: 'Created your account and started your learning journey.',
        icon: '🎉'
      }
    });

    const tokens = generateTokens(user.id);
    res.status(201).json({ user, ...tokens });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update streak
    const now = new Date();
    const lastActive = user.lastActiveAt;
    let newStreak = user.streak;

    if (lastActive) {
      const diffHours = (now - lastActive) / (1000 * 60 * 60);
      if (diffHours >= 24 && diffHours < 48) {
        newStreak += 1;
      } else if (diffHours >= 48) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: now, streak: newStreak }
    });

    const tokens = generateTokens(user.id);
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        xp: user.xp,
        level: user.level,
        streak: newStreak,
        isPremium: user.isPremium,
        avatar: user.avatar
      },
      ...tokens
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const tokens = generateTokens(decoded.userId);
    res.json(tokens);
  } catch (error) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true, name: true, email: true, role: true,
        xp: true, level: true, streak: true, isPremium: true,
        avatar: true, createdAt: true,
        _count: { select: { enrollments: true, achievements: true } }
      }
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
};
