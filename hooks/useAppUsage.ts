import { useState, useEffect } from 'react';
import { 
  mockAppUsage, 
  mockChallenges,
  mockUserChallenges, 
  mockRewards, 
  mockUserProfile,
  AppUsage,
  Challenge,
  UserChallenge,
  Reward,
  UserProfile,
  getWeeklyUsage,
  isOverWeeklyGoal,
  getGoalPercentage,
  getMostUsedApps as getMostUsedAppsFn,
  getOverGoalApps as getOverGoalAppsFn
} from '../data/mockData';
import { saveData, loadData, STORAGE_KEYS } from '../utils/storage';

export const useAppUsage = () => {
  const [appUsage, setAppUsage] = useState<AppUsage[]>(mockAppUsage);
  const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges);
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>(mockUserChallenges);
  const [rewards, setRewards] = useState<Reward[]>(mockRewards);
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Load data from local storage on component mount
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        setIsLoading(true);
        
        // Load app usage data
        const storedAppUsage = await loadData<AppUsage[]>(STORAGE_KEYS.APP_USAGE, mockAppUsage);
        setAppUsage(storedAppUsage);
        
        // Load user challenges data
        const storedUserChallenges = await loadData<UserChallenge[]>(STORAGE_KEYS.USER_CHALLENGES, mockUserChallenges);
        setUserChallenges(storedUserChallenges);
        
        // Load user profile data
        const storedUserProfile = await loadData<UserProfile>(STORAGE_KEYS.USER_PROFILE, mockUserProfile);
        setUserProfile(storedUserProfile);
        
        // Load rewards data
        const storedRewards = await loadData<Reward[]>(STORAGE_KEYS.REWARDS, mockRewards);
        setRewards(storedRewards);
      } catch (error) {
        console.error('Error loading data from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStoredData();
  }, []);
  
  // Save app usage data whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveData(STORAGE_KEYS.APP_USAGE, appUsage);
    }
  }, [appUsage, isLoading]);
  
  // Save user challenges data whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveData(STORAGE_KEYS.USER_CHALLENGES, userChallenges);
    }
  }, [userChallenges, isLoading]);
  
  // Save user profile data whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveData(STORAGE_KEYS.USER_PROFILE, userProfile);
    }
  }, [userProfile, isLoading]);
  
  // Save rewards data whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveData(STORAGE_KEYS.REWARDS, rewards);
    }
  }, [rewards, isLoading]);
  
  // Get a specific app's data by ID
  const getAppById = (id: string): AppUsage | undefined => {
    return appUsage.find(app => app.id === id);
  };
  
  // Get a challenge by ID
  const getChallengeById = (id: string): Challenge | undefined => {
    return challenges.find(challenge => challenge.id === id);
  };
  
  // Get user challenge by challenge ID
  const getUserChallengeByChallenge = (challengeId: string): UserChallenge | undefined => {
    return userChallenges.find(userChallenge => userChallenge.challengeId === challengeId);
  };
  
  // Get active challenges (not joined by user)
  const getActiveChallenges = (): Challenge[] => {
    const now = new Date().toISOString();
    const joinedChallengeIds = userChallenges.map(uc => uc.challengeId);
    
    return challenges.filter(challenge => 
      challenge.startDate <= now && 
      challenge.endDate >= now && 
      !joinedChallengeIds.includes(challenge.id)
    );
  };
  
  // Get user's active challenges
  const getUserActiveChallenges = (): Array<{ challenge: Challenge; userChallenge: UserChallenge }> => {
    return userChallenges
      .filter(uc => uc.status === 'active')
      .map(userChallenge => {
        const challenge = getChallengeById(userChallenge.challengeId);
        return { challenge: challenge!, userChallenge };
      })
      .filter(item => item.challenge !== undefined);
  };
  
  // Get user's completed challenges
  const getUserCompletedChallenges = (): Array<{ challenge: Challenge; userChallenge: UserChallenge }> => {
    return userChallenges
      .filter(uc => uc.status === 'completed')
      .map(userChallenge => {
        const challenge = getChallengeById(userChallenge.challengeId);
        return { challenge: challenge!, userChallenge };
      })
      .filter(item => item.challenge !== undefined);
  };
  
  // Join a challenge
  const joinChallenge = (challengeId: string) => {
    const challenge = getChallengeById(challengeId);
    if (!challenge) return;
    
    // Calculate end date based on challenge duration
    const joinedDate = new Date();
    const endDate = new Date(joinedDate);
    endDate.setDate(endDate.getDate() + challenge.duration);
    
    // Format dates properly
    const joinedDateISO = joinedDate.toISOString();
    const endDateISO = endDate.toISOString();
    
    // Always create a new user challenge
    const newUserChallenge: UserChallenge = {
      id: `uc-${Date.now()}`, // Generate a unique ID with timestamp to ensure uniqueness
      challengeId,
      status: 'active',
      joinedDate: joinedDateISO,
      endDate: endDateISO,
      currentUsage: 0,
      completed: false
    };
    
    // Add the new challenge to the list
    setUserChallenges(prev => [...prev, newUserChallenge]);
  };
  
  // Check if a challenge has ended (duration has passed)
  const hasChallengeEnded = (userChallenge: UserChallenge): boolean => {
    const now = new Date();
    const endDate = new Date(userChallenge.endDate);
    return now >= endDate;
  };
  
  // Check if a challenge was successful (usage is under target)
  const isChallengeSuccessful = (userChallenge: UserChallenge, challenge: Challenge): boolean => {
    return userChallenge.currentUsage <= challenge.targetMinutes;
  };
  
  // Check if a challenge can be claimed (has ended and is successful)
  const canClaimChallenge = (userChallengeId: string): boolean => {
    const userChallenge = userChallenges.find(uc => uc.id === userChallengeId);
    if (!userChallenge || userChallenge.completed) return false;
    
    const challenge = getChallengeById(userChallenge.challengeId);
    if (!challenge) return false;
    
    return hasChallengeEnded(userChallenge) && isChallengeSuccessful(userChallenge, challenge);
  };
  
  // Update challenge status based on time and usage
  const updateChallengeStatus = () => {
    const now = new Date().toISOString();
    
    setUserChallenges(prev => 
      prev.map(userChallenge => {
        // Skip if already completed or failed
        if (userChallenge.status !== 'active') return userChallenge;
        
        const challenge = getChallengeById(userChallenge.challengeId);
        if (!challenge) return userChallenge;
        
        // If challenge has ended
        if (hasChallengeEnded(userChallenge)) {
          // If usage is under target, mark as completed
          if (isChallengeSuccessful(userChallenge, challenge)) {
            return { ...userChallenge, status: 'completed' };
          } else {
            // Otherwise mark as failed
            return { ...userChallenge, status: 'failed' };
          }
        }
        
        return userChallenge;
      })
    );
  };
  
  // Update challenge progress
  const updateChallengeProgress = (userChallengeId: string, usage: number) => {
    setUserChallenges(prev => 
      prev.map(uc => 
        uc.id === userChallengeId 
          ? { ...uc, currentUsage: uc.currentUsage + usage } 
          : uc
      )
    );
  };
  
  // Complete a challenge and claim reward
  const completeChallenge = (userChallengeId: string) => {
    const userChallenge = userChallenges.find(uc => uc.id === userChallengeId);
    if (!userChallenge) return;
    
    const challenge = getChallengeById(userChallenge.challengeId);
    if (!challenge) return;
    
    // Only allow completion if challenge can be claimed
    if (!canClaimChallenge(userChallengeId)) return;
    
    // Update user challenge status
    setUserChallenges(prev => 
      prev.map(uc => 
        uc.id === userChallengeId 
          ? { ...uc, status: 'completed', completed: true } 
          : uc
      )
    );
    
    // Award points
    addPoints(challenge.reward.points);
    
    // Unlock badge reward if applicable
    if (challenge.reward.badge) {
      const badgeReward = rewards.find(r => r.description.includes(challenge.reward.badge!));
      if (badgeReward) {
        unlockReward(badgeReward.id);
      }
    }
    
    // Update total saved time
    if (userChallenge.currentUsage < challenge.targetMinutes) {
      updateTotalSavedTime(challenge.targetMinutes - userChallenge.currentUsage);
    }
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
  
  // Get all apps by category
  const getAppsByCategory = (category: AppUsage['category']) => {
    return appUsage.filter(app => app.category === category);
  };
  
  // Update app usage data
  const updateAppUsage = (appId: string, day: keyof AppUsage['usage'], minutes: number) => {
    setAppUsage(prevUsage => 
      prevUsage.map(app => 
        app.id === appId 
          ? { ...app, usage: { ...app.usage, [day]: minutes } } 
          : app
      )
    );
  };
  
  // Update app weekly goal
  const updateAppWeeklyGoal = (appId: string, goal: number) => {
    setAppUsage(prevUsage => 
      prevUsage.map(app => 
        app.id === appId 
          ? { ...app, weeklyGoal: goal } 
          : app
      )
    );
  };
  
  // Get most used apps with local data
  const getMostUsedApps = () => {
    return [...appUsage].sort(
      (a, b) => getWeeklyUsage(b) - getWeeklyUsage(a)
    );
  };
  
  // Get apps over their weekly goal with local data
  const getOverGoalApps = () => {
    return appUsage.filter(app => isOverWeeklyGoal(app));
  };
  
  // Reset all stored data to defaults
  const resetAllData = async () => {
    setAppUsage(mockAppUsage);
    setUserChallenges(mockUserChallenges);
    setRewards(mockRewards);
    setUserProfile(mockUserProfile);
  };
  
  return {
    appUsage,
    challenges,
    userChallenges,
    rewards,
    userProfile,
    isLoading,
    getAppById,
    getChallengeById,
    getUserChallengeByChallenge,
    getActiveChallenges,
    getUserActiveChallenges,
    getUserCompletedChallenges,
    joinChallenge,
    updateChallengeProgress,
    completeChallenge,
    getAppsByCategory,
    getUnlockedRewards,
    getLockedRewards,
    unlockReward,
    addPoints,
    incrementStreakDays,
    resetStreakDays,
    updateTotalSavedTime,
    updateAppUsage,
    updateAppWeeklyGoal,
    resetAllData,
    hasChallengeEnded,
    isChallengeSuccessful,
    canClaimChallenge,
    updateChallengeStatus,
    // Helper functions
    getWeeklyUsage,
    isOverWeeklyGoal,
    getGoalPercentage,
    getMostUsedApps,
    getOverGoalApps
  };
};
