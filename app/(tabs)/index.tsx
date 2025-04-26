import { StyleSheet, Platform, TouchableOpacity, ScrollView, TextInput, View, Alert, FlatList, Switch } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  EventFrequency,
  checkForPermission,
  queryUsageStats,
  queryEvents,
  showUsageAccessSettings,
} from '@brighthustle/react-native-usage-stats-manager';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AppUsageTable } from '@/components/AppUsageTable';
import { useRealAppUsage, AppUsageItem } from '@/hooks/useRealAppUsage';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [usageStats, setUsageStats] = useState<AppUsageItem[]>([]);
  const [filteredStats, setFilteredStats] = useState<AppUsageItem[]>([]);
  const [allApps, setAllApps] = useState<{packageName: string, appName: string, selected: boolean}[]>([]);
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showFiltered, setShowFiltered] = useState(false);
  const [showAppSelection, setShowAppSelection] = useState(false);
  const [showOverview, setShowOverview] = useState(true);
  
  const { 
    fetchUsageStats,
    requestPermission,
    getUniqueApps
  } = useRealAppUsage();

  useEffect(() => {
    async function fetchInitialUsageStats() {
      setLoading(true);
      setError(null);
      try {
        const hasPermission = await checkForPermission();
        setPermission(hasPermission);
        
        if (!hasPermission) {
          // Show the usage access settings page
          showUsageAccessSettings('');
          setError('Usage access permission is required. Please enable it in settings and restart the app.');
          setLoading(false);
          return;
        }
        
        // Get events for the last 7 days
        const end = Date.now();
        const start = end - 7 * 24 * 60 * 60 * 1000;
        
        // Set default date range for filter
        const startDateObj = new Date(start);
        const endDateObj = new Date(end);
        setStartDate(formatDateForInput(startDateObj));
        setEndDate(formatDateForInput(endDateObj));
        
        // Fetch usage stats
        const stats = await fetchUsageStats(start, end);
        setUsageStats(stats);
        
        // Extract unique apps for selection
        const uniqueApps = getUniqueApps();
        setAllApps(uniqueApps);
      } catch (e: any) {
        console.error('Main error:', e);
        setError(e?.message || 'Failed to fetch usage stats');
      } finally {
        setLoading(false);
      }
    }
    
    fetchInitialUsageStats();
  }, []);
  
  // Function to check and request permission
  const checkAndRequestPermission = async () => {
    try {
      const hasPermission = await checkForPermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission Required',
          'This app needs usage access permission to track app usage. Please enable it in the settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Open Settings', 
              onPress: () => {
                showUsageAccessSettings('');
              }
            }
          ]
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Permission check error:', error);
      return false;
    }
  };

  // Function to filter stats based on selected time range and apps
  const filterStats = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end date/time');
      return;
    }
    
    try {
      const startTimestamp = new Date(startDate).getTime();
      const endTimestamp = new Date(endDate).getTime();
      
      if (isNaN(startTimestamp) || isNaN(endTimestamp)) {
        setError('Invalid date format. Please use YYYY-MM-DD HH:MM format');
        return;
      }
      
      if (startTimestamp >= endTimestamp) {
        setError('Start date must be before end date');
        return;
      }
      
      setLoading(true);
      setError(null);
      
      // Get selected app package names
      const selectedPackages = allApps
        .filter(app => app.selected)
        .map(app => app.packageName);
      
      // Fetch stats for the selected time period
      const stats = await fetchUsageStats(startTimestamp, endTimestamp, selectedPackages);
      setFilteredStats(stats);
      setShowFiltered(true);
    } catch (err: any) {
      setError('Error parsing dates: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Toggle app selection
  const toggleAppSelection = (packageName: string) => {
    setAllApps(prevApps => 
      prevApps.map(app => 
        app.packageName === packageName 
          ? { ...app, selected: !app.selected } 
          : app
      )
    );
  };
  
  // Toggle all apps selection
  const toggleAllApps = (selected: boolean) => {
    setAllApps(prevApps => 
      prevApps.map(app => ({ ...app, selected }))
    );
  };
  
  // Format date for display
  const formatDateForInput = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };
  
  // Set default date range (last 24 hours)
  useEffect(() => {
    const end = new Date();
    const start = new Date(end.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
    
    setStartDate(formatDateForInput(start));
    setEndDate(formatDateForInput(end));
  }, []);
  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#f5f5f5', dark: '#1a1a1a' }}
      headerImage={<View style={styles.headerPlaceholder} />}
    >
      {/* Header Section */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">DeHook</ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>Track and manage your app usage</ThemedText>
      </ThemedView>
      
      {/* Permission Warning */}
      {!permission && (
        <ThemedView style={[styles.permissionContainer, { backgroundColor: colors.tint + '20' }]}>
          <View style={styles.permissionIconContainer}>
            <Ionicons name="warning-outline" size={24} color={colors.tint} />
          </View>
          <View style={styles.permissionTextContainer}>
            <ThemedText style={styles.permissionTitle}>Permission Required</ThemedText>
            <ThemedText style={styles.permissionText}>
              This app needs usage access permission to track app usage.
            </ThemedText>
          </View>
          <TouchableOpacity 
            style={[styles.permissionButton, { backgroundColor: colors.tint }]}
            onPress={checkAndRequestPermission}
          >
            <ThemedText style={styles.permissionButtonText}>Grant Access</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}
      
      {/* Overview Section */}
      {showOverview && (
        <ThemedView style={styles.overviewContainer}>
          <View style={styles.overviewHeader}>
            <ThemedText type="subtitle">Usage Overview</ThemedText>
            <TouchableOpacity onPress={() => setShowAppSelection(!showAppSelection)}>
              <ThemedText style={{ color: colors.tint }}>
                {showAppSelection ? 'Hide App Selection' : 'Select Apps'}
              </ThemedText>
            </TouchableOpacity>
          </View>
          
          {/* App Selection Section */}
          {showAppSelection && (
            <ThemedView style={styles.appSelectionWrapper}>
              <ThemedView style={styles.selectAllContainer}>
                <TouchableOpacity 
                  style={[styles.selectAllButton, { backgroundColor: colors.tint + '20' }]} 
                  onPress={() => toggleAllApps(true)}
                >
                  <ThemedText>Select All</ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.selectAllButton, { backgroundColor: colors.background }]} 
                  onPress={() => toggleAllApps(false)}
                >
                  <ThemedText>Deselect All</ThemedText>
                </TouchableOpacity>
              </ThemedView>
              
              <FlatList
                data={allApps}
                keyExtractor={(item, index) => `app-${index}`}
                numColumns={2}
                style={styles.appSelectionGrid}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={[styles.appSelectionItem, item.selected && styles.appSelectionItemSelected]}
                    onPress={() => toggleAppSelection(item.packageName)}
                  >
                    <View style={styles.appSelectionItemContent}>
                      <View style={[styles.appIconPlaceholder, { backgroundColor: item.selected ? colors.tint + '40' : colors.icon + '20' }]}>
                        <Ionicons 
                          name="apps" 
                          size={18} 
                          color={item.selected ? colors.tint : colors.icon} 
                        />
                      </View>
                      <ThemedText numberOfLines={1} style={styles.appName}>{item.appName}</ThemedText>
                      <Switch 
                        value={item.selected}
                        onValueChange={() => toggleAppSelection(item.packageName)}
                        trackColor={{ false: '#767577', true: colors.tint + '60' }}
                        thumbColor={item.selected ? colors.tint : '#f4f3f4'}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              />
            </ThemedView>
          )}
          
          {/* Date Filter Section */}
          <ThemedView style={styles.dateFilterContainer}>
            <ThemedText style={styles.dateFilterTitle}>Filter by Date Range</ThemedText>
            
            <ThemedView style={styles.datePickerContainer}>
              <ThemedText>Start:</ThemedText>
              <TextInput
                style={styles.dateInput}
                value={startDate}
                onChangeText={setStartDate}
                placeholder="YYYY-MM-DD HH:MM"
              />
            </ThemedView>
            
            <ThemedView style={styles.datePickerContainer}>
              <ThemedText>End:</ThemedText>
              <TextInput
                style={styles.dateInput}
                value={endDate}
                onChangeText={setEndDate}
                placeholder="YYYY-MM-DD HH:MM"
              />
            </ThemedView>
            
            <TouchableOpacity 
              style={[styles.filterButton, { backgroundColor: colors.tint }]}
              onPress={filterStats}
              disabled={loading}
            >
              <ThemedText style={styles.filterButtonText}>
                {loading ? 'Loading...' : 'Show Usage Stats'}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      )}
      
      {/* Error Message */}
      {error && (
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      )}
      
      {/* Usage Stats Section */}
      <ThemedView style={styles.usageStatsContainer}>
        <ThemedText type="subtitle">
          {showFiltered 
            ? `App Usage Stats (${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()})`
            : 'App Usage Stats (last 7 days)'}
        </ThemedText>
        <AppUsageTable 
          usageStats={showFiltered ? filteredStats : usageStats} 
          loading={loading} 
          error={error} 
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  usageStatsContainer: {
    gap: 8,
    marginBottom: 16,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 8,
    marginHorizontal: 16,
  },
  headerPlaceholder: {
    width: 1,
    height: 1,
  },
  permissionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  permissionIconContainer: {
    marginRight: 12,
  },
  permissionTextContainer: {
    flex: 1,
  },
  permissionTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  permissionText: {
    fontSize: 14,
    opacity: 0.8,
  },
  permissionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  permissionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  overviewContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 8,
    padding: 16,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  appSelectionWrapper: {
    marginBottom: 16,
  },
  appSelectionGrid: {
    marginTop: 8,
  },
  appSelectionContainer: {
    maxHeight: 150,
    marginBottom: 8,
  },
  appSelectionItem: {
    flex: 1,
    margin: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  appSelectionItemContent: {
    padding: 12,
    alignItems: 'center',
  },
  appIconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  appName: {
    textAlign: 'center',
    marginVertical: 8,
    fontWeight: '500',
  },
  appSelectionItemSelected: {
    borderColor: '#2196F3',
  },
  selectAllContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  selectAllButton: {
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    width: '48%',
  },
  dateFilterContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 8,
  },
  dateFilterTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  filterContainer: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dateInput: {
    flex: 1,
    marginLeft: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  filterButton: {
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 16,
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 8,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  appSelectionTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
});
