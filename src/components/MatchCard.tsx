// ALIGNMENT - Match Reveal Card Component

import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { Text } from './Text';
import { ResonanceScore } from './ResonanceScore';
import { Match } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MatchCardProps {
  match: Match;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const cardScale = useSharedValue(0.9);
  const cardOpacity = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    cardOpacity.value = withTiming(1, { duration: 600 });
    cardScale.value = withSequence(
      withTiming(1.02, { duration: 400, easing: Easing.out(Easing.back) }),
      withTiming(1, { duration: 200 })
    );
    glowOpacity.value = withDelay(
      300,
      withTiming(1, { duration: 800 })
    );
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardOpacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, cardStyle]}>
      {/* Glow effect */}
      <Animated.View style={[styles.glow, glowStyle]}>
        <LinearGradient
          colors={[`${colors.primary}00`, `${colors.primary}30`, `${colors.primary}00`]}
          style={styles.glowGradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </Animated.View>

      <LinearGradient
        colors={[colors.voidCard, colors.voidElevated, colors.voidCard]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          style={styles.header}
        >
          <Text variant="labelSmall" color="primary">
            MATCH FOUND
          </Text>
        </Animated.View>

        {/* Resonance Score */}
        <Animated.View
          entering={FadeIn.delay(400).duration(600)}
          style={styles.scoreContainer}
        >
          <ResonanceScore score={match.resonanceScore} />
        </Animated.View>

        {/* Alignment Reasons */}
        <View style={styles.reasonsContainer}>
          <Text variant="labelSmall" color="textTertiary" style={styles.reasonsTitle}>
            WHY YOU ALIGN
          </Text>
          {match.alignmentReasons.map((reason, index) => (
            <Animated.View
              key={index}
              entering={FadeInDown.delay(600 + index * 150).duration(400)}
              style={styles.reasonItem}
            >
              <View style={styles.reasonDot} />
              <Text variant="body" color="textSecondary">
                {reason}
              </Text>
            </Animated.View>
          ))}
        </View>

        {/* Decorative line */}
        <View style={styles.divider} />

        {/* Footer */}
        <Animated.View
          entering={FadeIn.delay(1200).duration(400)}
          style={styles.footer}
        >
          <Text variant="bodySmall" color="textMuted" align="center">
            Double acceptance required to begin
          </Text>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH - 48,
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: SCREEN_WIDTH - 24,
    height: 520,
    top: -20,
  },
  glowGradient: {
    flex: 1,
    borderRadius: borderRadius['3xl'],
  },
  card: {
    width: '100%',
    minHeight: 480,
    borderRadius: borderRadius['2xl'],
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    overflow: 'hidden',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  reasonsContainer: {
    flex: 1,
    gap: spacing.md,
  },
  reasonsTitle: {
    marginBottom: spacing.sm,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  reasonDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xl,
  },
  footer: {
    paddingTop: spacing.sm,
  },
});

export default MatchCard;
