import prisma from '../utils/prisma.js';

export const getCourses = async (req, res, next) => {
  try {
    const { category, difficulty, search } = req.query;
    const where = { published: true };

    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        modules: {
          include: { _count: { select: { lessons: true } } },
          orderBy: { order: 'asc' }
        },
        _count: { select: { enrollments: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(courses);
  } catch (error) {
    next(error);
  }
};

export const getCourseById = async (req, res, next) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      include: {
        modules: {
          include: {
            lessons: {
              include: { quizzes: { select: { id: true, title: true } } },
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        },
        _count: { select: { enrollments: true } }
      }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // If user is authenticated, include their progress
    if (req.user) {
      const progress = await prisma.userProgress.findMany({
        where: {
          userId: req.user.id,
          lesson: { module: { courseId: course.id } }
        }
      });
      course.userProgress = progress;
    }

    res.json(course);
  } catch (error) {
    next(error);
  }
};

export const createCourse = async (req, res, next) => {
  try {
    const { title, description, thumbnail, difficulty, category } = req.body;
    const course = await prisma.course.create({
      data: { title, description, thumbnail, difficulty, category, published: true }
    });
    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};

export const enrollInCourse = async (req, res, next) => {
  try {
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: req.user.id,
        courseId: req.params.id
      }
    });

    // Award XP for enrollment
    await prisma.user.update({
      where: { id: req.user.id },
      data: { xp: { increment: 50 } }
    });

    res.status(201).json(enrollment);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Already enrolled in this course' });
    }
    next(error);
  }
};

export const getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: req.user.id },
      include: {
        course: {
          include: {
            modules: {
              include: { _count: { select: { lessons: true } } },
              orderBy: { order: 'asc' }
            }
          }
        }
      },
      orderBy: { enrolledAt: 'desc' }
    });

    // Get progress for each enrolled course
    const enriched = await Promise.all(enrollments.map(async (e) => {
      const totalLessons = e.course.modules.reduce((sum, m) => sum + m._count.lessons, 0);
      const completedLessons = await prisma.userProgress.count({
        where: {
          userId: req.user.id,
          completed: true,
          lesson: { module: { courseId: e.courseId } }
        }
      });
      return {
        ...e,
        progress: { totalLessons, completedLessons, percentage: totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0 }
      };
    }));

    res.json(enriched);
  } catch (error) {
    next(error);
  }
};
