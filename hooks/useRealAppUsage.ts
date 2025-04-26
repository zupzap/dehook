import { useState, useEffect } from 'react';
import {
  checkForPermission,
  queryEvents,
  showUsageAccessSettings,
} from '@brighthustle/react-native-usage-stats-manager';
import { Platform } from 'react-native';

export interface AppUsageItem {
  packageName?: string;
  package_name?: string;
  totalTimeInForeground?: number;
  total_time_in_foreground?: number;
  appName?: string;
  humanReadableTime?: string;
  isSystem?: boolean;
  count?: number;
  selected?: boolean;
  eventTime?: number;
}

export const useRealAppUsage = () => {
  const [usageStats, setUsageStats] = useState<AppUsageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check for permission on component mount
  useEffect(() => {
    const checkPermission = async () => {
      try {
        if (Platform.OS !== 'android') {
          setError('App usage tracking is only available on Android devices');
          setPermission(false);
          return;
        }
        
        const hasPermission = await checkForPermission();
        setPermission(hasPermission);
        
        if (!hasPermission) {
          setError('Usage access permission is required. Please enable it in settings and restart the app.');
        }
      } catch (e: any) {
        console.error('Error checking permission:', e);
        setError(`Failed to check permission: ${e?.message || 'Unknown error'}`);
        setPermission(false);
      }
    };
    
    checkPermission();
  }, []);

  // Function to request usage access permission
  const requestPermission = async () => {
    try {
      if (Platform.OS !== 'android') {
        setError('App usage tracking is only available on Android devices');
        return false;
      }
      
      showUsageAccessSettings('');
      return true;
    } catch (e: any) {
      console.error('Error requesting permission:', e);
      setError(`Failed to request permission: ${e?.message || 'Unknown error'}`);
      return false;
    }
  };

  // Function to fetch usage stats for a specific time range
  const fetchUsageStats = async (startTime: number, endTime: number, selectedPackages?: string[]) => {
    if (Platform.OS !== 'android') {
      setError('App usage tracking is only available on Android devices');
      return [];
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const hasPermission = await checkForPermission();
      setPermission(hasPermission);
      
      if (!hasPermission) {
        setError('Usage access permission is required. Please enable it in settings and restart the app.');
        setLoading(false);
        return [];
      }
      
      try {
        // Try to get events data
        const eventsObj = await queryEvents(startTime, endTime);
        
        // Check if we have valid events data (object with numeric keys)
        if (!eventsObj || typeof eventsObj !== 'object') {
          setError('Unable to retrieve app usage data. The library returned invalid data.');
          setLoading(false);
          return [];
        }
        
        // Convert object with numeric keys to array
        const events = Object.keys(eventsObj)
          .filter(key => !isNaN(Number(key)))
          .map(key => eventsObj[key]);
        
        if (events.length === 0) {
          setError('No app usage data available for the selected time period.');
          setLoading(false);
          return [];
        }
        
        // Process the events data
        const processedStats = processEventsData(events, startTime, endTime, selectedPackages);
        setUsageStats(processedStats);
        return processedStats;
      } catch (statsError: any) {
        console.error('Error fetching stats:', statsError);
        setError('Failed to fetch usage stats: ' + (statsError?.message || 'Unknown error'));
        setLoading(false);
        return [];
      }
    } catch (e: any) {
      console.error('Main error:', e);
      setError(e?.message || 'Failed to fetch usage stats');
      setLoading(false);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Process events data to calculate app usage
  const processEventsData = (
    events: any[], 
    startTime: number, 
    endTime: number,
    selectedPackages?: string[]
  ): AppUsageItem[] => {
    try {
      // Create a simplified representation of app usage from events
      const appUsageList = events.map(event => {
        return {
          packageName: event.packageName || '',
          appName: (event.name || '').split('/')[0] || (event.packageName || '').split('.').pop() || '',
          totalTimeInForeground: event.usageTime || 0,
          humanReadableTime: event.humanReadableUsageTime || '',
          isSystem: event.isSystem || false,
          count: event.count || 0,
          eventTime: event.eventTime || 0
        };
      });
      
      // Filter out empty package names and system apps
      let filteredApps = appUsageList.filter(app => 
        app.packageName && 
        app.totalTimeInForeground > 0 && 
        !app.isSystem &&
        !app.packageName.startsWith('com.android.') && 
        !app.packageName.startsWith('com.google.android')
      );
      
      // If we have selected packages, filter to only include those
      if (selectedPackages && selectedPackages.length > 0) {
        // Get unique package names from filtered apps
        const availablePackages = new Set(filteredApps.map(app => app.packageName));
        
        // First filter to only include selected apps
        filteredApps = filteredApps.filter(app => 
          selectedPackages.includes(app.packageName || '')
        );
        
        // Then add placeholder entries for selected apps that don't have usage data
        const missingApps = selectedPackages.filter(pkg => !availablePackages.has(pkg));
        
        missingApps.forEach(packageName => {
          // Extract app name from package name (last part after the last dot)
          const appNameParts = packageName.split('.');
          const appName = appNameParts.length > 0 ? appNameParts[appNameParts.length - 1] : packageName;
          
          filteredApps.push({
            packageName: packageName,
            appName: appName,
            totalTimeInForeground: 0,
            humanReadableTime: 'N/A',
            isSystem: false,
            count: 0,
            eventTime: 0
          });
        });
      }
      
      // Sort by usage time (descending)
      return filteredApps.sort((a, b) => 
        (b.totalTimeInForeground || 0) - (a.totalTimeInForeground || 0)
      );
    } catch (error: any) {
      console.error('Error processing events:', error);
      setError('Failed to process usage events: ' + (error?.message || 'Unknown error'));
      return [];
    }
  };

  // Get all unique apps from usage stats
  const getUniqueApps = (): {packageName: string, appName: string, selected: boolean}[] => {
    const uniqueAppsMap = new Map<string, {packageName: string, appName: string, selected: boolean}>();
    
    usageStats.forEach(app => {
      if (app.packageName && !uniqueAppsMap.has(app.packageName)) {
        uniqueAppsMap.set(app.packageName, {
          packageName: app.packageName,
          appName: app.appName || app.packageName.split('.').pop() || app.packageName,
          selected: true
        });
      }
    });
    
    return Array.from(uniqueAppsMap.values());
  };

  return {
    usageStats,
    loading,
    permission,
    error,
    fetchUsageStats,
    requestPermission,
    getUniqueApps,
  };
};
