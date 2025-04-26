/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0A84FF';
const tintColorDark = '#0A84FF';

export const Colors = {
  light: {
    text: '#000000',
    background: '#fff',
    tint: tintColorLight,
    icon: '#505050',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#FFFFFF',
    background: '#151718',
    tint: tintColorDark,
    icon: '#CCCCCC',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
