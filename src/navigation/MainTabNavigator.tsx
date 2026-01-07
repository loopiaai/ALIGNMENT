// ALIGNMENT - Main Tab Navigator
// Bottom tabs for Home and Profile

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { MainTabParamList } from '../types';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { Text } from '../components/Text';
import { HomeScreen, ProfileScreen } from '../screens';

const Tab = createBottomTabNavigator<MainTabParamList>();

interface TabIconProps {
  focused: boolean;
  icon: string;
  label: string;
}

const TabIcon: React.FC<TabIconProps> = ({ focused, icon, label }) => {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    if (focused) {
      scale.value = withSpring(1.1, { damping: 15, stiffness: 400 });
    } else {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    }
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.tabIconContainer, animatedStyle]}>
      <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
        <Text variant="h4" color={focused ? 'primary' : 'textMuted'}>
          {icon}
        </Text>
      </View>
      <Text
        variant="labelSmall"
        color={focused ? 'primary' : 'textMuted'}
        style={styles.tabLabel}
      >
        {label}
      </Text>
    </Animated.View>
  );
};

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="◈" label="HOME" />
          ),
        }}
        listeners={{
          tabPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="◉" label="PROFILE" />
          ),
        }}
        listeners={{
          tabPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.voidDeep,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 85,
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
  },
  tabIconContainer: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  iconWrapperActive: {
    backgroundColor: colors.primarySubtle,
  },
  tabLabel: {
    letterSpacing: 1,
  },
});

export default MainTabNavigator;
