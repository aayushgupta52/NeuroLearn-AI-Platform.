import prisma from '../utils/prisma.js';

export const getQuiz = async (req, res, next) => {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.id },
      include: {
        questions: {
          select: { id: true, questionText: true, options: true, difficulty: true }
        },
        lesson: { select: { id: true, title: true, module: { select: { course: { select: { title: true } } } } } }
      }
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json(quiz);
  } catch (error) {
    next(error);
  }
};

export const submitQuiz = async (req, res, next) => {
  try {
    const { answers, timeTaken } = req.body;
    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.id },
      include: { questions: true }
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Calculate score
    let score = 0;
    const maxScore = quiz.questions.length;
    const graded = {};

    quiz.questions.forEach(q => {
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) score++;
      graded[q.id] = {
        selected: userAnswer,
        correct: q.correctAnswer,
        isCorrect,
        explanation: q.explanation
      };
    });

    // Save result
    const result = await prisma.quizResult.create({
      data: {
        userId: req.user.id,
        quizId: quiz.id,
        score,
        maxScore,
        answers: graded,
        timeTaken: timeTaken || 0
      }
    });

    // Award XP based on performance
    const percentage = (score / maxScore) * 100;
    let xpEarned = Math.round(percentage / 2);
    if (percentage === 100) xpEarned += 50; // Perfect score bonus

    await prisma.user.update({
      where: { id: req.user.id },
      data: { xp: { increment: xpEarned } }
    });

    // Update weak areas
    const topicMap = {};
    quiz.questions.forEach(q => {
      const topic = quiz.lesson?.title || 'General';
      if (!topicMap[topic]) topicMap[topic] = { correct: 0, total: 0 };
      topicMap[topic].total++;
      if (graded[q.id].isCorrect) topicMap[topic].correct++;
    });

    for (const [topic, stats] of Object.entries(topicMap)) {
      const accuracy = (stats.correct / stats.total) * 100;
      await prisma.weakArea.upsert({
        where: { userId_topic: { userId: req.user.id, topic } },
        create: { userId: req.user.id, topic, accuracy, attempts: 1 },
        update: { accuracy, attempts: { increment: 1 }, lastTestedAt: new Date() }
      });
    }

    // Check achievements
    const totalResults = await prisma.quizResult.count({ where: { userId: req.user.id } });
    if (totalResults === 1) {
      await prisma.achievement.create({
        data: {
          userId: req.user.id, type: 'FIRST_QUIZ',
          title: 'Quiz Starter', description: 'Completed your first quiz!', icon: '📝'
        }
      });
    }
    if (percentage === 100) {
      await prisma.achievement.create({
        data: {
          userId: req.user.id, type: 'PERFECT_SCORE',
          title: 'Perfect Score!', description: 'Scored 100% on a quiz!', icon: '🏆'
        }
      });
    }

    res.json({
      result,
      score,
      maxScore,
      percentage: Math.round(percentage),
      xpEarned,
      graded
    });
  } catch (error) {
    next(error);
  }
};

export const getQuizHistory = async (req, res, next) => {
  try {
    const results = await prisma.quizResult.findMany({
      where: { userId: req.user.id },
      include: {
        quiz: { select: { title: true, difficulty: true, lesson: { select: { title: true } } } }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    res.json(results);
  } catch (error) {
    next(error);
  }
};
