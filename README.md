# NeuroLearn AI Platform

NeuroLearn is an AI-powered full-stack learning platform. It uses advanced AI to adapt to user needs, providing dynamic courses, lessons, and personalized study plans.

## Tech Stack

- **Frontend:** React (Vite), React Router, Recharts, CSS
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (via Prisma ORM)
- **AI Integration:** Groq SDK

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database (e.g., Neon DB)
- Groq API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aayushgupta52/NeuroLearn-AI-Platform.git
   cd NeuroLearn-AI-Platform
   ```

2. **Install dependencies:**
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the `server` directory and add your credentials:
   ```env
   DATABASE_URL="your_postgresql_connection_string"
   GROQ_API_KEY="your_groq_api_key"
   JWT_SECRET="your_jwt_secret"
   PORT=5000
   ```

4. **Initialize Database:**
   ```bash
   cd server
   npx prisma db push
   ```

5. **Start Development Servers:**
   You will need two terminals running simultaneously.
   
   **Terminal 1 (Backend):**
   ```bash
   cd server
   npm run dev
   ```

   **Terminal 2 (Frontend):**
   ```bash
   cd client
   npm run dev
   ```

## Folder Structure

- `/client` - Contains the React frontend web application.
- `/server` - Contains the Express backend API and Prisma schema.
