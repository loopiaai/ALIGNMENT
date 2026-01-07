// ALIGNMENT - Pulse Introduction Screen
// Explain the Binary Pulse mechanic

import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
  FadeIn,
  FadeInUp,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { ScreenContainer } from '../components/ScreenContainer';
import { RootStackParamList } from '../types';
import { getTotalCardCount } from '../data/pulseCards';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type PulseIntroScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PulseIntro'>;
};

export const PulseIntroScreen: React.FC<PulseIntroScreenProps> = ({ navigation }) => {
  const pulseAnim = useSharedValue(1);
  const swipeLeftX = useSharedValue(0);
  const swipeRightX = useSharedValue(0);

  useEffect(() => {
    // Pulse animation
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );

    // Swipe demo animations
    swipeLeftX.value = withRepeat(
      withSequence(
        withDelay(500, withTiming(-30, { duration: 500 })),
        withTiming(0, { duration: 500 })
      ),
      -1,
      false
    );

    swipeRightX.value = withRepeat(
      withSequence(
        withDelay(1500, withTiming(30, { duration: 500 })),
        withTiming(0, { duration: 500 })
      ),
      -1,
      false
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  const swipeLeftStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: swipeLeftX.value }],
    opacity: swipeLeftX.value < 0 ? 1 : 0.3,
  }));

  const swipeRightStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: swipeRightX.value }],
    opacity: swipeRightX.value > 0 ? 1 : 0.3,
  }));

  const handleBegin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    navigation.navigate('PulseCards');
  };

  const totalCards = getTotalCardCount();

  return (
    <ScreenContainer gradient gradientColors={[colors.voidDeep, colors.void, colors.voidSurface]}>
      <View style={styles.container}>
        {/* Header */}
        <Animated.View entering={FadeInUp.delay(100).duration(400)} style={styles.header}>
          <Text variant="labelSmall" color="primary">
            THE BINARY PULSE
          </Text>
          <Text variant="h1" color="textPrimary" style={styles.title}>
            React. Don't think.
          </Text>
        </Animated.View>

        {/* Demo card */}
        <Animated.View entering={FadeIn.delay(300).duration(600)} style={styles.demoContainer}>
          <Animated.View style={[styles.demoCard, pulseStyle]}>
            <LinearGradient
              colors={[colors.voidCard, colors.voidElevated]}
              style={styles.demoCardGradient}
            >
              <Text variant="cardQuestion" color="textPrimary" align="center">
                I prefer deep{'\n'}conversations over{'\n'}small talk
              </Text>
            </LinearGradient>
          </Animated.View>

          {/* Swipe indicators */}
          <View style={styles.swipeIndicators}>
            <Animated.View style={[styles.swipeIndicator, swipeLeftStyle]}>
              <Text variant="h3" color="error">← NO</Text>
            </Animated.View>
            <Animated.View style={[styles.swipeIndicator, swipeRightStyle]}>
              <Text variant="h3" color="success">YES →</Text>
            </Animated.View>
          </View>
        </Animated.View>

        {/* Instructions */}
        <Animated.View entering={FadeInUp.delay(500).duration(400)} style={styles.instructions}>
          <View style={styles.instructionItem}>
            <View style={[styles.instructionIcon, { backgroundColor: colors.success }]}>
              <Text variant="labelSmall" color="white">→</Text>
            </View>
            <View style={styles.instructionText}>
              <Text variant="label" color="textSecondary">Swipe right for YES</Text>
              <Text variant="bodySmall" color="textMuted">This resonates with me</Text>
            </View>
          </View>

          <View style={styles.instructionItem}>
            <View style={[styles.instructionIcon, { backgroundColor: colors.error }]}>
              <Text variant="labelSmall" color="white">←</Text>
            </View>
            <View style={styles.instructionText}>
              <Text variant="label" color="textSecondary">Swipe left for NO</Text>
              <Text variant="bodySmall" color="textMuted">This doesn't fit me</Text>
            </View>
          </View>
        </Animated.View>

        {/* Info */}
        <Animated.View entering={FadeInUp.delay(700).duration(400)} style={styles.infoContainer}>
          <LinearGradient
            colors={[colors.primarySubtle, `${colors.primary}05`]}
            style={styles.infoCard}
          >
            <View style={styles.infoRow}>
              <Text variant="h2" color="primary">{totalCards}</Text>
              <Text variant="body" color="textSecondary">cards</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text variant="h2" color="primary">~5</Text>
              <Text variant="body" color="textSecondary">minutes</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text variant="h2" color="primary">∞</Text>
              <Text variant="body" color="textSecondary">signal</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Explanation */}
        <Animated.View entering={FadeIn.delay(900).duration(400)} style={styles.explanation}>
          <Text variant="bodySmall" color="textMuted" align="center">
            No typing. No explaining. Just instinct.{'\n'}
            Your responses create your unique signal pattern.
          </Text>
        </Animated.View>

        {/* Begin button */}
        <Animated.View
          entering={FadeInUp.delay(1100).duration(400)}
          style={styles.buttonContainer}
        >
          <Button
            title="Begin Pulse"
            onPress={handleBegin}
            variant="primary"
            size="lg"
            fullWidth
          />
        </Animated.View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing['3xl'],
  },
  header: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  title: {
    marginTop: spacing.xs,
  },
  demoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  demoCard: {
    width: SCREEN_WIDTH - 80,
    height: 180,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  demoCardGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.xl,
  },
  swipeIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH - 80,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  swipeIndicator: {},
  instructions: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  instructionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionText: {
    gap: spacing['2xs'],
  },
  infoContainer: {
    marginBottom: spacing.lg,
  },
  infoCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderActive,
  },
  infoRow: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  infoDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  explanation: {
    paddingHorizontal: spacing.lg,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: spacing['4xl'],
    left: 0,
    right: 0,
  },
});

export default PulseIntroScreen;
