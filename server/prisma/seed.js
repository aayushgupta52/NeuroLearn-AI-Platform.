import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding NeuroLearn AI database...');

  // Clean existing data
  await prisma.chatMessage.deleteMany();
  await prisma.chatSession.deleteMany();
  await prisma.weakArea.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.studyPlan.deleteMany();
  await prisma.quizResult.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const passwordHash = await bcrypt.hash('password123', 12);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@neurolearn.ai',
      passwordHash,
      role: 'ADMIN',
      xp: 50000,
      level: 50,
      streak: 100,
      isPremium: true
    }
  });

  const student = await prisma.user.create({
    data: {
      name: 'Alex Johnson',
      email: 'alex@example.com',
      passwordHash,
      role: 'STUDENT',
      xp: 2450,
      level: 5,
      streak: 12,
      isPremium: false
    }
  });

  console.log('✅ Users created');

  // Create Courses
  const webDev = await prisma.course.create({
    data: {
      title: 'Modern Web Development',
      description: 'Master React, Node.js, and modern web architecture from the ground up. Build production-ready applications with industry best practices.',
      category: 'Web Development',
      difficulty: 'MEDIUM',
      published: true
    }
  });

  const mlCourse = await prisma.course.create({
    data: {
      title: 'Machine Learning Foundations',
      description: 'Learn the mathematical foundations and practical applications of ML algorithms. From linear regression to neural networks.',
      category: 'Machine Learning',
      difficulty: 'HARD',
      published: true
    }
  });

  const pythonDS = await prisma.course.create({
    data: {
      title: 'Python for Data Science',
      description: 'From pandas to matplotlib — everything you need for data analysis and visualization.',
      category: 'Data Science',
      difficulty: 'EASY',
      published: true
    }
  });

  console.log('✅ Courses created');

  // Web Dev Modules & Lessons
  const mod1 = await prisma.module.create({
    data: {
      courseId: webDev.id,
      title: 'Component Basics',
      order: 1
    }
  });

  const mod2 = await prisma.module.create({
    data: {
      courseId: webDev.id,
      title: 'React Hooks',
      order: 2
    }
  });

  const mod3 = await prisma.module.create({
    data: {
      courseId: webDev.id,
      title: 'Context API',
      order: 3
    }
  });

  // Lessons for Module 1
  const lesson1 = await prisma.lesson.create({
    data: {
      moduleId: mod1.id, title: 'Introduction to Components', order: 1, type: 'TEXT',
      content: '# Introduction to React Components\n\nComponents are the building blocks of any React application. They let you split the UI into independent, reusable pieces.\n\n## What is a Component?\n\nA React component is a JavaScript function or class that returns a React element (JSX).\n\n```jsx\nfunction Welcome({ name }) {\n  return <h1>Hello, {name}!</h1>;\n}\n```\n\n## Key Principles\n- Components should be small and focused\n- Follow the Single Responsibility Principle\n- Use composition over inheritance'
    }
  });

  const lesson2 = await prisma.lesson.create({
    data: {
      moduleId: mod1.id, title: 'State & Props', order: 2, type: 'TEXT',
      content: '# State & Props in React\n\nUnderstanding state and props is fundamental to React.\n\n## Props\nProps are read-only inputs passed from parent to child.\n\n## State\nState is mutable data managed within a component using useState.\n\n```jsx\nconst [count, setCount] = useState(0);\n```'
    }
  });

  const lesson3 = await prisma.lesson.create({
    data: {
      moduleId: mod1.id, title: 'useEffect & Lifecycle', order: 3, type: 'TEXT',
      content: '# Understanding useEffect\n\nMaster the most powerful hook for managing side effects.\n\n## The Dependency Array\nControls when the effect re-runs.\n\n```jsx\nuseEffect(() => {\n  document.title = `Count: ${count}`;\n}, [count]);\n```'
    }
  });

  const lesson4 = await prisma.lesson.create({
    data: {
      moduleId: mod2.id, title: 'Intro to Hooks', order: 1, type: 'TEXT',
      content: '# React Hooks Overview\n\nHooks let you use state and other React features without writing a class.'
    }
  });

  const lesson5 = await prisma.lesson.create({
    data: {
      moduleId: mod2.id, title: 'useState Deep Dive', order: 2, type: 'TEXT',
      content: '# useState Deep Dive\n\nLearn advanced patterns with useState including functional updates and lazy initialization.'
    }
  });

  const lesson6 = await prisma.lesson.create({
    data: {
      moduleId: mod3.id, title: 'Context Basics', order: 1, type: 'TEXT',
      content: '# React Context API\n\nContext provides a way to pass data through the component tree without props drilling.'
    }
  });

  console.log('✅ Modules & Lessons created');

  // Create Quiz
  const quiz1 = await prisma.quiz.create({
    data: {
      lessonId: lesson2.id,
      title: 'State & Props Quiz',
      timeLimit: 300,
      difficulty: 'MEDIUM'
    }
  });

  await prisma.question.createMany({
    data: [
      {
        quizId: quiz1.id,
        questionText: 'What is the primary purpose of React props?',
        options: JSON.stringify(['Manage internal state', 'Pass data from parent to child', 'Handle events', 'Style components']),
        correctAnswer: 1,
        difficulty: 'EASY',
        explanation: 'Props (properties) are used to pass data from parent components to child components.'
      },
      {
        quizId: quiz1.id,
        questionText: 'Which hook is used to manage state in functional components?',
        options: JSON.stringify(['useEffect', 'useContext', 'useState', 'useRef']),
        correctAnswer: 2,
        difficulty: 'EASY',
        explanation: 'useState is the primary hook for managing state in functional components.'
      },
      {
        quizId: quiz1.id,
        questionText: 'What happens when you call setState with the same value?',
        options: JSON.stringify(['Component re-renders', 'React bails out of re-render', 'An error is thrown', 'State resets to initial value']),
        correctAnswer: 1,
        difficulty: 'MEDIUM',
        explanation: 'React uses Object.is comparison and will bail out of re-rendering if the state value hasn\'t changed.'
      },
      {
        quizId: quiz1.id,
        questionText: 'Are props mutable or immutable in React?',
        options: JSON.stringify(['Mutable', 'Immutable', 'Depends on the type', 'They can be either']),
        correctAnswer: 1,
        difficulty: 'EASY',
        explanation: 'Props are read-only (immutable) — a component should never modify its own props.'
      },
      {
        quizId: quiz1.id,
        questionText: 'What is the correct way to update state based on previous state?',
        options: JSON.stringify(['setState(state + 1)', 'setState(prev => prev + 1)', 'state++; setState(state)', 'setState({...state, count: state.count + 1})']),
        correctAnswer: 1,
        difficulty: 'MEDIUM',
        explanation: 'Using a functional update (prev => prev + 1) ensures you work with the latest state value.'
      }
    ]
  });

  console.log('✅ Quiz & Questions created');

  // Enroll student
  await prisma.enrollment.create({
    data: { userId: student.id, courseId: webDev.id }
  });

  // Add progress
  await prisma.userProgress.createMany({
    data: [
      { userId: student.id, lessonId: lesson1.id, completed: true, completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), timeSpent: 1200 },
      { userId: student.id, lessonId: lesson2.id, completed: true, completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), timeSpent: 900 },
    ]
  });

  // Add achievements
  await prisma.achievement.createMany({
    data: [
      { userId: student.id, type: 'WELCOME', title: 'Welcome to NeuroLearn!', description: 'Created your account.', icon: '🎉' },
      { userId: student.id, type: 'FIRST_COURSE', title: 'Course Explorer', description: 'Enrolled in your first course.', icon: '📚' },
      { userId: student.id, type: 'STREAK_7', title: '7-Day Streak', description: 'Maintained a 7-day learning streak!', icon: '🔥' },
    ]
  });

  // Add weak areas
  await prisma.weakArea.createMany({
    data: [
      { userId: student.id, topic: 'Dependency Arrays', accuracy: 45, attempts: 3 },
      { userId: student.id, topic: 'Closures in Hooks', accuracy: 62, attempts: 2 },
      { userId: student.id, topic: 'Context Provider', accuracy: 78, attempts: 4 },
    ]
  });

  console.log('✅ User data seeded');
  console.log('\n🎉 Seed complete!');
  console.log('──────────────────────────────');
  console.log('Demo accounts:');
  console.log('  Student: alex@example.com / password123');
  console.log('  Admin:   admin@neurolearn.ai / password123');
  console.log('──────────────────────────────');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
