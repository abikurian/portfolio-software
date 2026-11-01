import type { Project } from '@/types';

export const projects: Project[] = [
  {
    slug: 'finance-tracker-pwa',
    title: 'Personal Finance Tracker PWA',
    featured: true,
    role: 'Full-stack',
    stack: ['React', 'Supabase', 'Dexie.js', 'Tailwind CSS'],
    summary:
      'Financial app with OCR receipt processing and expense prediction. A two-way sync engine keeps offline and cloud data in parity, protected by strict Row Level Security.',
  },
  {
    slug: 'smart-yatra-transit',
    title: 'Smart Yatra Transit',
    role: 'System architecture, presentation, live demo setup',
    stack: ['Flutter', 'Dart', 'Firebase'],
    summary:
      'Real-time fleet management app for tracking campus buses. Includes a custom geolocation algorithm that dynamically optimizes cloud sync frequency.',
    team: 'Built with two project partners',
  },
  {
    slug: 'smart-voting-system',
    title: 'AI-Powered Smart Voting System',
    stack: ['Python', 'Next.js', 'MongoDB'],
    summary:
      'Voting platform using machine learning for secure user verification and a tamper-proof tabulation environment.',
  },
  {
    slug: 'student-faculty-dbms',
    title: 'Student-Faculty DBMS',
    stack: ['MySQL', 'Relational schema design'],
    summary:
      'SQL schema management engine for multi-table entities with deep key relationships, complex joins and query indexing for high-throughput retrieval.',
  },
];
