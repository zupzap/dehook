import { Link } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { type ComponentProps } from 'react';
import { Platform } from 'react-native';
import * as React from 'react';

// Type for both web and native events
type LinkEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | import('react-native').GestureResponderEvent;

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: string };

export function ExternalLink({ href, ...rest }: Props): JSX.Element {
  return (
    <Link
      target="_blank"
      {...rest}
      // @ts-ignore
      href={href}
      onPress={async (event: LinkEvent) => {
        // For native, prevent default and open in-app browser
        if (Platform.OS !== 'web') {
          // @ts-ignore: event might not have preventDefault on native
          if (typeof event.preventDefault === 'function') event.preventDefault();
          await openBrowserAsync(href);
        }
        // For web, let default behavior occur
      }}
    />
  );
}
