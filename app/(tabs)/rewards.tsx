import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppUsage } from '@/hooks/useAppUsage';
import { Reward } from '@/data/mockData';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

// Define brand colors for rewards
const BRAND_COLORS = {
  'social': '#E1306C', // Instagram color
  'entertainment': '#FF0000', // YouTube color
  'gaming': '#5865F2', // Gaming color
  'productivity': '#0A84FF', // Productivity blue
  'shopping': '#FF9900', // Amazon color
  'travel': '#00256A', // Travel blue
  'food': '#FF5A5F', // Food red
  'fitness': '#34C759', // Fitness green
};

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
  
  // Render a reward card in the new grid layout
  const renderRewardCard = ({ item }: { item: Reward }) => {
    const isLocked = !item.unlocked;
    const brandColor = BRAND_COLORS[item.category as keyof typeof BRAND_COLORS] || colors.tint;
    
    // Format the cashback/discount text
    const formatRewardValue = (reward: Reward) => {
      if (reward.cashbackPercent) {
        return `${reward.cashbackPercent}% Cashback`;
      } else if (reward.discountAmount) {
        return `Flat ₹${reward.discountAmount} Off`;
      } else {
        return `${reward.requiredPoints} Points`;
      }
    };
    
    return (
      <TouchableOpacity 
        style={[
          styles.rewardCard, 
          { 
            backgroundColor: colors.background,
            opacity: isLocked ? 0.7 : 1,
            borderColor: isLocked ? '#E0E0E0' : brandColor,
          }
        ]}
        activeOpacity={0.7}
        disabled={isLocked}
      >
        {/* Sale badge if applicable */}
        {item.isSale && (
          <View style={[styles.saleBadge, { backgroundColor: '#FF3B30' }]}>
            <Text style={styles.saleText}>Sale Live Now</Text>
          </View>
        )}
        
        {/* Brand logo */}
        <View style={styles.brandContainer}>
          <View style={[styles.brandLogo, { backgroundColor: '#F8F8F8' }]}>
            <Ionicons name={item.icon as any} size={32} color={brandColor} />
          </View>
        </View>
        
        {/* Reward details */}
        <View style={styles.rewardDetails}>
          <Text style={[styles.brandName, { color: colors.text }]}>
            {item.title}
          </Text>
          
          <TouchableOpacity style={styles.termsButton}>
            <Text style={[styles.termsText, { color: colors.tint }]}>
              {isLocked ? 'Locked' : 'Cashback Rates & Terms'}
            </Text>
          </TouchableOpacity>
          
          <View style={[styles.cashbackButton, { backgroundColor: isLocked ? '#E0E0E0' : brandColor }]}>
            <Text style={styles.cashbackText}>
              {formatRewardValue(item)}
            </Text>
          </View>
        </View>
        
        {/* Lock overlay for locked rewards */}
        {isLocked && (
          <View style={styles.lockOverlay}>
            <View style={styles.lockIconContainer}>
              <Ionicons name="lock-closed" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.lockText}>
              Complete challenges to unlock
            </Text>
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
      
      {/* Unlocked Rewards Section - Grid Layout */}
      {unlockedRewards.length > 0 && (
        <View style={styles.rewardsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Available Rewards</Text>
          
          <FlatList
            data={unlockedRewards}
            renderItem={renderRewardCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.rewardRow}
            scrollEnabled={false}
          />
        </View>
      )}
      
      {/* Locked Rewards Section - Grid Layout */}
      {lockedRewards.length > 0 && (
        <View style={styles.rewardsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Locked Rewards</Text>
          
          <FlatList
            data={lockedRewards}
            renderItem={renderRewardCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.rewardRow}
            scrollEnabled={false}
          />
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
          
          <View style={styles.infoItem}>
            <View style={[styles.infoIconContainer, { backgroundColor: '#0A84FF' }]}>
              <Ionicons name="trophy" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>
                Complete Challenges
              </Text>
              <Text style={[styles.infoDescription, { color: colors.icon }]}>
                +50-500 points for completing challenges based on difficulty
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
    paddingBottom: 32,
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
  rewardRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  rewardCard: {
    width: '48%',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    position: 'relative',
    overflow: 'hidden',
  },
  saleBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 4,
    zIndex: 1,
    alignItems: 'center',
  },
  saleText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  brandLogo: {
    width: 60,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  rewardDetails: {
    alignItems: 'center',
  },
  brandName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  termsButton: {
    marginBottom: 8,
  },
  termsText: {
    fontSize: 10,
    textDecorationLine: 'underline',
  },
  cashbackButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    width: '100%',
    alignItems: 'center',
  },
  cashbackText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  lockIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  lockText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 8,
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
