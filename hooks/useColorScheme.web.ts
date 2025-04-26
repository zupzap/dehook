import { ColorSchemeName } from 'react-native';

/**
 * This hook always returns 'light' as the app only supports light mode
 */
export function useColorScheme(): NonNullable<ColorSchemeName> {
  return 'light';
}
