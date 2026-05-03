import prisma from '../utils/prisma.js';

export const getStudyPlans = async (req, res, next) => {
  try {
    const plans = await prisma.studyPlan.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(plans);
  } catch (error) {
    next(error);
  }
};

export const getStudyPlanById = async (req, res, next) => {
  try {
    const plan = await prisma.studyPlan.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!plan) {
      return res.status(404).json({ error: 'Study plan not found' });
    }
    res.json(plan);
  } catch (error) {
    next(error);
  }
};

export const updateStudyPlanStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const plan = await prisma.studyPlan.updateMany({
      where: { id: req.params.id, userId: req.user.id },
      data: { status }
    });
    res.json(plan);
  } catch (error) {
    next(error);
  }
};
