import { useState, useEffect } from 'react';
import { 
  mockAppUsage, 
  mockUserGoals, 
  mockRewards, 
  mockUserProfile,
  AppUsage,
  UserGoal,
  Reward,
  UserProfile,
  getWeeklyUsage,
  isOverWeeklyGoal,
  getGoalPercentage,
  getMostUsedApps,
  getOverGoalApps
} from '../data/mockData';

export const useAppUsage = () => {
  const [appUsage, setAppUsage] = useState<AppUsage[]>(mockAppUsage);
  const [userGoals, setUserGoals] = useState<UserGoal[]>(mockUserGoals);
  const [rewards, setRewards] = useState<Reward[]>(mockRewards);
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile);
  
  // Get a specific app's data by ID
  const getAppById = (id: string): AppUsage | undefined => {
    return appUsage.find(app => app.id === id);
  };
  
  // Get a user goal by app ID
  const getGoalByAppId = (appId: string): UserGoal | undefined => {
    return userGoals.find(goal => goal.appId === appId);
  };
  
  // Update a user goal
  const updateGoal = (goalId: string, updates: Partial<UserGoal>) => {
    setUserGoals(prevGoals => 
      prevGoals.map(goal => 
        goal.id === goalId ? { ...goal, ...updates } : goal
      )
    );
  };
  
  // Add a new goal
  const addGoal = (newGoal: UserGoal) => {
    setUserGoals(prevGoals => [...prevGoals, newGoal]);
  };
  
  // Get all apps by category
  const getAppsByCategory = (category: AppUsage['category']) => {
    return appUsage.filter(app => app.category === category);
  };
  
  // Get unlocked rewards
  const getUnlockedRewards = () => {
    return rewards.filter(reward => reward.unlocked);
  };
  
  // Get locked rewards
  const getLockedRewards = () => {
    return rewards.filter(reward => !reward.unlocked);
  };
  
  // Unlock a reward
  const unlockReward = (rewardId: string) => {
    setRewards(prevRewards => 
      prevRewards.map(reward => 
        reward.id === rewardId 
          ? { ...reward, unlocked: true, dateUnlocked: new Date().toISOString() } 
          : reward
      )
    );
  };
  
  // Add points to user profile
  const addPoints = (points: number) => {
    setUserProfile(prevProfile => ({
      ...prevProfile,
      points: prevProfile.points + points
    }));
  };
  
  // Increment streak days
  const incrementStreakDays = () => {
    setUserProfile(prevProfile => ({
      ...prevProfile,
      streakDays: prevProfile.streakDays + 1
    }));
  };
  
  // Reset streak days
  const resetStreakDays = () => {
    setUserProfile(prevProfile => ({
      ...prevProfile,
      streakDays: 0
    }));
  };
  
  // Update total saved time
  const updateTotalSavedTime = (minutes: number) => {
    setUserProfile(prevProfile => ({
      ...prevProfile,
      totalSavedTime: prevProfile.totalSavedTime + minutes
    }));
  };
  
  return {
    appUsage,
    userGoals,
    rewards,
    userProfile,
    getAppById,
    getGoalByAppId,
    updateGoal,
    addGoal,
    getAppsByCategory,
    getUnlockedRewards,
    getLockedRewards,
    unlockReward,
    addPoints,
    incrementStreakDays,
    resetStreakDays,
    updateTotalSavedTime,
    // Exported helper functions from mockData
    getWeeklyUsage,
    isOverWeeklyGoal,
    getGoalPercentage,
    getMostUsedApps,
    getOverGoalApps
  };
};
