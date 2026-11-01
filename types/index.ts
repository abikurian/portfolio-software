export type Project = {
  slug: string;
  title: string;
  featured?: boolean;
  role?: string;
  stack: string[];
  summary: string;
  team?: string;
  textOnly?: boolean;
  cover?: { src: string; alt: string; width: number; height: number };
  href?: string;
  repo?: string;
  video?: string;
};

export type Experience = {
  org: string;
  role: string;
  start: string;
  end?: string;
  mode?: 'Remote' | 'On-site';
  points: string[];
};

export type StackGroup = {
  label: string;
  items: string[];
};
