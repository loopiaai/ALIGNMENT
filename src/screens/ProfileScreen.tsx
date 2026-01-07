// ALIGNMENT - Profile/Settings Screen
// Account management and settings

import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { RootStackParamList, MainTabParamList } from '../types';

type ProfileScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Profile'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type ProfileScreenProps = {
  navigation: ProfileScreenNavigationProp;
};

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const handleUpgrade = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Subscription');
  };

  const handleSettings = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Settings');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.voidDeep, colors.void, colors.voidSurface]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInUp.delay(100).duration(400)} style={styles.header}>
          <Text variant="labelSmall" color="textMuted">
            YOUR PROFILE
          </Text>
          <Text variant="h1" color="textPrimary">
            Protocol Status
          </Text>
        </Animated.View>

        {/* Subscription status */}
        <Animated.View entering={FadeInUp.delay(200).duration(400)} style={styles.subscriptionContainer}>
          <LinearGradient
            colors={[colors.primarySubtle, `${colors.primary}05`]}
            style={styles.subscriptionCard}
          >
            <View style={styles.subscriptionHeader}>
              <View style={styles.subscriptionBadge}>
                <Text variant="labelSmall" color="primary">FREE</Text>
              </View>
              <Text variant="h3" color="textPrimary">1 Active Slot</Text>
            </View>
            <Text variant="body" color="textTertiary" style={styles.subscriptionDesc}>
              Upgrade to Premium for 3 slots and pause days.
            </Text>
            <Button
              title="Upgrade to Premium"
              onPress={handleUpgrade}
              variant="primary"
              size="md"
              fullWidth
            />
          </LinearGradient>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInUp.delay(300).duration(400)} style={styles.statsContainer}>
          <Text variant="labelSmall" color="textTertiary" style={styles.sectionTitle}>
            YOUR JOURNEY
          </Text>
          <LinearGradient
            colors={[colors.voidCard, colors.voidElevated]}
            style={styles.statsCard}
          >
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text variant="h2" color="primary">3</Text>
                <Text variant="labelSmall" color="textMuted">CONNECTIONS</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text variant="h2" color="accent">47</Text>
                <Text variant="labelSmall" color="textMuted">DAYS</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text variant="h2" color="secondary">1</Text>
                <Text variant="labelSmall" color="textMuted">REVEALED</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Pulse Profile */}
        <Animated.View entering={FadeInUp.delay(400).duration(400)} style={styles.pulseContainer}>
          <Text variant="labelSmall" color="textTertiary" style={styles.sectionTitle}>
            YOUR SIGNAL
          </Text>
          <LinearGradient
            colors={[colors.voidCard, colors.voidElevated]}
            style={styles.pulseCard}
          >
            <View style={styles.pulseHeader}>
              <View style={styles.pulseIcon}>
                <Text variant="label" color="primary">✦</Text>
              </View>
              <View style={styles.pulseInfo}>
                <Text variant="h4" color="textPrimary">Pulse Complete</Text>
                <Text variant="bodySmall" color="textMuted">50 responses captured</Text>
              </View>
            </View>
            <View style={styles.pulseTraits}>
              <View style={styles.traitItem}>
                <View style={[styles.traitDot, { backgroundColor: colors.primary }]} />
                <Text variant="bodySmall" color="textSecondary">Values depth over surface</Text>
              </View>
              <View style={styles.traitItem}>
                <View style={[styles.traitDot, { backgroundColor: colors.accent }]} />
                <Text variant="bodySmall" color="textSecondary">Detaches under pressure</Text>
              </View>
              <View style={styles.traitItem}>
                <View style={[styles.traitDot, { backgroundColor: colors.secondary }]} />
                <Text variant="bodySmall" color="textSecondary">Prefers understanding over admiration</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Settings menu */}
        <Animated.View entering={FadeInUp.delay(500).duration(400)} style={styles.menuContainer}>
          <Text variant="labelSmall" color="textTertiary" style={styles.sectionTitle}>
            SETTINGS
          </Text>
          <View style={styles.menuList}>
            <TouchableOpacity onPress={handleSettings} style={styles.menuItem}>
              <Text variant="body" color="textSecondary">Account Settings</Text>
              <Text variant="body" color="textMuted">→</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text variant="body" color="textSecondary">Notification Preferences</Text>
              <Text variant="body" color="textMuted">→</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text variant="body" color="textSecondary">Privacy & Safety</Text>
              <Text variant="body" color="textMuted">→</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text variant="body" color="textSecondary">Help & Support</Text>
              <Text variant="body" color="textMuted">→</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text variant="body" color="textSecondary">About Alignment</Text>
              <Text variant="body" color="textMuted">→</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Footer */}
        <Animated.View entering={FadeIn.delay(700).duration(400)} style={styles.footer}>
          <Text variant="labelSmall" color="textMuted" align="center">
            ALIGNMENT v1.0.0
          </Text>
          <Text variant="labelSmall" color="textMuted" align="center">
            A Protocol for Real Human Connection
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.void,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['4xl'],
    paddingBottom: spacing['6xl'],
  },
  header: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  subscriptionContainer: {
    marginBottom: spacing.xl,
  },
  subscriptionCard: {
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.borderActive,
    gap: spacing.lg,
  },
  subscriptionHeader: {
    gap: spacing.sm,
  },
  subscriptionBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primarySubtle,
    borderRadius: borderRadius.full,
  },
  subscriptionDesc: {
    marginBottom: spacing.sm,
  },
  statsContainer: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.md,
    letterSpacing: 2,
  },
  statsCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  pulseContainer: {
    marginBottom: spacing.xl,
  },
  pulseCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.lg,
  },
  pulseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  pulseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primarySubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseInfo: {
    gap: spacing['2xs'],
  },
  pulseTraits: {
    gap: spacing.sm,
  },
  traitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  traitDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  menuContainer: {
    marginBottom: spacing.xl,
  },
  menuList: {
    backgroundColor: colors.voidCard,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  footer: {
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xl,
  },
});

export default ProfileScreen;
