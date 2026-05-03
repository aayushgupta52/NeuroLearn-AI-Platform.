import prisma from '../utils/prisma.js';

export const getLesson = async (req, res, next) => {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: req.params.id },
      include: {
        module: { include: { course: { select: { id: true, title: true } } } },
        quizzes: { include: { _count: { select: { questions: true } } } }
      }
    });

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // Mark progress if user is authenticated
    if (req.user) {
      await prisma.userProgress.upsert({
        where: {
          userId_lessonId: { userId: req.user.id, lessonId: lesson.id }
        },
        create: { userId: req.user.id, lessonId: lesson.id },
        update: { timeSpent: { increment: 1 } }
      });
    }

    res.json(lesson);
  } catch (error) {
    next(error);
  }
};

export const completeLesson = async (req, res, next) => {
  try {
    const { timeSpent } = req.body;
    const progress = await prisma.userProgress.upsert({
      where: {
        userId_lessonId: { userId: req.user.id, lessonId: req.params.id }
      },
      create: {
        userId: req.user.id,
        lessonId: req.params.id,
        completed: true,
        completedAt: new Date(),
        timeSpent: timeSpent || 0
      },
      update: {
        completed: true,
        completedAt: new Date(),
        timeSpent: timeSpent || 0
      }
    });

    // Award XP
    await prisma.user.update({
      where: { id: req.user.id },
      data: { xp: { increment: 25 } }
    });

    // Check for level up (every 500 XP)
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const newLevel = Math.floor(user.xp / 500) + 1;
    if (newLevel > user.level) {
      await prisma.user.update({
        where: { id: req.user.id },
        data: { level: newLevel }
      });
      await prisma.achievement.create({
        data: {
          userId: req.user.id,
          type: 'LEVEL_UP',
          title: `Reached Level ${newLevel}`,
          description: `You've grown to level ${newLevel}! Keep learning!`,
          icon: '⭐'
        }
      });
    }

    res.json(progress);
  } catch (error) {
    next(error);
  }
};

export const getLessonsByModule = async (req, res, next) => {
  try {
    const lessons = await prisma.lesson.findMany({
      where: { moduleId: req.params.moduleId },
      include: { quizzes: { select: { id: true, title: true } } },
      orderBy: { order: 'asc' }
    });
    res.json(lessons);
  } catch (error) {
    next(error);
  }
};
