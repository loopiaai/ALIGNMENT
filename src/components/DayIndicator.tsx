// ALIGNMENT - Day Indicator Component

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { Text } from './Text';

interface DayIndicatorProps {
  currentDay: number;
  totalDays?: number;
}

export const DayIndicator: React.FC<DayIndicatorProps> = ({
  currentDay,
  totalDays = 21,
}) => {
  const pulseAnim = useSharedValue(1);
  const glowAnim = useSharedValue(0.3);

  useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );

    glowAnim.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowAnim.value,
  }));

  const progress = currentDay / totalDays;
  const isRevealDay = currentDay === 21;

  return (
    <View style={styles.container}>
      {/* Glow effect */}
      <Animated.View style={[styles.glow, glowStyle]}>
        <LinearGradient
          colors={[
            `${isRevealDay ? colors.resonancePerfect : colors.primary}00`,
            `${isRevealDay ? colors.resonancePerfect : colors.primary}40`,
            `${isRevealDay ? colors.resonancePerfect : colors.primary}00`,
          ]}
          style={styles.glowGradient}
        />
      </Animated.View>

      <Animated.View style={[styles.dayContainer, containerStyle]}>
        <Text variant="labelSmall" color="textTertiary">
          DAY
        </Text>
        <Text
          variant="dayCounter"
          color={isRevealDay ? 'resonancePerfect' : 'primary'}
        >
          {currentDay}
        </Text>
        <Text variant="labelSmall" color="textMuted">
          of {totalDays}
        </Text>
      </Animated.View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <LinearGradient
            colors={
              isRevealDay
                ? (colors.gradientReveal as [string, string, ...string[]])
                : (colors.gradientPrimary as [string, string, ...string[]])
            }
            style={[styles.progressFill, { width: `${progress * 100}%` }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </View>

        {/* Milestone markers */}
        <View style={styles.milestones}>
          {[6, 15, 21].map((day) => (
            <View
              key={day}
              style={[
                styles.milestone,
                { left: `${(day / totalDays) * 100}%` },
                currentDay >= day && styles.milestoneActive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Phase labels */}
      <View style={styles.phases}>
        <Text variant="labelSmall" color={currentDay <= 5 ? 'primary' : 'textMuted'}>
          TEXT
        </Text>
        <Text variant="labelSmall" color={currentDay >= 6 && currentDay <= 14 ? 'primary' : 'textMuted'}>
          VOICE
        </Text>
        <Text variant="labelSmall" color={currentDay >= 15 ? 'primary' : 'textMuted'}>
          REVEAL
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  glow: {
    position: 'absolute',
    width: 200,
    height: 200,
    top: -60,
  },
  glowGradient: {
    flex: 1,
    borderRadius: 100,
  },
  dayContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  progressContainer: {
    width: '100%',
    paddingHorizontal: spacing.xl,
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.voidElevated,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  milestones: {
    position: 'relative',
    height: 12,
    marginTop: -6,
  },
  milestone: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.voidElevated,
    borderWidth: 2,
    borderColor: colors.void,
    marginLeft: -4,
    top: 2,
  },
  milestoneActive: {
    backgroundColor: colors.primary,
  },
  phases: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: spacing.xl,
    marginTop: spacing.md,
  },
});

export default DayIndicator;
