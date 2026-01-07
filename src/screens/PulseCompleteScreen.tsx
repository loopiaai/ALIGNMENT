// ALIGNMENT - Pulse Complete Screen
// "Your signal has been captured"

import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
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
import { GlowOrb } from '../components/GlowOrb';
import { RootStackParamList } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type PulseCompleteScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PulseComplete'>;
};

export const PulseCompleteScreen: React.FC<PulseCompleteScreenProps> = ({ navigation }) => {
  const checkScale = useSharedValue(0);
  const ringScale = useSharedValue(0);
  const ringOpacity = useSharedValue(1);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Check mark animation
    checkScale.value = withDelay(
      300,
      withSequence(
        withTiming(1.2, { duration: 300, easing: Easing.out(Easing.back) }),
        withTiming(1, { duration: 150 })
      )
    );

    // Ring pulse animation
    ringScale.value = withDelay(
      500,
      withRepeat(
        withSequence(
          withTiming(1.5, { duration: 1000 }),
          withTiming(1, { duration: 0 })
        ),
        -1,
        false
      )
    );

    ringOpacity.value = withDelay(
      500,
      withRepeat(
        withSequence(
          withTiming(0, { duration: 1000 }),
          withTiming(1, { duration: 0 })
        ),
        -1,
        false
      )
    );
  }, []);

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    navigation.navigate('Calibrating');
  };

  return (
    <ScreenContainer gradient gradientColors={[colors.voidDeep, colors.void, colors.voidSurface]}>
      <View style={styles.container}>
        {/* Success visualization */}
        <View style={styles.visualContainer}>
          <GlowOrb
            size={180}
            color={colors.success}
            intensity="high"
            speed="slow"
          />

          {/* Pulsing ring */}
          <Animated.View style={[styles.ring, ringStyle]}>
            <View style={styles.ringInner} />
          </Animated.View>

          {/* Check mark */}
          <Animated.View style={[styles.checkContainer, checkStyle]}>
            <LinearGradient
              colors={colors.gradientSuccess as [string, string, ...string[]]}
              style={styles.checkCircle}
            >
              <Text variant="displaySmall" color="white">✓</Text>
            </LinearGradient>
          </Animated.View>
        </View>

        {/* Content */}
        <Animated.View entering={FadeInUp.delay(600).duration(400)} style={styles.content}>
          <Text variant="labelSmall" color="success">
            PULSE COMPLETE
          </Text>
          <Text variant="h1" color="textPrimary" align="center" style={styles.title}>
            Your signal has{'\n'}been captured
          </Text>
          <Text variant="bodyLarge" color="textTertiary" align="center" style={styles.description}>
            50 decisions in 5 minutes.{'\n'}
            More signal than most apps get in months.
          </Text>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInUp.delay(800).duration(400)} style={styles.statsContainer}>
          <LinearGradient
            colors={[colors.voidCard, colors.voidElevated]}
            style={styles.statsCard}
          >
            <View style={styles.statItem}>
              <Text variant="h2" color="primary">50</Text>
              <Text variant="labelSmall" color="textMuted">RESPONSES</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text variant="h2" color="accent">3</Text>
              <Text variant="labelSmall" color="textMuted">LEVELS</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text variant="h2" color="secondary">∞</Text>
              <Text variant="labelSmall" color="textMuted">INSIGHTS</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* What happens next */}
        <Animated.View entering={FadeIn.delay(1000).duration(400)} style={styles.nextContainer}>
          <Text variant="labelSmall" color="textTertiary" style={styles.nextTitle}>
            WHAT HAPPENS NEXT
          </Text>
          <Text variant="body" color="textMuted" align="center">
            Our AI is now building your psychological fingerprint.{'\n'}
            This powers everything: matching, conversation, connection.
          </Text>
        </Animated.View>

        {/* Continue button */}
        <Animated.View
          entering={FadeInUp.delay(1200).duration(400)}
          style={styles.buttonContainer}
        >
          <Button
            title="See My Signal"
            onPress={handleContinue}
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
    alignItems: 'center',
    paddingTop: spacing['3xl'],
  },
  visualContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  ring: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: colors.success,
  },
  ringInner: {},
  checkContainer: {
    position: 'absolute',
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  title: {
    marginTop: spacing.sm,
  },
  description: {
    marginTop: spacing.sm,
  },
  statsContainer: {
    width: SCREEN_WIDTH - 48,
    marginBottom: spacing.xl,
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
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
  nextContainer: {
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  nextTitle: {
    letterSpacing: 2,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: spacing['4xl'],
    left: spacing.xl,
    right: spacing.xl,
  },
});

export default PulseCompleteScreen;
