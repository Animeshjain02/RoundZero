# 🎯 RoundZero - Ace Every Interview with AI

RoundZero is a premium, AI-powered interview preparation platform that helps candidates practice with an adaptive AI interviewer. It analyzes your resume, asks intelligent follow-up questions, and provides real-time, honest feedback to help you land your dream job.

![RoundZero Hero](/images/hero.webp)

## ✨ Key Features

- **🧠 Adaptive AI Interviewer:** Practice with an AI that understands your background and challenges you like a real recruiter.
- **📄 Resume-Driven:** The AI adapts its questions based on your specific experience and skills extracted from your resume.
- **🎙️ AI Voice Interviews:** Real-time voice interaction for a more immersive and realistic practice experience.
- **📊 Real-time Feedback:** Get instant scores and detailed feedback on your answers (e.g., Star Method evaluation).
- **📋 Personalized Reports:** Comprehensive post-interview reports to track your progress and identify areas for improvement.
- **⚡ Premium UI/UX:** A sleek, modern dashboard with dark mode and smooth animations.

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication:** [better-auth](https://better-auth.com/)
- **API Layer:** [oRPC](https://orpc.org/) (End-to-end type-safe API)
- **AI Engine:** [Google Gemini API](https://ai.google.dev/) via [Vercel AI SDK](https://sdk.vercel.ai/)
- **Audio Processing:** [Deepgram SDK](https://deepgram.com/)
- **Storage:** [AWS S3](https://aws.amazon.com/s3/)
- **Formatting:** [Biome](https://biomejs.dev/)

## 🛠️ Getting Started

### Prerequisites

- Node.js (version 20 or higher)
- pnpm (recommended) or npm
- PostgreSQL database




## 📂 Project Structure

- `src/app/` - Next.js App Router (Marketing, Auth, Dashboard)
- `src/components/` - Reusable UI components (shadcn/ui)
- `src/lib/` - Shared utilities and library initializations (Prisma, Gemini, etc.)
- `src/server/` - oRPC routers and server-side logic
- `src/config/` - Environment and application configuration
- `prisma/` - Database schema and migrations

## 📜 Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Run Biome check
- `pnpm format` - Run Biome format
- `pnpm db:push` - Push schema changes to database
- `pnpm db:studio` - Open Prisma Studio

---

