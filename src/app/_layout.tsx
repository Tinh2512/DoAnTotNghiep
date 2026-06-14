import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, Tabs, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { COLORS } from '@/constants/config';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.PRIMARY,
          tabBarInactiveTintColor: COLORS.TEXT_SECONDARY,
          tabBarStyle: {
            backgroundColor: COLORS.SURFACE,
            borderTopColor: COLORS.BORDER,
            borderTopWidth: 1,
            paddingBottom: 8,
            paddingTop: 8,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            marginTop: 4,
          },
        }}
      >
        {/* Dashboard */}
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="grid" color={color} size={size} />
            ),
          }}
        />

        {/* Monitoring */}
        <Tabs.Screen
          name="monitoring"
          options={{
            title: 'Monitoring',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="eye" color={color} size={size} />
            ),
          }}
        />

        {/* Statistics */}
        <Tabs.Screen
          name="statistics"
          options={{
            title: 'Statistics',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bar-chart" color={color} size={size} />
            ),
          }}
        />

        {/* Devices */}
        <Tabs.Screen
          name="devices"
          options={{
            title: 'Devices',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="hardware-chip" color={color} size={size} />
            ),
          }}
        />

        {/* Settings */}
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}
