// Types for our mock data
export interface AppUsage {
  id: string;
  name: string;
  icon: string; // Icon name from Ionicons
  color: string; // Brand color for the app
  usage: {
    // Daily usage in minutes
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
    sunday: number;
  };
  weeklyGoal: number; // Weekly goal in minutes
  category: 'social' | 'entertainment' | 'productivity' | 'gaming' | 'other';
}

export interface UserGoal {
  id: string;
  appId: string;
  targetMinutes: number; // Weekly target in minutes
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  completed: boolean;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  icon: string; // Icon name from Ionicons
  requiredPoints: number;
  unlocked: boolean;
  dateUnlocked?: string; // ISO date string, optional
}

export interface UserProfile {
  name: string;
  points: number;
  streakDays: number;
  totalSavedTime: number; // In minutes
}

// Mock data for app usage
export const mockAppUsage: AppUsage[] = [
  {
    id: '1',
    name: 'Instagram',
    icon: 'logo-instagram',
    color: '#E1306C',
    usage: {
      monday: 45,
      tuesday: 62,
      wednesday: 38,
      thursday: 70,
      friday: 85,
      saturday: 120,
      sunday: 95,
    },
    weeklyGoal: 420, // 7 hours per week
    category: 'social',
  },
  {
    id: '2',
    name: 'YouTube',
    icon: 'logo-youtube',
    color: '#FF0000',
    usage: {
      monday: 65,
      tuesday: 45,
      wednesday: 80,
      thursday: 30,
      friday: 60,
      saturday: 150,
      sunday: 120,
    },
    weeklyGoal: 360, // 6 hours per week
    category: 'entertainment',
  },
  {
    id: '3',
    name: 'TikTok',
    icon: 'musical-notes',
    color: '#000000',
    usage: {
      monday: 35,
      tuesday: 42,
      wednesday: 28,
      thursday: 45,
      friday: 55,
      saturday: 90,
      sunday: 75,
    },
    weeklyGoal: 240, // 4 hours per week
    category: 'social',
  },
  {
    id: '4',
    name: 'Twitter',
    icon: 'logo-twitter',
    color: '#1DA1F2',
    usage: {
      monday: 25,
      tuesday: 30,
      wednesday: 15,
      thursday: 35,
      friday: 40,
      saturday: 50,
      sunday: 45,
    },
    weeklyGoal: 180, // 3 hours per week
    category: 'social',
  },
  {
    id: '5',
    name: 'Netflix',
    icon: 'film',
    color: '#E50914',
    usage: {
      monday: 30,
      tuesday: 0,
      wednesday: 60,
      thursday: 0,
      friday: 45,
      saturday: 180,
      sunday: 120,
    },
    weeklyGoal: 300, // 5 hours per week
    category: 'entertainment',
  },
  {
    id: '6',
    name: 'WhatsApp',
    icon: 'logo-whatsapp',
    color: '#25D366',
    usage: {
      monday: 35,
      tuesday: 40,
      wednesday: 30,
      thursday: 45,
      friday: 50,
      saturday: 60,
      sunday: 55,
    },
    weeklyGoal: 210, // 3.5 hours per week
    category: 'social',
  },
  {
    id: '7',
    name: 'Facebook',
    icon: 'logo-facebook',
    color: '#1877F2',
    usage: {
      monday: 20,
      tuesday: 25,
      wednesday: 15,
      thursday: 30,
      friday: 35,
      saturday: 45,
      sunday: 40,
    },
    weeklyGoal: 150, // 2.5 hours per week
    category: 'social',
  },
  {
    id: '8',
    name: 'Gaming',
    icon: 'game-controller',
    color: '#5865F2',
    usage: {
      monday: 0,
      tuesday: 30,
      wednesday: 0,
      thursday: 45,
      friday: 60,
      saturday: 120,
      sunday: 90,
    },
    weeklyGoal: 240, // 4 hours per week
    category: 'gaming',
  },
];

// Mock data for user goals
export const mockUserGoals: UserGoal[] = [
  {
    id: '1',
    appId: '1', // Instagram
    targetMinutes: 300, // 5 hours per week
    startDate: '2025-04-20T00:00:00.000Z',
    endDate: '2025-04-26T23:59:59.999Z',
    completed: false,
  },
  {
    id: '2',
    appId: '2', // YouTube
    targetMinutes: 240, // 4 hours per week
    startDate: '2025-04-20T00:00:00.000Z',
    endDate: '2025-04-26T23:59:59.999Z',
    completed: false,
  },
  {
    id: '3',
    appId: '3', // TikTok
    targetMinutes: 180, // 3 hours per week
    startDate: '2025-04-20T00:00:00.000Z',
    endDate: '2025-04-26T23:59:59.999Z',
    completed: true,
  },
];

// Mock data for rewards
export const mockRewards: Reward[] = [
  {
    id: '1',
    title: 'Digital Detox Beginner',
    description: 'Complete your first week of staying under app usage goals',
    icon: 'trophy-outline',
    requiredPoints: 100,
    unlocked: true,
    dateUnlocked: '2025-04-19T15:23:00.000Z',
  },
  {
    id: '2',
    title: 'Social Media Master',
    description: 'Stay under your social media app goals for 2 weeks straight',
    icon: 'thumbs-up-outline',
    requiredPoints: 250,
    unlocked: false,
  },
  {
    id: '3',
    title: 'Entertainment Guru',
    description: 'Reduce entertainment app usage by 30% for a week',
    icon: 'film-outline',
    requiredPoints: 300,
    unlocked: false,
  },
  {
    id: '4',
    title: 'Digital Freedom',
    description: 'Complete a full month of staying under all app usage goals',
    icon: 'ribbon-outline',
    requiredPoints: 500,
    unlocked: false,
  },
  {
    id: '5',
    title: 'Productivity Champion',
    description: 'Increase productivity app usage while decreasing entertainment apps',
    icon: 'trending-up-outline',
    requiredPoints: 400,
    unlocked: false,
  },
];

// Mock user profile
export const mockUserProfile: UserProfile = {
  name: 'Alex',
  points: 150,
  streakDays: 5,
  totalSavedTime: 420, // 7 hours saved
};

// Helper functions to work with the mock data

// Get total weekly usage for an app
export const getWeeklyUsage = (appUsage: AppUsage): number => {
  const { usage } = appUsage;
  return (
    usage.monday +
    usage.tuesday +
    usage.wednesday +
    usage.thursday +
    usage.friday +
    usage.saturday +
    usage.sunday
  );
};

// Check if an app is over its weekly goal
export const isOverWeeklyGoal = (appUsage: AppUsage): boolean => {
  return getWeeklyUsage(appUsage) > appUsage.weeklyGoal;
};

// Get percentage of goal used
export const getGoalPercentage = (appUsage: AppUsage): number => {
  const weeklyUsage = getWeeklyUsage(appUsage);
  return Math.min(Math.round((weeklyUsage / appUsage.weeklyGoal) * 100), 100);
};

// Get apps sorted by most used
export const getMostUsedApps = (): AppUsage[] => {
  return [...mockAppUsage].sort(
    (a, b) => getWeeklyUsage(b) - getWeeklyUsage(a)
  );
};

// Get apps that are over their weekly goal
export const getOverGoalApps = (): AppUsage[] => {
  return mockAppUsage.filter(app => isOverWeeklyGoal(app));
};

// Get total saved time (goal - actual usage) for all apps
export const getTotalSavedTime = (): number => {
  return mockAppUsage.reduce((total, app) => {
    const weeklyUsage = getWeeklyUsage(app);
    if (weeklyUsage < app.weeklyGoal) {
      return total + (app.weeklyGoal - weeklyUsage);
    }
    return total;
  }, 0);
};
