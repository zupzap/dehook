import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppUsage } from '@/hooks/useAppUsage';
import { AppUsage } from '@/data/mockData';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const { 
    appUsage, 
    userProfile, 
    getWeeklyUsage, 
    getGoalPercentage, 
    getMostUsedApps, 
    getOverGoalApps,
    isOverWeeklyGoal
  } = useAppUsage();
  
  const mostUsedApps = getMostUsedApps().slice(0, 4); // Top 4 most used apps
  const overGoalApps = getOverGoalApps();
  
  const renderAppUsageItem = ({ item }: { item: AppUsage }) => {
    const weeklyUsage = getWeeklyUsage(item);
    const goalPercentage = getGoalPercentage(item);
    const isOverGoal = isOverWeeklyGoal(item);
    
    return (
      <TouchableOpacity 
        style={[styles.appItem, { borderColor: isOverGoal ? '#FF6B6B' : '#4CAF50' }]}
        activeOpacity={0.7}
      >
        <View style={styles.appHeader}>
          <View style={[styles.appIconContainer, { backgroundColor: item.color }]}>
            <Ionicons name={item.icon as any} size={24} color="#FFFFFF" />
          </View>
          <View style={styles.appInfo}>
            <Text style={[styles.appName, { color: colors.text }]}>{item.name}</Text>
            <Text style={[styles.appCategory, { color: colors.icon }]}>
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </Text>
          </View>
          <View style={styles.appUsageInfo}>
            <Text style={[styles.usageText, { color: isOverGoal ? '#FF6B6B' : '#4CAF50' }]}>
              {Math.floor(weeklyUsage / 60)}h {weeklyUsage % 60}m
            </Text>
            <Text style={[styles.goalText, { color: colors.icon }]}>
              Goal: {Math.floor(item.weeklyGoal / 60)}h {item.weeklyGoal % 60}m
            </Text>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <View 
            style={[
              styles.progressBar, 
              { 
                width: `${goalPercentage}%`,
                backgroundColor: isOverGoal ? '#FF6B6B' : '#4CAF50'
              }
            ]} 
          />
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.welcomeContainer}>
          <Text style={[styles.welcomeText, { color: colors.text }]}>
            Welcome back, {userProfile.name}!
          </Text>
          <Text style={[styles.streakText, { color: colors.icon }]}>
            🔥 {userProfile.streakDays} day streak
          </Text>
        </View>
        
        <View style={[styles.statsCard, { backgroundColor: colors.background }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>{userProfile.points}</Text>
            <Text style={[styles.statLabel, { color: colors.icon }]}>Points</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {Math.floor(userProfile.totalSavedTime / 60)}h {userProfile.totalSavedTime % 60}m
            </Text>
            <Text style={[styles.statLabel, { color: colors.icon }]}>Saved</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>{overGoalApps.length}</Text>
            <Text style={[styles.statLabel, { color: colors.icon }]}>Over Goal</Text>
          </View>
        </View>
      </View>
      
      {/* Most Used Apps Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Most Used Apps</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAllText, { color: colors.tint }]}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={mostUsedApps}
          renderItem={renderAppUsageItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>
      
      {/* Weekly Summary Section */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Weekly Summary</Text>
        
        <View style={[styles.summaryCard, { backgroundColor: colors.background }]}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {appUsage.length - overGoalApps.length}/{appUsage.length}
              </Text>
              <Text style={[styles.summaryLabel, { color: colors.icon }]}>Goals Met</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Ionicons name="time-outline" size={24} color={colors.tint} />
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {Math.floor(userProfile.totalSavedTime / 60)}h {userProfile.totalSavedTime % 60}m
              </Text>
              <Text style={[styles.summaryLabel, { color: colors.icon }]}>Time Saved</Text>
            </View>
          </View>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Ionicons name="trending-down" size={24} color="#FF6B6B" />
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {overGoalApps.length > 0 ? overGoalApps[0].name : 'None'}
              </Text>
              <Text style={[styles.summaryLabel, { color: colors.icon }]}>Most Overused</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Ionicons name="trophy-outline" size={24} color="#FFD700" />
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {userProfile.points}
              </Text>
              <Text style={[styles.summaryLabel, { color: colors.icon }]}>Total Points</Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Quick Actions */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.tint }]}>
            <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
            <Text style={styles.actionText}>New Goal</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}>
            <Ionicons name="trophy-outline" size={24} color="#FFFFFF" />
            <Text style={styles.actionText}>Rewards</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#FF6B6B' }]}>
            <Ionicons name="alert-circle-outline" size={24} color="#FFFFFF" />
            <Text style={styles.actionText}>Over Goal</Text>
          </TouchableOpacity>
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
  welcomeContainer: {
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  streakText: {
    fontSize: 16,
  },
  statsCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
  },
  appItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    backgroundColor: 'white',
  },
  appHeader: {
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
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  appCategory: {
    fontSize: 12,
  },
  appUsageInfo: {
    alignItems: 'flex-end',
  },
  usageText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  goalText: {
    fontSize: 12,
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
  summaryCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  summaryLabel: {
    fontSize: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
