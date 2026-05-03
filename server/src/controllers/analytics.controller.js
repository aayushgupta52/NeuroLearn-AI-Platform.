import prisma from '../utils/prisma.js';

export const getOverview = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [
      totalLessonsCompleted,
      totalQuizzesTaken,
      quizResults,
      enrollments,
      achievements,
      weakAreas,
      user
    ] = await Promise.all([
      prisma.userProgress.count({ where: { userId, completed: true } }),
      prisma.quizResult.count({ where: { userId } }),
      prisma.quizResult.findMany({
        where: { userId },
        select: { score: true, maxScore: true, timeTaken: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 50
      }),
      prisma.enrollment.count({ where: { userId } }),
      prisma.achievement.count({ where: { userId } }),
      prisma.weakArea.findMany({ where: { userId }, orderBy: { accuracy: 'asc' }, take: 5 }),
      prisma.user.findUnique({ where: { id: userId }, select: { xp: true, level: true, streak: true } })
    ]);

    // Calculate averages
    const totalScore = quizResults.reduce((sum, r) => sum + r.score, 0);
    const totalMaxScore = quizResults.reduce((sum, r) => sum + r.maxScore, 0);
    const avgAccuracy = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0;
    const totalStudyTime = quizResults.reduce((sum, r) => sum + r.timeTaken, 0);

    // Weekly performance (last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyResults = quizResults.filter(r => new Date(r.createdAt) > weekAgo);
    const dailyXP = {};
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      dailyXP[days[d.getDay()]] = 0;
    }

    res.json({
      overview: {
        totalLessonsCompleted,
        totalQuizzesTaken,
        enrolledCourses: enrollments,
        achievementsEarned: achievements,
        avgAccuracy,
        totalStudyTime: Math.round(totalStudyTime / 60), // minutes
        xp: user?.xp || 0,
        level: user?.level || 1,
        streak: user?.streak || 0
      },
      weakAreas,
      weeklyActivity: dailyXP,
      recentQuizzes: quizResults.slice(0, 10)
    });
  } catch (error) {
    next(error);
  }
};

export const getPerformance = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const results = await prisma.quizResult.findMany({
      where: { userId },
      include: {
        quiz: { select: { title: true, difficulty: true, lesson: { select: { title: true } } } }
      },
      orderBy: { createdAt: 'desc' },
      take: 30
    });

    // Group by topic
    const topicPerformance = {};
    results.forEach(r => {
      const topic = r.quiz?.lesson?.title || r.quiz?.title || 'General';
      if (!topicPerformance[topic]) {
        topicPerformance[topic] = { totalScore: 0, totalMax: 0, attempts: 0 };
      }
      topicPerformance[topic].totalScore += r.score;
      topicPerformance[topic].totalMax += r.maxScore;
      topicPerformance[topic].attempts++;
    });

    const topics = Object.entries(topicPerformance).map(([topic, data]) => ({
      topic,
      accuracy: Math.round((data.totalScore / data.totalMax) * 100),
      attempts: data.attempts
    }));

    res.json({ results, topicPerformance: topics });
  } catch (error) {
    next(error);
  }
};

export const getWeakAreas = async (req, res, next) => {
  try {
    const weakAreas = await prisma.weakArea.findMany({
      where: { userId: req.user.id },
      orderBy: { accuracy: 'asc' }
    });
    res.json(weakAreas);
  } catch (error) {
    next(error);
  }
};
