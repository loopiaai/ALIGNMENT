// ALIGNMENT - Resonance Score Display Component

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { Text } from './Text';

interface ResonanceScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const ResonanceScore: React.FC<ResonanceScoreProps> = ({
  score,
  size = 'lg',
  animated = true,
}) => {
  const displayScore = useSharedValue(0);
  const pulseAnim = useSharedValue(1);
  const glowAnim = useSharedValue(0);

  useEffect(() => {
    displayScore.value = withTiming(score, {
      duration: 1500,
      easing: Easing.out(Easing.cubic),
    });

    if (animated) {
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
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.5, { duration: 2000, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );
    }
  }, [score, animated]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glowAnim.value, [0.5, 1], [0.3, 0.6]),
  }));

  const getScoreColor = () => {
    if (score >= 90) return colors.resonancePerfect;
    if (score >= 80) return colors.resonanceHigh;
    return colors.resonance;
  };

  const sizeConfig = {
    sm: { container: 80, fontSize: 28, label: 10 },
    md: { container: 120, fontSize: 42, label: 12 },
    lg: { container: 160, fontSize: 56, label: 14 },
  };

  const config = sizeConfig[size];

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* Outer glow */}
      <Animated.View
        style={[
          styles.glow,
          glowStyle,
          {
            width: config.container * 1.4,
            height: config.container * 1.4,
          },
        ]}
      >
        <LinearGradient
          colors={[`${getScoreColor()}00`, `${getScoreColor()}40`, `${getScoreColor()}00`]}
          style={styles.glowGradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </Animated.View>

      {/* Score circle */}
      <View
        style={[
          styles.scoreCircle,
          {
            width: config.container,
            height: config.container,
            borderColor: `${getScoreColor()}40`,
          },
        ]}
      >
        <LinearGradient
          colors={[`${getScoreColor()}20`, `${getScoreColor()}05`]}
          style={styles.circleGradient}
        />
        <Text
          variant="resonanceScore"
          style={[styles.scoreText, { fontSize: config.fontSize, color: getScoreColor() }]}
        >
          {Math.round(score)}
        </Text>
        <Text
          variant="labelSmall"
          style={[styles.percentSign, { fontSize: config.label, color: getScoreColor() }]}
        >
          %
        </Text>
      </View>

      {/* Label */}
      <Text variant="labelSmall" color="textTertiary" style={styles.label}>
        RESONANCE
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    borderRadius: 9999,
  },
  glowGradient: {
    flex: 1,
    borderRadius: 9999,
  },
  scoreCircle: {
    borderRadius: 9999,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  circleGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 9999,
  },
  scoreText: {
    fontWeight: '700',
  },
  percentSign: {
    position: 'absolute',
    right: '20%',
    top: '25%',
  },
  label: {
    marginTop: spacing.md,
    letterSpacing: 3,
  },
});

export default ResonanceScore;
