import React from 'react';
import { StyleSheet, View, ActivityIndicator, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';

interface AppUsageItem {
  packageName?: string;
  package_name?: string;
  totalTimeInForeground?: number;
  total_time_in_foreground?: number;
  appName?: string;
  iconUri?: string;
  humanReadableTime?: string;
  isSystem?: boolean;
  count?: number;
  selected?: boolean;
}

interface AppUsageTableProps {
  usageStats: AppUsageItem[];
  loading: boolean;
  error: string | null;
}

export const AppUsageTable: React.FC<AppUsageTableProps> = ({ 
  usageStats, 
  loading, 
  error 
}) => {
  const colorScheme = useColorScheme();
  
  // Format time in minutes to hours and minutes
  const formatTime = (minutes?: number): string => {
    if (minutes === undefined || minutes === null) return 'N/A';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins}m`;
    } else if (mins === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${mins}m`;
    }
  };
  
  // Render each app usage item
  const renderItem = ({ item }: { item: AppUsageItem }) => {
    const packageName = item.packageName || item.package_name || '';
    const totalTime = item.totalTimeInForeground || item.total_time_in_foreground || 0;
    const formattedTime = item.humanReadableTime || formatTime(totalTime / 60000); // Convert ms to minutes
    
    return (
      <ThemedView style={styles.tableRow}>
        <View style={styles.appInfoContainer}>
          <View style={[styles.appIconPlaceholder, { backgroundColor: colorScheme === 'dark' ? '#2C3E50' : '#ECF0F1' }]}>
            <Ionicons 
              name="apps" 
              size={18} 
              color={colorScheme === 'dark' ? '#ECF0F1' : '#2C3E50'} 
            />
          </View>
          <View style={styles.appTextContainer}>
            <ThemedText style={styles.appName} numberOfLines={1}>
              {item.appName || packageName.split('.').pop() || 'Unknown App'}
            </ThemedText>
            <ThemedText style={styles.packageName} numberOfLines={1}>
              {packageName}
            </ThemedText>
          </View>
        </View>
        <ThemedText style={styles.usageTime}>
          {formattedTime}
        </ThemedText>
      </ThemedView>
    );
  };
  
  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <ThemedText style={styles.loadingText}>Loading app usage data...</ThemedText>
      </ThemedView>
    );
  }
  
  if (error) {
    return (
      <ThemedView style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={24} color="#FF6B6B" />
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      </ThemedView>
    );
  }
  
  if (!usageStats || usageStats.length === 0) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <Ionicons name="information-circle" size={24} color="#64B5F6" />
        <ThemedText style={styles.emptyText}>No app usage data available</ThemedText>
      </ThemedView>
    );
  }
  
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.tableHeader}>
        <ThemedText style={styles.headerApp}>App</ThemedText>
        <ThemedText style={styles.headerUsage}>Usage Time</ThemedText>
      </ThemedView>
      
      <FlatList
        data={usageStats}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.packageName || item.package_name || ''}-${index}`}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerApp: {
    flex: 3,
    fontWeight: 'bold',
  },
  headerUsage: {
    flex: 1,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  appInfoContainer: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  appIconPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  appTextContainer: {
    flex: 1,
  },
  appName: {
    fontWeight: '500',
    fontSize: 14,
  },
  packageName: {
    fontSize: 12,
    opacity: 0.6,
  },
  usageTime: {
    flex: 1,
    textAlign: 'right',
    fontWeight: '500',
  },
  list: {
    maxHeight: 400,
  },
  listContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    textAlign: 'center',
  },
  errorContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,107,107,0.1)',
    borderRadius: 8,
  },
  errorText: {
    marginTop: 8,
    textAlign: 'center',
    color: '#FF6B6B',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(100,181,246,0.1)',
    borderRadius: 8,
  },
  emptyText: {
    marginTop: 8,
    textAlign: 'center',
    color: '#64B5F6',
  },
});
