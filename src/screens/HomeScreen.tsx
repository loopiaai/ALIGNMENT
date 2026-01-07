// ALIGNMENT - Home Screen
// Connection slots view - the main hub

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { Text } from '../components/Text';
import { SlotCard } from '../components/SlotCard';
import { GlowOrb } from '../components/GlowOrb';
import { RootStackParamList, MainTabParamList, ConnectionSlot } from '../types';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
};

// Mock data for demo
const mockSlots: ConnectionSlot[] = [
  {
    id: '1',
    status: 'active',
    isPremium: false,
    connection: {
      id: 'conn1',
      matchId: 'match1',
      partnerId: 'user2',
      partnerAlias: 'Thoughtful Soul',
      currentDay: 7,
      startedAt: new Date(),
      lastHandshake: new Date(),
      status: 'active',
      voiceUnlocked: true,
      imagesUnlocked: false,
      revealed: false,
      messages: [],
    },
  },
  {
    id: '2',
    status: 'empty',
    isPremium: true,
  },
  {
    id: '3',
    status: 'locked',
    isPremium: true,
  },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [slots, setSlots] = useState<ConnectionSlot[]>(mockSlots);
  const [refreshing, setRefreshing] = useState(false);
  const [hasNewMatch, setHasNewMatch] = useState(true);

  const onRefresh = () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const handleSlotPress = (slot: ConnectionSlot) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (slot.status === 'active' && slot.connection) {
      navigation.navigate('Conversation', { connectionId: slot.connection.id });
    } else if (slot.status === 'waiting') {
      navigation.navigate('MatchWaiting', { matchId: slot.id });
    } else if (slot.status === 'locked') {
      navigation.navigate('Subscription');
    }
  };

  const handleViewMatch = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    navigation.navigate('MatchReveal', { matchId: 'demo-match' });
  };

  const activeConnections = slots.filter(s => s.status === 'active').length;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.voidDeep, colors.void, colors.voidSurface]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInUp.delay(100).duration(400)} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text variant="labelSmall" color="textMuted">
                THE PROTOCOL
              </Text>
              <Text variant="h1" color="textPrimary">
                Connections
              </Text>
            </View>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text variant="labelSmall" color="textSecondary">
                {activeConnections} Active
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* New Match Alert */}
        {hasNewMatch && (
          <Animated.View entering={FadeIn.delay(200).duration(400)} style={styles.matchAlertContainer}>
            <LinearGradient
              colors={[`${colors.primary}20`, `${colors.primary}05`]}
              style={styles.matchAlert}
            >
              <View style={styles.matchAlertContent}>
                <View style={styles.matchAlertIcon}>
                  <GlowOrb size={30} color={colors.primary} intensity="high" speed="fast" />
                </View>
                <View style={styles.matchAlertText}>
                  <Text variant="label" color="primary">
                    New Match Found
                  </Text>
                  <Text variant="bodySmall" color="textMuted">
                    92% Resonance • Tap to reveal
                  </Text>
                </View>
              </View>
              <Animated.View style={styles.matchAlertButton}>
                <Text
                  variant="button"
                  color="primary"
                  onPress={handleViewMatch}
                >
                  VIEW →
                </Text>
              </Animated.View>
            </LinearGradient>
          </Animated.View>
        )}

        {/* Connection Slots */}
        <View style={styles.slotsContainer}>
          <Text variant="labelSmall" color="textTertiary" style={styles.slotsTitle}>
            YOUR SLOTS
          </Text>
          <View style={styles.slotsList}>
            {slots.map((slot, index) => (
              <SlotCard
                key={slot.id}
                slot={slot}
                index={index}
                onPress={() => handleSlotPress(slot)}
              />
            ))}
          </View>
        </View>

        {/* Protocol Rules Reminder */}
        <Animated.View entering={FadeInUp.delay(500).duration(400)} style={styles.rulesContainer}>
          <LinearGradient
            colors={[colors.voidCard, colors.voidElevated]}
            style={styles.rulesCard}
          >
            <Text variant="labelSmall" color="textTertiary" style={styles.rulesTitle}>
              PROTOCOL RULES
            </Text>
            <View style={styles.rulesList}>
              <View style={styles.ruleItem}>
                <View style={styles.ruleDot} />
                <Text variant="bodySmall" color="textMuted">
                  One conversation per slot
                </Text>
              </View>
              <View style={styles.ruleItem}>
                <View style={styles.ruleDot} />
                <Text variant="bodySmall" color="textMuted">
                  Daily handshake at 9:00 PM
                </Text>
              </View>
              <View style={styles.ruleItem}>
                <View style={styles.ruleDot} />
                <Text variant="bodySmall" color="textMuted">
                  Photos reveal on Day 21
                </Text>
              </View>
            </View>
          </LinearGradient>
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
    marginBottom: spacing.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.voidCard,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  matchAlertContainer: {
    marginBottom: spacing.xl,
  },
  matchAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderActive,
  },
  matchAlertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  matchAlertIcon: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchAlertText: {
    gap: spacing['2xs'],
  },
  matchAlertButton: {
    paddingHorizontal: spacing.md,
  },
  slotsContainer: {
    marginBottom: spacing.xl,
  },
  slotsTitle: {
    marginBottom: spacing.md,
    letterSpacing: 2,
  },
  slotsList: {
    gap: spacing.md,
  },
  rulesContainer: {
    marginTop: spacing.lg,
  },
  rulesCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rulesTitle: {
    marginBottom: spacing.md,
    letterSpacing: 2,
  },
  rulesList: {
    gap: spacing.sm,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  ruleDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
});

export default HomeScreen;
