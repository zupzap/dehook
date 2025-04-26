import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { useAppUsage } from '@/hooks/useAppUsage';
import { AppUsage, Challenge, UserChallenge } from '@/data/mockData';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function GoalsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const { 
    appUsage, 
    challenges,
    getAppById, 
    getWeeklyUsage, 
    getActiveChallenges,
    getUserActiveChallenges,
    getUserCompletedChallenges,
    joinChallenge,
    completeChallenge,
    hasChallengeEnded,
    isChallengeSuccessful,
    canClaimChallenge,
    updateChallengeStatus
  } = useAppUsage();
  
  // Update challenge statuses on component mount and when dependencies change
  useEffect(() => {
    updateChallengeStatus();
  }, []);
  
  // Get active challenges
  const activeChallenges = getActiveChallenges();
  
  // Get user's active challenges
  const userActiveChallenges = getUserActiveChallenges();
  
  // Get user's completed challenges
  const userCompletedChallenges = getUserCompletedChallenges();
  
  const renderChallengeItem = ({ item }: { item: Challenge }) => {
    const app = getAppById(item.appId);
    if (!app) return null;
    
    return (
      <TouchableOpacity 
        style={[styles.challengeItem, { backgroundColor: colors.background }]}
        activeOpacity={0.7}
        onPress={() => joinChallenge(item.id)}
      >
        <View style={styles.challengeHeader}>
          <View style={[styles.appIconContainer, { backgroundColor: app.color }]}>
            <Ionicons name={app.icon as any} size={24} color="#FFFFFF" />
          </View>
          <View style={styles.challengeInfo}>
            <Text style={[styles.challengeTitle, { color: colors.text, fontWeight: '700' }]}>
              {item.title}
            </Text>
            <Text style={[styles.challengeDescription, { color: colors.icon, fontWeight: '500' }]}>
              {item.description}
            </Text>
          </View>
          <View style={[styles.difficultyBadge, { 
            backgroundColor: 
              item.difficulty === 'easy' ? '#34C759' : 
              item.difficulty === 'medium' ? '#FF9500' : '#FF3B30' 
          }]}>
            <Text style={[styles.difficultyText, { fontWeight: '600' }]}>
              {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
            </Text>
          </View>
        </View>
        
        <View style={styles.challengeDetails}>
          <View style={styles.challengeDetail}>
            <Ionicons name="time-outline" size={16} color={colors.icon} />
            <Text style={[styles.detailText, { color: colors.text }]}>
              {item.duration} days
            </Text>
          </View>
          
          <View style={styles.challengeDetail}>
            <Ionicons name="people-outline" size={16} color={colors.icon} />
            <Text style={[styles.detailText, { color: colors.text }]}>
              {item.participants} joined
            </Text>
          </View>
          
          <View style={styles.challengeDetail}>
            <Ionicons name="star-outline" size={16} color={colors.icon} />
            <Text style={[styles.detailText, { color: colors.text }]}>
              {item.reward.points} points
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.joinButton, { backgroundColor: colors.tint }]}
          onPress={() => joinChallenge(item.id)}
        >
          <Text style={styles.joinButtonText}>Join Challenge</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };
  
  const renderUserChallengeItem = ({ item }: { item: { challenge: Challenge; userChallenge: UserChallenge } }) => {
    const { challenge, userChallenge } = item;
    const app = getAppById(challenge.appId);
    if (!app) return null;
    
    // Calculate remaining minutes and percentage
    const remainingMinutes = Math.max(0, challenge.targetMinutes - userChallenge.currentUsage);
    const remainingPercentage = Math.min(100, Math.round((remainingMinutes / challenge.targetMinutes) * 100));
    const isAlmostDepleted = remainingPercentage <= 20;
    
    // Calculate time left until challenge ends
    const now = new Date();
    const endDate = new Date(userChallenge.endDate);
    
    // Format the end date for display
    const formatDate = (date: Date): string => {
      try {
        if (isNaN(date.getTime())) {
          return 'Invalid Date';
        }
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      } catch (error) {
        return 'Invalid Date';
      }
    };
    
    const formattedEndDate = formatDate(endDate);
    
    // Calculate time remaining
    const timeLeftMs = !isNaN(endDate.getTime()) ? Math.max(0, endDate.getTime() - now.getTime()) : 0;
    const daysLeft = Math.floor(timeLeftMs / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((timeLeftMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    // Check if challenge has ended
    const hasEnded = hasChallengeEnded(userChallenge);
    const isSuccessful = isChallengeSuccessful(userChallenge, challenge);
    const canClaim = canClaimChallenge(userChallenge.id);
    
    // Determine challenge status text and color
    let statusText = '';
    let statusColor = '';
    
    if (hasEnded) {
      if (isSuccessful) {
        statusText = 'Challenge Completed!';
        statusColor = '#34C759';
      } else {
        statusText = 'Challenge Failed';
        statusColor = '#FF3B30';
      }
    } else if (isNaN(endDate.getTime())) {
      statusText = 'Invalid Date';
      statusColor = '#FF9500';
    } else {
      statusText = `${daysLeft}d ${hoursLeft}h left`;
      statusColor = colors.text;
    }
    
    return (
      <TouchableOpacity 
        style={[styles.userChallengeItem, { backgroundColor: colors.background }]}
        activeOpacity={0.7}
      >
        <View style={styles.challengeHeader}>
          <View style={[styles.appIconContainer, { backgroundColor: app.color }]}>
            <Ionicons name={app.icon as any} size={24} color="#FFFFFF" />
          </View>
          <View style={styles.challengeInfo}>
            <Text style={[styles.challengeTitle, { color: colors.text, fontWeight: '700' }]}>
              {challenge.title}
            </Text>
            <Text style={[styles.challengeDescription, { color: colors.icon, fontWeight: '500' }]}>
              {challenge.description}
            </Text>
          </View>
        </View>
        
        <View style={styles.progressSection}>
          <View style={styles.progressLabelContainer}>
            <Text style={[styles.progressLabel, { color: colors.text, fontWeight: '600' }]}>
              Remaining: {remainingPercentage}%
            </Text>
            <Text style={[styles.progressMinutes, { color: colors.icon, fontWeight: '500' }]}>
              {remainingMinutes} / {challenge.targetMinutes} minutes left
            </Text>
          </View>
          
          <View style={styles.progressContainer}>
            <View 
              style={[
                styles.progressBar, 
                { 
                  width: `${remainingPercentage}%`,
                  backgroundColor: isAlmostDepleted ? '#FF3B30' : '#34C759'
                }
              ]} 
            />
          </View>
        </View>
        
        <View style={styles.challengeDetails}>
          <View style={styles.challengeDetail}>
            <Ionicons name="time-outline" size={16} color={colors.icon} />
            <Text style={[styles.detailText, { color: statusColor, fontWeight: '600' }]}>
              {statusText}
            </Text>
          </View>
          
          <View style={styles.challengeDetail}>
            <Ionicons name="calendar-outline" size={16} color={colors.icon} />
            <Text style={[styles.detailText, { color: colors.text }]}>
              Ends: {formattedEndDate}
            </Text>
          </View>
        </View>
        
        {canClaim && (
          <TouchableOpacity 
            style={[styles.completeButton, { backgroundColor: '#34C759' }]}
            onPress={() => completeChallenge(userChallenge.id)}
          >
            <Text style={styles.completeButtonText}>Complete & Claim Reward</Text>
          </TouchableOpacity>
        )}
        
        {hasEnded && !isSuccessful && (
          <View style={[styles.failedBanner, { backgroundColor: 'rgba(255, 59, 48, 0.1)' }]}>
            <Ionicons name="close-circle" size={20} color="#FF3B30" />
            <Text style={[styles.failedText, { color: '#FF3B30' }]}>
              Challenge failed - Used too much time
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };
  
  const renderCompletedChallengeItem = ({ item }: { item: { challenge: Challenge; userChallenge: UserChallenge } }) => {
    const { challenge, userChallenge } = item;
    const app = getAppById(challenge.appId);
    if (!app) return null;
    
    // Format dates for display
    const formatDate = (date: Date): string => {
      try {
        if (isNaN(date.getTime())) {
          return 'Invalid Date';
        }
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      } catch (error) {
        return 'Invalid Date';
      }
    };
    
    const completedDate = formatDate(new Date(userChallenge.joinedDate));
    
    return (
      <View style={[styles.completedChallengeItem, { backgroundColor: colors.background }]}>
        <View style={styles.challengeHeader}>
          <View style={[styles.appIconContainer, { backgroundColor: app.color }]}>
            <Ionicons name={app.icon as any} size={24} color="#FFFFFF" />
          </View>
          <View style={styles.challengeInfo}>
            <Text style={[styles.challengeTitle, { color: colors.text, fontWeight: '700' }]}>
              {challenge.title}
            </Text>
            <Text style={[styles.challengeDescription, { color: colors.icon, fontWeight: '500' }]}>
              {challenge.description}
            </Text>
          </View>
          <View style={styles.completedBadge}>
            <Ionicons name="checkmark-circle" size={24} color="#34C759" />
          </View>
        </View>
        
        <View style={styles.rewardInfo}>
          <Ionicons name="trophy" size={20} color="#FFD700" />
          <Text style={[styles.rewardText, { color: colors.text, fontWeight: '500' }]}>
            Earned {challenge.reward.points} points
            {challenge.reward.badge ? ` + "${challenge.reward.badge}" badge` : ''}
          </Text>
        </View>
        
        <View style={styles.completionDate}>
          <Text style={[styles.completionDateText, { color: colors.icon }]}>
            Completed on {completedDate}
          </Text>
        </View>
      </View>
    );
  };
  
  const renderCategorySection = (category: AppUsage['category']) => {
    const categoryApps = appUsage.filter(app => app.category === category);
    
    if (categoryApps.length === 0) return null;
    
    return (
      <View style={styles.categorySection}>
        <Text style={[styles.categoryTitle, { color: colors.text }]}>
          {category.charAt(0).toUpperCase() + category.slice(1)} Apps
        </Text>
        
        {categoryApps.map(app => {
          const weeklyUsage = getWeeklyUsage(app);
          
          return (
            <TouchableOpacity 
              key={app.id}
              style={styles.categoryAppItem}
              activeOpacity={0.7}
            >
              <View style={[styles.appIconContainer, { backgroundColor: app.color }]}>
                <Ionicons name={app.icon as any} size={20} color="#FFFFFF" />
              </View>
              <Text style={[styles.categoryAppName, { color: colors.text }]}>{app.name}</Text>
              <Text style={[styles.categoryAppUsage, { color: colors.text }]}>
                {Math.floor(weeklyUsage / 60)}h {weeklyUsage % 60}m
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Challenges</Text>
      </View>
      
      {/* Active User Challenges Section */}
      {userActiveChallenges.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Active Challenges</Text>
          
          <FlatList
            data={userActiveChallenges}
            renderItem={renderUserChallengeItem}
            keyExtractor={(item) => item.userChallenge.id}
            scrollEnabled={false}
          />
        </View>
      )}
      
      {/* Available Challenges Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Available Challenges</Text>
        
        {activeChallenges.length > 0 ? (
          <FlatList
            data={activeChallenges}
            renderItem={renderChallengeItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="trophy-outline" size={48} color={colors.icon} />
            <Text style={[styles.emptyStateText, { color: colors.text }]}>
              No active challenges available
            </Text>
            <Text style={[styles.emptyStateSubtext, { color: colors.icon }]}>
              Check back soon for new challenges
            </Text>
          </View>
        )}
      </View>
      
      {/* Completed Challenges Section */}
      {userCompletedChallenges.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Completed Challenges</Text>
          
          <FlatList
            data={userCompletedChallenges}
            renderItem={renderCompletedChallengeItem}
            keyExtractor={(item) => item.userChallenge.id}
            scrollEnabled={false}
          />
        </View>
      )}
      
      {/* App Categories Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>App Usage</Text>
        
        {renderCategorySection('social')}
        {renderCategorySection('entertainment')}
        {renderCategorySection('gaming')}
        {renderCategorySection('productivity')}
        {renderCategorySection('other')}
      </View>
      
      {/* Tips Section */}
      <View style={[styles.tipsCard, { backgroundColor: colors.background }]}>
        <View style={styles.tipsHeader}>
          <Ionicons name="bulb-outline" size={24} color="#FFD700" />
          <Text style={[styles.tipsTitle, { color: colors.text }]}>Challenge Tips</Text>
        </View>
        <Text style={[styles.tipText, { color: colors.icon }]}>
          • Join challenges that match your current usage patterns
        </Text>
        <Text style={[styles.tipText, { color: colors.icon }]}>
          • Start with easier challenges and work your way up
        </Text>
        <Text style={[styles.tipText, { color: colors.icon }]}>
          • Complete challenges to earn points and unlock rewards
        </Text>
        <Text style={[styles.tipText, { color: colors.icon }]}>
          • Share your progress with friends for extra motivation
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  challengeItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userChallengeItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  completedChallengeItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  appIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  challengeDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  difficultyText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  challengeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  challengeDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    marginLeft: 4,
  },
  joinButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  progressSection: {
    marginBottom: 16,
  },
  progressLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressMinutes: {
    fontSize: 14,
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  completeButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  completedBadge: {
    marginLeft: 8,
  },
  rewardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  completionDate: {
    alignItems: 'flex-end',
  },
  completionDateText: {
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  categorySection: {
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  categoryAppItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categoryAppName: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
  },
  categoryAppUsage: {
    fontSize: 14,
    fontWeight: '500',
  },
  tipsCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 4,
  },
  failedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  failedText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
});
