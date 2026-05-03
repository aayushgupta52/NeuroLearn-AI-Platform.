import Groq from 'groq-sdk';
import prisma from '../utils/prisma.js';

const getGroqClient = () => {
  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your-groq-api-key-here') {
    return new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return null;
};

const AI_MODEL = 'llama-3.3-70b-versatile';

const mockAIResponse = (prompt) => {
  if (prompt.includes('quiz') || prompt.includes('question')) {
    return JSON.stringify({
      questions: [
        { questionText: "What is the primary purpose of React's useEffect hook?", options: ["Managing state", "Handling side effects", "Routing", "Styling"], correctAnswer: 1, difficulty: "MEDIUM", explanation: "useEffect is designed for handling side effects like API calls, subscriptions, and DOM manipulation." },
        { questionText: "Which hook is used for managing complex state logic?", options: ["useState", "useEffect", "useReducer", "useContext"], correctAnswer: 2, difficulty: "MEDIUM", explanation: "useReducer is ideal for complex state transitions that involve multiple sub-values." },
        { questionText: "What does the dependency array in useEffect control?", options: ["The return value", "When the effect runs", "The component props", "The state type"], correctAnswer: 1, difficulty: "EASY", explanation: "The dependency array determines when the effect re-runs based on changed values." }
      ]
    });
  }
  if (prompt.includes('study plan') || prompt.includes('schedule')) {
    return JSON.stringify({
      plan: [
        { day: "Monday", topics: ["React Fundamentals"], duration: "2 hours", activities: ["Read documentation", "Practice exercises"] },
        { day: "Tuesday", topics: ["State Management"], duration: "1.5 hours", activities: ["Build a counter app", "Quiz practice"] },
        { day: "Wednesday", topics: ["React Hooks"], duration: "2 hours", activities: ["useEffect deep dive", "Custom hooks"] },
        { day: "Thursday", topics: ["Review & Quiz"], duration: "1 hour", activities: ["Review weak areas", "Take practice quiz"] },
        { day: "Friday", topics: ["Project Work"], duration: "2.5 hours", activities: ["Build mini project", "Code review"] }
      ]
    });
  }
  return "I'd be happy to help you understand this concept! Let me break it down:\n\n**Key Points:**\n1. This is a fundamental concept in modern programming.\n2. Understanding it well will help you build better applications.\n3. Practice is key - try implementing small examples.\n\nWould you like me to generate some practice questions on this topic?";
};

export const chat = async (req, res, next) => {
  try {
    const { message, sessionId } = req.body;
    let session;

    if (sessionId) {
      session = await prisma.chatSession.findUnique({
        where: { id: sessionId },
        include: { messages: { orderBy: { createdAt: 'asc' }, take: 20 } }
      });
    }

    if (!session) {
      session = await prisma.chatSession.create({
        data: {
          userId: req.user.id,
          title: message.substring(0, 50) + '...',
        },
        include: { messages: true }
      });
    }

    // Save user message
    await prisma.chatMessage.create({
      data: { sessionId: session.id, role: 'user', content: message }
    });

    // Build messages for AI
    const systemPrompt = `You are NeuroLearn AI Tutor, an intelligent and friendly educational assistant. 
You help students learn effectively by:
- Explaining concepts clearly with examples
- Breaking down complex topics into simple parts
- Using analogies and real-world examples
- Encouraging the student
- Suggesting practice exercises
- Adapting your explanation style to the student's level

Format your responses with markdown for better readability. Use bold, bullet points, and code blocks where appropriate.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...session.messages.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message }
    ];

    let aiResponse;
    const groq = getGroqClient();

    if (groq) {
      const completion = await groq.chat.completions.create({
        messages,
        model: AI_MODEL,
        temperature: 0.7,
        max_tokens: 1024,
      });
      aiResponse = completion.choices[0]?.message?.content || 'I apologize, I could not generate a response.';
    } else {
      aiResponse = mockAIResponse(message);
    }

    // Save assistant message
    const assistantMsg = await prisma.chatMessage.create({
      data: { sessionId: session.id, role: 'assistant', content: aiResponse }
    });

    // Award small XP for learning
    await prisma.user.update({
      where: { id: req.user.id },
      data: { xp: { increment: 5 } }
    });

    res.json({
      sessionId: session.id,
      message: assistantMsg
    });
  } catch (error) {
    next(error);
  }
};

export const generateQuiz = async (req, res, next) => {
  try {
    const { topic, difficulty, count } = req.body;
    const numQuestions = count || 5;

    const prompt = `Generate ${numQuestions} multiple-choice quiz questions about "${topic}" at ${difficulty || 'MEDIUM'} difficulty level.

Return ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "questionText": "Question here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "difficulty": "${difficulty || 'MEDIUM'}",
      "explanation": "Brief explanation of the correct answer"
    }
  ]
}`;

    let result;
    const groq = getGroqClient();

    if (groq) {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are a quiz generator. Return ONLY valid JSON, no other text.' },
          { role: 'user', content: prompt }
        ],
        model: AI_MODEL,
        temperature: 0.8,
        max_tokens: 2048,
      });
      const raw = completion.choices[0]?.message?.content || '{}';
      const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      result = JSON.parse(cleaned);
    } else {
      result = JSON.parse(mockAIResponse('quiz question'));
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const generateStudyPlan = async (req, res, next) => {
  try {
    const { goals, weakTopics, hoursPerDay, durationDays } = req.body;

    const prompt = `Create a personalized study plan with the following parameters:
- Goals: ${goals || 'General learning improvement'}
- Weak topics to focus on: ${weakTopics?.join(', ') || 'None specified'}
- Available hours per day: ${hoursPerDay || 2}
- Duration: ${durationDays || 7} days

Return ONLY valid JSON in this format:
{
  "plan": [
    {
      "day": "Day name",
      "topics": ["Topic 1"],
      "duration": "X hours",
      "activities": ["Activity 1", "Activity 2"]
    }
  ]
}`;

    let result;
    const groq = getGroqClient();

    if (groq) {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are an educational planner. Return ONLY valid JSON.' },
          { role: 'user', content: prompt }
        ],
        model: AI_MODEL,
        temperature: 0.7,
        max_tokens: 2048,
      });
      const raw = completion.choices[0]?.message?.content || '{}';
      const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      result = JSON.parse(cleaned);
    } else {
      result = JSON.parse(mockAIResponse('study plan schedule'));
    }

    // Save to database
    const studyPlan = await prisma.studyPlan.create({
      data: {
        userId: req.user.id,
        planData: result,
        startDate: new Date(),
        endDate: new Date(Date.now() + (durationDays || 7) * 24 * 60 * 60 * 1000),
        status: 'ACTIVE'
      }
    });

    res.json({ ...studyPlan, ...result });
  } catch (error) {
    next(error);
  }
};

export const getChatSessions = async (req, res, next) => {
  try {
    const sessions = await prisma.chatSession.findMany({
      where: { userId: req.user.id },
      include: {
        messages: { orderBy: { createdAt: 'desc' }, take: 1 }
      },
      orderBy: { updatedAt: 'desc' },
      take: 20
    });
    res.json(sessions);
  } catch (error) {
    next(error);
  }
};

export const getChatMessages = async (req, res, next) => {
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { sessionId: req.params.sessionId },
      orderBy: { createdAt: 'asc' }
    });
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const generateVideoRecommendations = async (req, res, next) => {
  try {
    const { lessonId, topic } = req.body;
    
    // Check if the lesson already has recommended videos to save LLM tokens
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
    if (lesson?.recommendedVideos) {
      return res.json({ recommendations: lesson.recommendedVideos });
    }

    const prompt = `Suggest 3 highly relevant YouTube video search topics or specific video titles for a student learning about: "${topic}". 
Return ONLY valid JSON in this exact format:
{
  "recommendations": [
    {
      "title": "Clear Actionable Video Title",
      "searchQuery": "Search phrase to find this",
      "reason": "Why this video is helpful"
    }
  ]
}`;

    let result;
    const groq = getGroqClient();

    if (groq) {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are an educational assistant. Return ONLY valid JSON.' },
          { role: 'user', content: prompt }
        ],
        model: AI_MODEL,
        temperature: 0.7,
        max_tokens: 1024,
      });
      const raw = completion.choices[0]?.message?.content || '{}';
      const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      result = JSON.parse(cleaned);
    } else {
      result = {
        recommendations: [
          { title: `${topic} Explained in 5 Minutes`, searchQuery: `${topic} tutorial for beginners`, reason: 'A quick and easy introduction.' },
          { title: `Advanced Deep Dive: ${topic}`, searchQuery: `${topic} advanced concepts`, reason: 'For deeper understanding.' }
        ]
      };
    }

    // Save to database
    if (result.recommendations) {
      await prisma.lesson.update({
        where: { id: lessonId },
        data: { recommendedVideos: result.recommendations }
      });
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};
