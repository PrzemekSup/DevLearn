import { BarChart3, BookOpen, Code2, Home, LucideIcon } from "lucide-react";

interface Link {
  name: string;
};

export type MenuLink = Link & {
  url: string;
  icon: LucideIcon
};

export type ProfileLink = Link & {
  icon?: LucideIcon;
  action: () => void;
};


export const MENU_LINKS: Record<string, MenuLink> = {
  HOME: {
    url: '/',
    name: 'Home',
    icon: Home,
  },
  BLOG: {
    url: '/blog',
    name: 'Blog',
    icon: BookOpen,
  },
  DASHBOARD: {
    url: '/dashboard',
    name: 'Dashboard',
    icon: BarChart3,
  },
  PATHS: {
    url: '/paths',
    name: 'Ścieżki',
    icon: Code2,
  },
  PROFILE: {
    url: '/profile',
    name: 'Profil',
    icon: Home,
  },
}

export const PROFILE_LINKS: Record<string, ProfileLink> = {
  PROFILE: {
    name: 'Profil',
    action: () => {},
  },
  LOGIN: {
    name: 'Zaloguj',
    action: () => {},
  },
  REGISTER: {
    name: 'Zarejestruj',
    action: () => {},
  },
  LOGOUT: {
    name: 'Wyloguj',
    action: () => {},
  },
}
