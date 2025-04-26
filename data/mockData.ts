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

export interface Challenge {
  id: string;
  title: string;
  description: string;
  appId: string;
  targetMinutes: number; // Target minutes for the challenge period
  duration: number; // Duration in days
  difficulty: 'easy' | 'medium' | 'hard';
  reward: {
    points: number;
    badge?: string;
  };
  participants: number; // Number of participants
  startDate: string; // ISO date string
  endDate: string; // ISO date string
}

export interface UserChallenge {
  id: string;
  challengeId: string;
  status: 'active' | 'completed' | 'failed';
  joinedDate: string; // ISO date string
  endDate: string; // ISO date string when the challenge will end
  currentUsage: number; // Current usage in minutes
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
  // New properties for cashback-style rewards
  category?: 'social' | 'entertainment' | 'productivity' | 'gaming' | 'shopping' | 'travel' | 'food' | 'fitness';
  cashbackPercent?: number; // Percentage of cashback (e.g., 5% cashback)
  discountAmount?: number; // Flat discount amount (e.g., ₹300 off)
  isSale?: boolean; // Whether the reward is on sale
  brandLogo?: string; // URL to brand logo image (optional)
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

// Mock data for challenges
export const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Instagram Detox',
    description: 'Limit Instagram usage to 7 hours for the entire month',
    appId: '1', // Instagram
    targetMinutes: 420, // 7 hours
    duration: 30, // 30 days
    difficulty: 'medium',
    reward: {
      points: 300,
      badge: 'Instagram Master'
    },
    participants: 1458,
    startDate: '2025-04-01T00:00:00.000Z',
    endDate: '2025-04-30T23:59:59.999Z'
  },
  {
    id: '2',
    title: 'YouTube Weekend Break',
    description: 'Keep YouTube usage under 2 hours this weekend',
    appId: '2', // YouTube
    targetMinutes: 120, // 2 hours
    duration: 2, // 2 days
    difficulty: 'easy',
    reward: {
      points: 100
    },
    participants: 2735,
    startDate: '2025-04-26T00:00:00.000Z',
    endDate: '2025-04-27T23:59:59.999Z'
  },
  {
    id: '3',
    title: 'Social Media Cleanse',
    description: 'Reduce all social media usage by 50% for two weeks',
    appId: '1', // Instagram (representative of all social)
    targetMinutes: 840, // 14 hours over two weeks
    duration: 14, // 14 days
    difficulty: 'hard',
    reward: {
      points: 500,
      badge: 'Digital Detox Champion'
    },
    participants: 876,
    startDate: '2025-04-15T00:00:00.000Z',
    endDate: '2025-04-29T23:59:59.999Z'
  },
  {
    id: '4',
    title: 'Gaming Moderation',
    description: 'Limit gaming to 5 hours for the week',
    appId: '8', // Gaming
    targetMinutes: 300, // 5 hours
    duration: 7, // 7 days
    difficulty: 'medium',
    reward: {
      points: 200,
      badge: 'Balanced Gamer'
    },
    participants: 1245,
    startDate: '2025-04-22T00:00:00.000Z',
    endDate: '2025-04-28T23:59:59.999Z'
  },
  {
    id: '5',
    title: 'Netflix Binge Control',
    description: 'Watch Netflix for no more than 4 hours this week',
    appId: '5', // Netflix
    targetMinutes: 240, // 4 hours
    duration: 7, // 7 days
    difficulty: 'medium',
    reward: {
      points: 150
    },
    participants: 1876,
    startDate: '2025-04-20T00:00:00.000Z',
    endDate: '2025-04-26T23:59:59.999Z'
  }
];

// Mock data for user challenges
export const mockUserChallenges: UserChallenge[] = [
  {
    id: '1',
    challengeId: '1', // Instagram Detox
    status: 'active',
    joinedDate: '2025-04-05T10:23:00.000Z',
    endDate: '2025-04-30T23:59:59.999Z',
    currentUsage: 280, // 280 minutes so far
    completed: false
  },
  {
    id: '2',
    challengeId: '4', // Gaming Moderation
    status: 'active',
    joinedDate: '2025-04-22T15:45:00.000Z',
    endDate: '2025-04-28T23:59:59.999Z',
    currentUsage: 180, // 180 minutes so far
    completed: false
  },
  {
    id: '3',
    challengeId: '3', // Social Media Cleanse
    status: 'completed',
    joinedDate: '2025-03-01T09:30:00.000Z',
    endDate: '2025-03-15T23:59:59.999Z',
    currentUsage: 720, // Completed under target
    completed: true
  }
];

// Mock data for rewards
export const mockRewards: Reward[] = [
  {
    id: 'r1',
    title: 'SBI Card',
    description: 'Get cashback on your credit card purchases',
    icon: 'card',
    requiredPoints: 100,
    unlocked: true,
    dateUnlocked: '2025-04-20T10:00:00Z',
    category: 'shopping',
    cashbackPercent: undefined,
    discountAmount: 1400,
    isSale: false
  },
  {
    id: 'r2',
    title: 'Jio',
    description: 'Discount on your next recharge',
    icon: 'wifi',
    requiredPoints: 200,
    unlocked: true,
    dateUnlocked: '2025-04-22T14:30:00Z',
    category: 'entertainment',
    cashbackPercent: 8,
    discountAmount: undefined,
    isSale: true
  },
  {
    id: 'r3',
    title: 'Woodland',
    description: 'Discount on outdoor gear',
    icon: 'leaf',
    requiredPoints: 300,
    unlocked: true,
    dateUnlocked: '2025-04-23T09:15:00Z',
    category: 'shopping',
    cashbackPercent: 7,
    discountAmount: undefined,
    isSale: false
  },
  {
    id: 'r4',
    title: 'boAt',
    description: 'Discount on headphones and speakers',
    icon: 'headset',
    requiredPoints: 250,
    unlocked: true,
    dateUnlocked: '2025-04-24T16:45:00Z',
    category: 'entertainment',
    cashbackPercent: 5,
    discountAmount: undefined,
    isSale: true
  },
  {
    id: 'r5',
    title: 'Shyaway',
    description: 'Fashion discount',
    icon: 'shirt',
    requiredPoints: 300,
    unlocked: false,
    category: 'shopping',
    cashbackPercent: undefined,
    discountAmount: 300,
    isSale: true
  },
  {
    id: 'r6',
    title: 'Udemy',
    description: 'Discount on online courses',
    icon: 'school',
    requiredPoints: 350,
    unlocked: false,
    category: 'productivity',
    cashbackPercent: 13,
    discountAmount: undefined,
    isSale: false
  },
  {
    id: 'r7',
    title: 'Amazon',
    description: 'Shopping discount',
    icon: 'cart',
    requiredPoints: 400,
    unlocked: false,
    category: 'shopping',
    cashbackPercent: 6,
    discountAmount: undefined,
    isSale: true
  },
  {
    id: 'r8',
    title: 'Nykaa',
    description: 'Beauty products discount',
    icon: 'flower',
    requiredPoints: 450,
    unlocked: false,
    category: 'shopping',
    cashbackPercent: 7,
    discountAmount: undefined,
    isSale: false
  },
  {
    id: 'r9',
    title: 'Flipkart',
    description: 'Online shopping discount',
    icon: 'cart',
    requiredPoints: 500,
    unlocked: false,
    category: 'shopping',
    cashbackPercent: 7,
    discountAmount: undefined,
    isSale: true
  },
  {
    id: 'r10',
    title: 'Dell',
    description: 'Discount on laptops and accessories',
    icon: 'laptop',
    requiredPoints: 600,
    unlocked: false,
    category: 'productivity',
    cashbackPercent: 5,
    discountAmount: undefined,
    isSale: false
  },
  {
    id: 'r11',
    title: 'Indigo',
    description: 'Discount on flight bookings',
    icon: 'airplane',
    requiredPoints: 800,
    unlocked: false,
    category: 'travel',
    cashbackPercent: undefined,
    discountAmount: 1000,
    isSale: false
  },
  {
    id: 'r12',
    title: 'Dr. Morepen',
    description: 'Discount on health products',
    icon: 'medkit',
    requiredPoints: 350,
    unlocked: false,
    category: 'fitness',
    cashbackPercent: 85,
    discountAmount: undefined,
    isSale: false
  }
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
