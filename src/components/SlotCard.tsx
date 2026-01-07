// ALIGNMENT - Connection Slot Card Component

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  FadeIn,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { Text } from './Text';
import { ConnectionSlot } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SlotCardProps {
  slot: ConnectionSlot;
  onPress?: () => void;
  index: number;
}

export const SlotCard: React.FC<SlotCardProps> = ({ slot, onPress, index }) => {
  const pulseAnim = useSharedValue(1);

  React.useEffect(() => {
    if (slot.status === 'waiting' || slot.status === 'active') {
      pulseAnim.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );
    }
  }, [slot.status]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  const handlePress = () => {
    if (onPress && slot.status !== 'locked') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const renderContent = () => {
    switch (slot.status) {
      case 'empty':
        return (
          <>
            <View style={styles.emptyIcon}>
              <View style={styles.plusHorizontal} />
              <View style={styles.plusVertical} />
            </View>
            <Text variant="label" color="textTertiary">
              Awaiting Match
            </Text>
            <Text variant="bodySmall" color="textMuted">
              The system is searching
            </Text>
          </>
        );

      case 'waiting':
        return (
          <>
            <View style={[styles.statusDot, { backgroundColor: colors.warning }]} />
            <Text variant="label" color="textSecondary">
              Match Found
            </Text>
            <Text variant="bodySmall" color="textMuted">
              Awaiting their response
            </Text>
          </>
        );

      case 'active':
        return (
          <>
            <View style={styles.activeHeader}>
              <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
              <Text variant="labelSmall" color="success">
                ACTIVE
              </Text>
            </View>
            <Text variant="h4" color="textPrimary">
              {slot.connection?.partnerAlias || 'Connection'}
            </Text>
            <View style={styles.dayBadge}>
              <Text variant="labelSmall" color="primary">
                DAY {slot.connection?.currentDay || 1}
              </Text>
            </View>
          </>
        );

      case 'locked':
        return (
          <>
            <View style={styles.lockIcon}>
              <View style={styles.lockBody} />
              <View style={styles.lockShackle} />
            </View>
            <Text variant="label" color="textMuted">
              Premium Slot
            </Text>
            <Text variant="bodySmall" color="textDisabled">
              Unlock with subscription
            </Text>
          </>
        );
    }
  };

  const getGradientColors = (): [string, string] => {
    switch (slot.status) {
      case 'active':
        return [colors.voidCard, `${colors.primary}15`];
      case 'waiting':
        return [colors.voidCard, `${colors.warning}10`];
      case 'locked':
        return [colors.voidSurface, colors.voidSurface];
      default:
        return [colors.voidCard, colors.voidElevated];
    }
  };

  return (
    <Animated.View
      entering={FadeIn.delay(index * 100).duration(400)}
      style={animatedStyle}
    >
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={slot.status === 'locked' ? 1 : 0.8}
        disabled={slot.status === 'locked'}
      >
        <LinearGradient
          colors={getGradientColors()}
          style={[
            styles.card,
            slot.status === 'locked' && styles.lockedCard,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.slotNumber}>
            <Text variant="labelSmall" color="textMuted">
              {slot.isPremium ? '★' : ''} SLOT {index + 1}
            </Text>
          </View>
          <View style={styles.content}>
            {renderContent()}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH - 48,
    height: 140,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  lockedCard: {
    opacity: 0.6,
  },
  slotNumber: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.lg,
  },
  emptyIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  plusHorizontal: {
    position: 'absolute',
    width: 20,
    height: 2,
    backgroundColor: colors.textMuted,
    borderRadius: 1,
  },
  plusVertical: {
    position: 'absolute',
    width: 2,
    height: 20,
    backgroundColor: colors.textMuted,
    borderRadius: 1,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: spacing.xs,
  },
  activeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  dayBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primarySubtle,
    borderRadius: borderRadius.full,
    marginTop: spacing.xs,
  },
  lockIcon: {
    width: 28,
    height: 32,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  lockBody: {
    width: 24,
    height: 18,
    backgroundColor: colors.textMuted,
    borderRadius: 4,
  },
  lockShackle: {
    position: 'absolute',
    top: 0,
    width: 16,
    height: 14,
    borderWidth: 3,
    borderColor: colors.textMuted,
    borderBottomWidth: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});

export default SlotCard;
