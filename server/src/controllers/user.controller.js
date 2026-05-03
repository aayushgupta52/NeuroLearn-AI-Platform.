import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true, name: true, email: true, role: true,
        xp: true, level: true, streak: true, isPremium: true,
        avatar: true, createdAt: true, lastActiveAt: true,
        _count: { select: { enrollments: true, achievements: true, quizResults: true } }
      }
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, avatar },
      select: { id: true, name: true, email: true, avatar: true }
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { passwordHash }
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const getAchievements = async (req, res, next) => {
  try {
    const achievements = await prisma.achievement.findMany({
      where: { userId: req.user.id },
      orderBy: { earnedAt: 'desc' }
    });
    res.json(achievements);
  } catch (error) {
    next(error);
  }
};

export const getLeaderboard = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: { id: true, name: true, avatar: true, xp: true, level: true, streak: true },
      orderBy: { xp: 'desc' },
      take: 50
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
};
