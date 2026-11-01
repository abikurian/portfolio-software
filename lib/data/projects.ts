import type { Project } from '@/types';

export const projects: Project[] = [
  {
    slug: 'local-workforce-recruitment-portal',
    title: 'Local Workforce Recruitment Portal',
    status: 'In development',
    phase: 'Research & System Architecture Phase',
    stack: [],
    summary:
      'A proposed web and mobile platform digitizing temporary staffing for the event and hospitality industry, focusing on tracking worker reliability, RBAC, and location-based job discovery.',
  },
  {
    slug: 'spendstudent-finance-tracker',
    title: 'SpendStudent (Finance Tracker)',
    stack: ['React', 'Supabase (PostgreSQL)', 'Dexie.js'],
    summary:
      'A personal finance tracker featuring OCR receipt processing and a two-way sync engine ensuring offline-to-cloud data parity with strict row-level security.',
  },
  {
    slug: 'smart-yatra',
    title: 'Smart Yatra',
    stack: ['Dart', 'Flutter', 'Firebase'],
    summary:
      'A real-time fleet management app for campus buses utilizing a custom geolocation algorithm to dynamically optimize cloud sync frequency and battery life.',
  },
  {
    slug: 'smart-voting-system',
    title: 'AI-Powered Smart Voting System',
    stack: ['Python', 'Next.js', 'MongoDB'],
    summary:
      'An intelligent voting platform integrating machine learning for secure user verification and tamper-proof tabulation.',
  },
  {
    slug: 'interactive-web-portfolios',
    title: 'Interactive Web Portfolios',
    stack: ['Astro', 'React', 'Tailwind CSS', 'Vercel'],
    summary:
      'Highly optimized, responsive portfolios featuring glassmorphism, 3D scroll-based canvas animations, and brutalist UI layouts.',
  },
  {
    slug: 'loan-prediction-application',
    title: 'AI-Powered Loan Prediction Application',
    stack: ['Python', 'Flask', 'Scikit-learn', 'Random Forest', 'Mistral AI API'],
    summary:
      'An ML application predicting loan outcomes, integrating Generative AI and LLMs to provide user-facing explanations for prediction reasoning.',
  },
  {
    slug: 'automated-data-management-engine',
    title: 'Automated Data Management Engine',
    stack: ['Python', 'Pandas', 'Tkinter', 'gspread'],
    summary:
      'A secure backend automation pipeline for student marks entry. Parses local datasets securely and pushes them into cloud-backed Google Sheets infrastructure via service account authentication.',
  },
];
