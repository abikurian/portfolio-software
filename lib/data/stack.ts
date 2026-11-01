import type { StackGroup } from '@/types';

export const stackGroups: StackGroup[] = [
  {
    label: 'Languages',
    items: ['JavaScript', 'TypeScript', 'Dart', 'Python', 'C', 'SQL'],
  },
  {
    label: 'Web',
    items: ['React', 'Astro', 'Next.js', 'Node.js', 'Tailwind CSS'],
  },
  {
    label: 'Data & Cloud',
    items: ['Supabase', 'Firebase', 'Cloud Firestore', 'MongoDB', 'MySQL'],
  },
  {
    label: 'OS & Networking',
    items: ['Kali Linux', 'Ubuntu', 'WSL', 'VirtualBox'],
  },
  {
    label: 'AI Dev Tools',
    items: ['Ollama', 'Claude Code', 'Roo Code', 'OpenCode'],
  },
  {
    label: 'Tools',
    items: ['Git', 'GitHub', 'VS Code'],
  },
];
