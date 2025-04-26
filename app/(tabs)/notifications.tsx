import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  icon: string;
  enabled: boolean;
}

export default function NotificationsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  // Mock notification settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: '1',
      title: 'Daily Reminders',
      description: 'Get daily reminders about your app usage goals',
      icon: 'time-outline',
      enabled: true,
    },
    {
      id: '2',
      title: 'Goal Alerts',
      description: 'Receive alerts when you\'re approaching your app usage limits',
      icon: 'alert-circle-outline',
      enabled: true,
    },
    {
      id: '3',
      title: 'Achievement Notifications',
      description: 'Get notified when you earn rewards or reach milestones',
      icon: 'trophy-outline',
      enabled: true,
    },
    {
      id: '4',
      title: 'Weekly Reports',
      description: 'Receive weekly summaries of your app usage and progress',
      icon: 'bar-chart-outline',
      enabled: false,
    },
    {
      id: '5',
      title: 'Tips & Advice',
      description: 'Get helpful tips on reducing screen time and digital addiction',
      icon: 'bulb-outline',
      enabled: false,
    },
  ]);
  
  // Mock recent notifications
  const recentNotifications = [
    {
      id: '1',
      title: 'Goal Achieved!',
      message: 'You stayed under your Instagram usage goal today. Keep it up!',
      time: '2 hours ago',
      icon: 'checkmark-circle',
      color: '#4CAF50',
      read: false,
    },
    {
      id: '2',
      title: 'New Reward Unlocked',
      message: 'You\'ve unlocked the "Digital Detox Beginner" badge!',
      time: 'Yesterday',
      icon: 'trophy',
      color: '#FFD700',
      read: true,
    },
    {
      id: '3',
      title: 'Warning: Approaching Limit',
      message: 'You\'re close to your daily YouTube limit. Consider taking a break.',
      time: 'Yesterday',
      icon: 'alert-circle',
      color: '#FF6B6B',
      read: true,
    },
    {
      id: '4',
      title: 'Weekly Report Available',
      message: 'Your screen time report for last week is now available.',
      time: '3 days ago',
      icon: 'document-text',
      color: '#2196F3',
      read: true,
    },
  ];
  
  const toggleNotification = (id: string) => {
    setNotificationSettings(prevSettings =>
      prevSettings.map(setting =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <Text style={[styles.title, { color: colors.text }]}>Notifications</Text>
      
      {/* Notification Settings */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>
        
        {notificationSettings.map(setting => (
          <View 
            key={setting.id} 
            style={[styles.settingItem, { backgroundColor: colors.background }]}
          >
            <View style={[styles.iconContainer, { backgroundColor: colors.tint }]}>
              <Ionicons name={setting.icon as any} size={20} color="#FFFFFF" />
            </View>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                {setting.title}
              </Text>
              <Text style={[styles.settingDescription, { color: colors.icon }]}>
                {setting.description}
              </Text>
            </View>
            <Switch
              value={setting.enabled}
              onValueChange={() => toggleNotification(setting.id)}
              trackColor={{ false: '#767577', true: colors.tint }}
              thumbColor="#FFFFFF"
            />
          </View>
        ))}
      </View>
      
      {/* Recent Notifications */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent</Text>
          <TouchableOpacity>
            <Text style={[styles.clearAllText, { color: colors.tint }]}>Clear All</Text>
          </TouchableOpacity>
        </View>
        
        {recentNotifications.map(notification => (
          <TouchableOpacity 
            key={notification.id}
            style={[
              styles.notificationItem, 
              { 
                backgroundColor: notification.read ? colors.background : `${colors.background}DD`,
                borderLeftColor: notification.color,
              }
            ]}
            activeOpacity={0.7}
          >
            <View style={[styles.notificationIconContainer, { backgroundColor: notification.color }]}>
              <Ionicons name={notification.icon as any} size={20} color="#FFFFFF" />
            </View>
            <View style={styles.notificationInfo}>
              <View style={styles.notificationHeader}>
                <Text style={[styles.notificationTitle, { color: colors.text }]}>
                  {notification.title}
                </Text>
                <Text style={[styles.notificationTime, { color: colors.icon }]}>
                  {notification.time}
                </Text>
              </View>
              <Text style={[styles.notificationMessage, { color: colors.icon }]}>
                {notification.message}
              </Text>
            </View>
            {!notification.read && (
              <View style={styles.unreadIndicator} />
            )}
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Do Not Disturb */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Do Not Disturb</Text>
        
        <View style={[styles.dndCard, { backgroundColor: colors.background }]}>
          <View style={styles.dndHeader}>
            <View style={[styles.iconContainer, { backgroundColor: '#9C27B0' }]}>
              <Ionicons name="moon-outline" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.dndInfo}>
              <Text style={[styles.dndTitle, { color: colors.text }]}>
                Quiet Hours
              </Text>
              <Text style={[styles.dndDescription, { color: colors.icon }]}>
                No notifications during these hours
              </Text>
            </View>
            <Switch
              value={false}
              onValueChange={() => {}}
              trackColor={{ false: '#767577', true: '#9C27B0' }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <View style={styles.timeSelector}>
            <View style={styles.timeItem}>
              <Text style={[styles.timeLabel, { color: colors.icon }]}>From</Text>
              <TouchableOpacity style={[styles.timeButton, { backgroundColor: colors.tint + '20' }]}>
                <Text style={[styles.timeText, { color: colors.text }]}>10:00 PM</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.timeItem}>
              <Text style={[styles.timeLabel, { color: colors.icon }]}>To</Text>
              <TouchableOpacity style={[styles.timeButton, { backgroundColor: colors.tint + '20' }]}>
                <Text style={[styles.timeText, { color: colors.text }]}>7:00 AM</Text>
              </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  clearAllText: {
    fontSize: 14,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  notificationTime: {
    fontSize: 12,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
    position: 'absolute',
    top: 16,
    right: 16,
  },
  dndCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dndHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dndInfo: {
    flex: 1,
  },
  dndTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  dndDescription: {
    fontSize: 14,
  },
  timeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeItem: {
    flex: 1,
    marginHorizontal: 8,
  },
  timeLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  timeButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
