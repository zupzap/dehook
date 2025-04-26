import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { ExternalLink } from '@/components/ExternalLink';
import { useAppUsage } from '@/hooks/useAppUsage';
import { clearAllData } from '@/utils/storage';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { resetAllData, isLoading } = useAppUsage();
  
  // Mock settings
  const [settings, setSettings] = useState({
    notifications: true,
    dataSync: false,
    privacyMode: true,
  });
  
  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  // Handle data reset
  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'Are you sure you want to reset all app data? This will delete all your progress, challenges, and settings.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await resetAllData();
              Alert.alert('Success', 'All data has been reset to default values.');
            } catch (error) {
              console.error('Error resetting data:', error);
              Alert.alert('Error', 'Failed to reset data. Please try again.');
            }
          }
        }
      ]
    );
  };
  
  // App info
  const appInfo = {
    version: '1.0.0',
    buildNumber: '1',
    releaseDate: 'April 26, 2025',
  };
  
  // FAQ items
  const faqItems = [
    {
      question: 'How does the app track my usage?',
      answer: 'This app uses mock data for demonstration purposes. In a real implementation, it would use Android\'s UsageStatsManager API to track app usage statistics.'
    },
    {
      question: 'Is my data shared with anyone?',
      answer: 'No, all your usage data is stored locally on your device. We don\'t collect or share any personal information.'
    },
    {
      question: 'How are rewards calculated?',
      answer: 'Rewards are earned by meeting your app usage goals. You earn points for staying under your limits, and these points unlock various achievements and badges.'
    },
    {
      question: 'Can I export my data?',
      answer: 'Currently, this feature is not available in the MVP version but will be added in future updates.'
    },
    {
      question: 'Where is my data stored?',
      answer: 'All your data is stored locally on your device using AsyncStorage. This means your data persists even when you close the app.'
    },
  ];
  
  const renderSettingItem = (
    icon: string, 
    title: string, 
    description: string, 
    settingKey: keyof typeof settings,
    iconColor: string = colors.tint
  ) => (
    <View style={[styles.settingItem, { backgroundColor: colors.background }]}>
      <View style={[styles.iconContainer, { backgroundColor: iconColor }]}>
        <Ionicons name={icon as any} size={20} color="#FFFFFF" />
      </View>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingTitle, { color: colors.text, fontWeight: '600' }]}>
          {title}
        </Text>
        <Text style={[styles.settingDescription, { color: colors.icon, fontWeight: '500' }]}>
          {description}
        </Text>
      </View>
      <Switch
        value={settings[settingKey]}
        onValueChange={() => toggleSetting(settingKey)}
        trackColor={{ false: '#767577', true: iconColor }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      
      {/* App Preferences */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>App Preferences</Text>
        
        {renderSettingItem(
          'notifications-outline', 
          'Notifications', 
          'Enable push notifications', 
          'notifications',
          '#2196F3'
        )}
        
        {renderSettingItem(
          'cloud-upload-outline', 
          'Data Sync', 
          'Sync your data across devices', 
          'dataSync',
          '#4CAF50'
        )}
        
        {renderSettingItem(
          'eye-off-outline', 
          'Privacy Mode', 
          'Hide sensitive information on the dashboard', 
          'privacyMode',
          '#FF6B6B'
        )}
      </View>
      
      {/* Data Management */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Data Management</Text>
        
        <TouchableOpacity 
          style={[styles.menuItem, { backgroundColor: colors.background }]}
          disabled={isLoading}
          onPress={handleResetData}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#FF3B30' }]}>
            <Ionicons name="refresh-outline" size={20} color="#FFFFFF" />
          </View>
          <View style={styles.menuInfo}>
            <Text style={[styles.menuTitle, { color: colors.text }]}>
              Reset All Data
            </Text>
            <Text style={[styles.menuDescription, { color: colors.icon }]}>
              Reset all app data to default values
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.icon} />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.background }]}>
          <View style={[styles.iconContainer, { backgroundColor: '#5856D6' }]}>
            <Ionicons name="download-outline" size={20} color="#FFFFFF" />
          </View>
          <View style={styles.menuInfo}>
            <Text style={[styles.menuTitle, { color: colors.text }]}>
              Export Data
            </Text>
            <Text style={[styles.menuDescription, { color: colors.icon }]}>
              Export your usage data (Coming soon)
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.icon} />
        </TouchableOpacity>
      </View>
      
      {/* Account */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
        
        <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.background }]}>
          <View style={[styles.iconContainer, { backgroundColor: '#FF9800' }]}>
            <Ionicons name="person-outline" size={20} color="#FFFFFF" />
          </View>
          <View style={styles.menuInfo}>
            <Text style={[styles.menuTitle, { color: colors.text }]}>
              Profile
            </Text>
            <Text style={[styles.menuDescription, { color: colors.icon }]}>
              Manage your profile information
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.icon} />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.background }]}>
          <View style={[styles.iconContainer, { backgroundColor: '#E91E63' }]}>
            <Ionicons name="stats-chart-outline" size={20} color="#FFFFFF" />
          </View>
          <View style={styles.menuInfo}>
            <Text style={[styles.menuTitle, { color: colors.text }]}>
              Data & Privacy
            </Text>
            <Text style={[styles.menuDescription, { color: colors.icon }]}>
              Manage your data and privacy settings
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.icon} />
        </TouchableOpacity>
      </View>
      
      {/* FAQ */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>FAQ</Text>
        
        {faqItems.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.faqItem, { backgroundColor: colors.background }]}
          >
            <Text style={[styles.faqQuestion, { color: colors.text }]}>
              {item.question}
            </Text>
            <Text style={[styles.faqAnswer, { color: colors.icon }]}>
              {item.answer}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* About */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
        
        <View style={[styles.aboutCard, { backgroundColor: colors.background }]}>
          <View style={styles.appInfoHeader}>
            <View style={styles.appIconContainer}>
              <Ionicons name="hourglass-outline" size={40} color={colors.tint} />
            </View>
            <View>
              <Text style={[styles.appName, { color: colors.text }]}>
                Digital De-Addiction
              </Text>
              <Text style={[styles.appVersion, { color: colors.icon }]}>
                Version {appInfo.version} ({appInfo.buildNumber})
              </Text>
              <Text style={[styles.appDate, { color: colors.icon }]}>
                Released on {appInfo.releaseDate}
              </Text>
            </View>
          </View>
          
          <View style={styles.aboutLinks}>
            <ExternalLink
              style={[styles.aboutLink, { color: colors.tint }]}
              href="https://example.com/terms"
            >
              Terms of Service
            </ExternalLink>
            <Text style={{ color: colors.icon }}>•</Text>
            <ExternalLink
              style={[styles.aboutLink, { color: colors.tint }]}
              href="https://example.com/privacy"
            >
              Privacy Policy
            </ExternalLink>
            <Text style={{ color: colors.icon }}>•</Text>
            <ExternalLink
              style={[styles.aboutLink, { color: colors.tint }]}
              href="https://example.com/contact"
            >
              Contact Us
            </ExternalLink>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
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
  menuItem: {
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
  menuInfo: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 14,
  },
  faqItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 20,
  },
  aboutCard: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  appIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    marginBottom: 2,
  },
  appDate: {
    fontSize: 14,
  },
  aboutLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  aboutLink: {
    fontSize: 14,
    fontWeight: '500',
  },
});
