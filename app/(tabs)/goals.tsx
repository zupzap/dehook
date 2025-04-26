import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppUsage } from '@/hooks/useAppUsage';
import { AppUsage, UserGoal } from '@/data/mockData';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function GoalsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const { 
    appUsage, 
    userGoals, 
    getAppById, 
    getWeeklyUsage, 
    isOverWeeklyGoal, 
    getGoalPercentage 
  } = useAppUsage();
  
  // Get all goals with app data
  const goalsWithAppData = userGoals
    .map(goal => {
      const app = getAppById(goal.appId);
      return { goal, app };
    })
    .filter((item): item is { goal: UserGoal; app: AppUsage } => item.app !== undefined);
  
  const renderGoalItem = ({ item }: { item: { goal: UserGoal; app: AppUsage } }) => {
    const { goal, app } = item;
    const weeklyUsage = getWeeklyUsage(app);
    const isOverGoal = isOverWeeklyGoal(app);
    const goalPercentage = getGoalPercentage(app);
    const remainingMinutes = Math.max(0, goal.targetMinutes - weeklyUsage);
    
    return (
      <TouchableOpacity 
        style={[styles.goalItem, { borderColor: isOverGoal ? '#FF6B6B' : '#4CAF50' }]}
        activeOpacity={0.7}
      >
        <View style={styles.goalHeader}>
          <View style={[styles.appIconContainer, { backgroundColor: app.color }]}>
            <Ionicons name={app.icon as any} size={24} color="#FFFFFF" />
          </View>
          <View style={styles.goalInfo}>
            <Text style={[styles.appName, { color: colors.text }]}>{app.name}</Text>
            <Text style={[styles.goalStatus, { color: isOverGoal ? '#FF6B6B' : '#4CAF50' }]}>
              {isOverGoal ? 'Over Goal' : 'On Track'}
            </Text>
          </View>
          <View style={styles.goalUsageInfo}>
            <Text style={[styles.usageText, { color: isOverGoal ? '#FF6B6B' : '#4CAF50' }]}>
              {Math.floor(weeklyUsage / 60)}h {weeklyUsage % 60}m
            </Text>
            <Text style={[styles.goalText, { color: colors.icon }]}>
              Goal: {Math.floor(goal.targetMinutes / 60)}h {goal.targetMinutes % 60}m
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
        
        <View style={styles.goalDetails}>
          <View style={styles.goalDetail}>
            <Text style={[styles.detailLabel, { color: colors.icon }]}>Remaining</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {isOverGoal ? '0m' : `${Math.floor(remainingMinutes / 60)}h ${remainingMinutes % 60}m`}
            </Text>
          </View>
          
          <View style={styles.goalDetail}>
            <Text style={[styles.detailLabel, { color: colors.icon }]}>Daily Avg</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {Math.floor((weeklyUsage / 7) / 60)}h {Math.round((weeklyUsage / 7) % 60)}m
            </Text>
          </View>
          
          <View style={styles.goalDetail}>
            <Text style={[styles.detailLabel, { color: colors.icon }]}>Status</Text>
            <Text style={[styles.detailValue, { color: goal.completed ? '#4CAF50' : colors.text }]}>
              {goal.completed ? 'Completed' : 'In Progress'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
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
          const isOverGoal = isOverWeeklyGoal(app);
          
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
              <Text style={[styles.categoryAppUsage, { color: isOverGoal ? '#FF6B6B' : '#4CAF50' }]}>
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
        <Text style={[styles.title, { color: colors.text }]}>Your Goals</Text>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.tint }]}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      {/* Active Goals Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Active Goals</Text>
        
        {goalsWithAppData.length > 0 ? (
          <FlatList
            data={goalsWithAppData}
            renderItem={renderGoalItem}
            keyExtractor={(item) => item.goal.id}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="trophy-outline" size={48} color={colors.icon} />
            <Text style={[styles.emptyStateText, { color: colors.text }]}>
              No active goals yet
            </Text>
            <Text style={[styles.emptyStateSubtext, { color: colors.icon }]}>
              Tap the + button to create your first goal
            </Text>
          </View>
        )}
      </View>
      
      {/* App Categories Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>App Categories</Text>
        
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
          <Text style={[styles.tipsTitle, { color: colors.text }]}>Goal Setting Tips</Text>
        </View>
        <Text style={[styles.tipText, { color: colors.icon }]}>
          • Start with small, achievable goals
        </Text>
        <Text style={[styles.tipText, { color: colors.icon }]}>
          • Focus on reducing one app at a time
        </Text>
        <Text style={[styles.tipText, { color: colors.icon }]}>
          • Replace screen time with other activities
        </Text>
        <Text style={[styles.tipText, { color: colors.icon }]}>
          • Celebrate your progress, no matter how small
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  goalItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    backgroundColor: 'white',
  },
  goalHeader: {
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
  goalInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  goalStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  goalUsageInfo: {
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
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
  },
  goalDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalDetail: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
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
});
