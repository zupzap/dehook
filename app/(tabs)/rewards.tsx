import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppUsage } from '@/hooks/useAppUsage';
import { Reward } from '@/data/mockData';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function RewardsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const { 
    rewards, 
    userProfile,
    getUnlockedRewards,
    getLockedRewards
  } = useAppUsage();
  
  const unlockedRewards = getUnlockedRewards();
  const lockedRewards = getLockedRewards();
  
  const renderRewardItem = (reward: Reward, isLocked: boolean) => {
    const formattedDate = reward.dateUnlocked 
      ? new Date(reward.dateUnlocked).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }) 
      : '';
    
    return (
      <TouchableOpacity 
        key={reward.id}
        style={[
          styles.rewardCard, 
          { 
            backgroundColor: colors.background,
            opacity: isLocked ? 0.7 : 1
          }
        ]}
        activeOpacity={0.7}
        disabled={isLocked}
      >
        <View style={styles.rewardHeader}>
          <View style={[
            styles.rewardIconContainer, 
            { backgroundColor: isLocked ? '#9E9E9E' : '#FFD700' }
          ]}>
            <Ionicons name={reward.icon as any} size={24} color="#FFFFFF" />
          </View>
          <View style={styles.rewardInfo}>
            <Text style={[styles.rewardTitle, { color: colors.text }]}>
              {reward.title}
            </Text>
            <Text style={[styles.rewardDescription, { color: colors.icon }]}>
              {reward.description}
            </Text>
          </View>
        </View>
        
        <View style={styles.rewardFooter}>
          {isLocked ? (
            <View style={styles.pointsContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={[styles.pointsText, { color: colors.text }]}>
                {reward.requiredPoints} points required
              </Text>
            </View>
          ) : (
            <View style={styles.unlockedContainer}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={[styles.unlockedText, { color: '#4CAF50' }]}>
                Unlocked on {formattedDate}
              </Text>
            </View>
          )}
        </View>
        
        {isLocked && (
          <View style={styles.lockOverlay}>
            <Ionicons name="lock-closed" size={20} color="#FFFFFF" />
          </View>
        )}
      </TouchableOpacity>
    );
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={[styles.title, { color: colors.text }]}>Your Rewards</Text>
        
        <View style={[styles.pointsCard, { backgroundColor: colors.background }]}>
          <View style={styles.pointsInfo}>
            <Text style={[styles.pointsValue, { color: colors.text }]}>
              {userProfile.points}
            </Text>
            <Text style={[styles.pointsLabel, { color: colors.icon }]}>
              Total Points
            </Text>
          </View>
          <View style={styles.pointsIconContainer}>
            <Ionicons name="star" size={32} color="#FFD700" />
          </View>
        </View>
      </View>
      
      {/* Progress Section */}
      <View style={styles.progressSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Progress</Text>
        
        <View style={[styles.progressCard, { backgroundColor: colors.background }]}>
          <View style={styles.progressItem}>
            <View style={[styles.progressCircle, { borderColor: '#4CAF50' }]}>
              <Text style={[styles.progressValue, { color: colors.text }]}>
                {unlockedRewards.length}
              </Text>
            </View>
            <Text style={[styles.progressLabel, { color: colors.icon }]}>
              Unlocked
            </Text>
          </View>
          
          <View style={styles.progressItem}>
            <View style={[styles.progressCircle, { borderColor: colors.tint }]}>
              <Text style={[styles.progressValue, { color: colors.text }]}>
                {lockedRewards.length}
              </Text>
            </View>
            <Text style={[styles.progressLabel, { color: colors.icon }]}>
              Locked
            </Text>
          </View>
          
          <View style={styles.progressItem}>
            <View style={[styles.progressCircle, { borderColor: '#FF6B6B' }]}>
              <Text style={[styles.progressValue, { color: colors.text }]}>
                {Math.floor(userProfile.totalSavedTime / 60)}h
              </Text>
            </View>
            <Text style={[styles.progressLabel, { color: colors.icon }]}>
              Time Saved
            </Text>
          </View>
        </View>
      </View>
      
      {/* Unlocked Rewards Section */}
      {unlockedRewards.length > 0 && (
        <View style={styles.rewardsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Unlocked Rewards</Text>
          
          {unlockedRewards.map(reward => renderRewardItem(reward, false))}
        </View>
      )}
      
      {/* Locked Rewards Section */}
      {lockedRewards.length > 0 && (
        <View style={styles.rewardsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Locked Rewards</Text>
          
          {lockedRewards.map(reward => renderRewardItem(reward, true))}
        </View>
      )}
      
      {/* How to Earn Points Section */}
      <View style={styles.rewardsSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>How to Earn Points</Text>
        
        <View style={[styles.infoCard, { backgroundColor: colors.background }]}>
          <View style={styles.infoItem}>
            <View style={[styles.infoIconContainer, { backgroundColor: '#4CAF50' }]}>
              <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>
                Meet Daily Goals
              </Text>
              <Text style={[styles.infoDescription, { color: colors.icon }]}>
                +10 points for each app under its daily limit
              </Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <View style={[styles.infoIconContainer, { backgroundColor: '#FF6B6B' }]}>
              <Ionicons name="trending-down" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>
                Reduce Usage
              </Text>
              <Text style={[styles.infoDescription, { color: colors.icon }]}>
                +5 points for each 30 minutes saved below your goal
              </Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <View style={[styles.infoIconContainer, { backgroundColor: '#FFD700' }]}>
              <Ionicons name="flame" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>
                Maintain Streaks
              </Text>
              <Text style={[styles.infoDescription, { color: colors.icon }]}>
                +20 points for each 7-day streak of meeting all goals
              </Text>
            </View>
          </View>
        </View>
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
  headerSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  pointsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pointsInfo: {
    flex: 1,
  },
  pointsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  pointsLabel: {
    fontSize: 14,
  },
  pointsIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  progressCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressItem: {
    alignItems: 'center',
  },
  progressCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressLabel: {
    fontSize: 14,
  },
  rewardsSection: {
    marginBottom: 24,
  },
  rewardCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  rewardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  rewardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  rewardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  rewardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 14,
    marginLeft: 4,
  },
  unlockedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unlockedText: {
    fontSize: 14,
    marginLeft: 4,
  },
  lockOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});
