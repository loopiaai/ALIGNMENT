// ALIGNMENT - Swipe Card Component for Binary Pulse

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useAnimatedGestureHandler,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { Text } from './Text';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

interface SwipeCardProps {
  question: string;
  level: 1 | 2 | 3;
  onSwipe: (direction: 'yes' | 'no') => void;
  cardIndex: number;
  totalCards: number;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  question,
  level,
  onSwipe,
  cardIndex,
  totalCards,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleSwipeComplete = (direction: 'yes' | 'no') => {
    triggerHaptic();
    onSwipe(direction);
  };

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startX: number; startY: number }
  >({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY * 0.3;
      rotation.value = interpolate(
        translateX.value,
        [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        [-15, 0, 15],
        Extrapolate.CLAMP
      );
    },
    onEnd: (event) => {
      if (translateX.value > SWIPE_THRESHOLD) {
        translateX.value = withTiming(SCREEN_WIDTH * 1.5, { duration: 300 });
        runOnJS(handleSwipeComplete)('yes');
      } else if (translateX.value < -SWIPE_THRESHOLD) {
        translateX.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 300 });
        runOnJS(handleSwipeComplete)('no');
      } else {
        translateX.value = withSpring(0, { damping: 20, stiffness: 300 });
        translateY.value = withSpring(0, { damping: 20, stiffness: 300 });
        rotation.value = withSpring(0, { damping: 20, stiffness: 300 });
      }
    },
  });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const yesOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolate.CLAMP
    ),
  }));

  const noOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [1, 0],
      Extrapolate.CLAMP
    ),
  }));

  const getLevelColor = () => {
    switch (level) {
      case 1:
        return colors.secondary;
      case 2:
        return colors.primary;
      case 3:
        return colors.accent;
      default:
        return colors.primary;
    }
  };

  const getLevelLabel = () => {
    switch (level) {
      case 1:
        return 'FOUNDATIONS';
      case 2:
        return 'LIFESTYLE';
      case 3:
        return 'SOUL';
      default:
        return '';
    }
  };

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.card, cardStyle]}>
        <LinearGradient
          colors={[colors.voidCard, colors.voidElevated]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* YES Overlay */}
          <Animated.View style={[styles.overlay, styles.yesOverlay, yesOverlayStyle]}>
            <LinearGradient
              colors={['rgba(16, 185, 129, 0.3)', 'transparent']}
              style={styles.overlayGradient}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
            <Text variant="h2" color="success" style={styles.overlayText}>
              YES
            </Text>
          </Animated.View>

          {/* NO Overlay */}
          <Animated.View style={[styles.overlay, styles.noOverlay, noOverlayStyle]}>
            <LinearGradient
              colors={['rgba(239, 68, 68, 0.3)', 'transparent']}
              style={styles.overlayGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <Text variant="h2" color="error" style={styles.overlayTextNo}>
              NO
            </Text>
          </Animated.View>

          {/* Card Content */}
          <View style={styles.content}>
            {/* Level indicator */}
            <View style={styles.levelContainer}>
              <View style={[styles.levelDot, { backgroundColor: getLevelColor() }]} />
              <Text variant="labelSmall" color="textTertiary">
                {getLevelLabel()}
              </Text>
            </View>

            {/* Question */}
            <View style={styles.questionContainer}>
              <Text variant="cardQuestion" color="textPrimary" align="center">
                {question}
              </Text>
            </View>

            {/* Progress */}
            <View style={styles.progressContainer}>
              <Text variant="labelSmall" color="textMuted">
                {cardIndex + 1} / {totalCards}
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${((cardIndex + 1) / totalCards) * 100}%`,
                      backgroundColor: getLevelColor(),
                    },
                  ]}
                />
              </View>
            </View>
          </View>

          {/* Swipe hints */}
          <View style={styles.hints}>
            <Text variant="labelSmall" color="textMuted">
              ← NO
            </Text>
            <Text variant="labelSmall" color="textMuted">
              YES →
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH - 48,
    height: 420,
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius['2xl'],
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  overlayGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: borderRadius['2xl'],
  },
  yesOverlay: {},
  noOverlay: {},
  overlayText: {
    position: 'absolute',
    right: 30,
    top: 40,
    transform: [{ rotate: '15deg' }],
  },
  overlayTextNo: {
    position: 'absolute',
    left: 30,
    top: 40,
    transform: [{ rotate: '-15deg' }],
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'space-between',
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  levelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  progressContainer: {
    gap: spacing.sm,
  },
  progressBar: {
    height: 3,
    backgroundColor: colors.voidSurface,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  hints: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
});

export default SwipeCard;
