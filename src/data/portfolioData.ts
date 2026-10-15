export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: string;
  categoryLabel?: string;
  image: string;
  description: string;
  highlights: string[];
  tags: string[];
  liveUrl?: string;
  githubUrl: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | string;
  icon: string;
  details: string;
  projectsCount: number;
}

export interface EducationMilestone {
  id: string;
  degree: string;
  institution: string;
  period: string;
  grade: string;
  gradeLabel: string;
  description: string;
  honors: string[];
  keyCourses: string[];
}

export interface Achievement {
  id: string;
  title: string;
  category: string;
  organization: string;
  year: string;
  badge: string;
  description: string;
  proofDetails: string[];
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string;
  conferenceOrJournal: string;
  year: string;
  status: 'Published' | 'Accepted' | 'Under Review' | 'Preprint' | string;
  doiOrUrl?: string;
  pdfUrl?: string;
  abstract: string;
  keywords: string[];
}

export const PORTFOLIO_DATA = {
  profile: {
    name: "Nymul Hossain",
    displayTitle: "Computer Science Engineer & Software Developer",
    location: "Dhaka, Bangladesh",
    email: "nymul.hossain.dev@gmail.com",
    phone: "+880 1712-345678",
    whatsapp: "+8801712345678",
    avatar: null as string | null, // by default no photo, owner uploads their own
    bio: "Computer Science & Engineering graduate specializing in software architecture, web applications, and embedded engineering. Driven by clean code, system performance, and algorithmic problem-solving.",
    heroRoles: [
      "Computer Science Engineer",
      "Software Developer",
      "Full-Stack Engineer"
    ],
    socials: {
      github: "https://github.com/nymul-hossain",
      linkedin: "https://linkedin.com/in/nymul-hossain",
      email: "mailto:nymul.hossain.dev@gmail.com",
      facebook: "https://facebook.com/nymul.hossain"
    },
    // By default, start with empty metrics array as requested
    metrics: [] as { label: string; value: string; context: string }[]
  },

  // By default, completely empty as requested: "and by default kono kicui rakhar dorkar nai sob remove kore dao"
  education: [] as EducationMilestone[],
  skills: [] as SkillItem[],
  projects: [] as Project[],
  achievements: [] as Achievement[],
  research: [] as ResearchPaper[],

  resume: {
    summary: "Computer Science Engineer with a strong foundation in algorithms, systems engineering, full-stack web development, and embedded IoT hardware.",
    experience: [] as { role: string; company: string; period: string; location: string; bullets: string[] }[]
  }
};
