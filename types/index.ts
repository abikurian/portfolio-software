export type Project = {
  slug: string;
  title: string;
  status?: string;
  phase?: string;
  featured?: boolean;
  role?: string;
  stack?: string[];
  summary: string;
  team?: string;
  textOnly?: boolean;
  cover?: { src: string; alt: string; width: number; height: number };
  href?: string;
  repo?: string;
  video?: string;
  details?: string[];
  points?: string[];
  links?: { label: string; href: string }[];
  tags?: string[];
};

export type Experience = {
  org: string;
  role: string;
  start: string;
  end?: string;
  mode?: 'Remote' | 'On-site';
  points?: string[];
};

export type StackGroup = {
  label: string;
  items?: string[];
};
