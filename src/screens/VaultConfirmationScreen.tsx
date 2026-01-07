// ALIGNMENT - Vault Confirmation Screen
// Photo sealed until Day 21

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
import { RootStackParamList } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type VaultConfirmationScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'VaultConfirmation'>;
};

export const VaultConfirmationScreen: React.FC<VaultConfirmationScreenProps> = ({ navigation }) => {
  const lockScale = useSharedValue(0);
  const lockRotate = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    // Entrance animation
    lockScale.value = withDelay(
      300,
      withSequence(
        withTiming(1.2, { duration: 400, easing: Easing.out(Easing.back) }),
        withTiming(1, { duration: 200 })
      )
    );

    lockRotate.value = withDelay(
      300,
      withSequence(
        withTiming(-10, { duration: 100 }),
        withTiming(10, { duration: 100 }),
        withTiming(0, { duration: 100 })
      )
    );

    glowOpacity.value = withDelay(700, withTiming(1, { duration: 600 }));

    // Continuous pulse
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const lockStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: lockScale.value },
      { rotate: `${lockRotate.value}deg` },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: pulseScale.value }],
  }));

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    navigation.navigate('PulseIntro');
  };

  return (
    <ScreenContainer gradient gradientColors={[colors.voidDeep, colors.void, colors.voidSurface]}>
      <View style={styles.container}>
        {/* Vault visualization */}
        <View style={styles.vaultContainer}>
          {/* Glow effect */}
          <Animated.View style={[styles.glow, glowStyle]}>
            <LinearGradient
              colors={[`${colors.primary}00`, `${colors.primary}30`, `${colors.primary}00`]}
              style={styles.glowGradient}
            />
          </Animated.View>

          {/* Lock icon */}
          <Animated.View style={[styles.lockContainer, lockStyle]}>
            <LinearGradient
              colors={[colors.voidCard, colors.voidElevated]}
              style={styles.lockOuter}
            >
              <View style={styles.lockShackle}>
                <View style={styles.shackleInner} />
              </View>
              <View style={styles.lockBody}>
                <View style={styles.keyhole} />
              </View>
            </LinearGradient>
          </Animated.View>
        </View>

        {/* Content */}
        <Animated.View entering={FadeInUp.delay(800).duration(400)} style={styles.content}>
          <Text variant="h1" color="textPrimary" align="center">
            Your photo is sealed
          </Text>
          <Text variant="bodyLarge" color="textTertiary" align="center" style={styles.description}>
            It will remain hidden until Day 21 of a connection — when both of you choose to reveal.
          </Text>
        </Animated.View>

        {/* Info cards */}
        <Animated.View entering={FadeInUp.delay(1000).duration(400)} style={styles.infoContainer}>
          <LinearGradient
            colors={[colors.voidCard, colors.voidElevated]}
            style={styles.infoCard}
          >
            <View style={styles.infoRow}>
              <View style={[styles.infoDot, { backgroundColor: colors.success }]} />
              <Text variant="body" color="textSecondary">
                Verified & Real
              </Text>
            </View>
            <View style={styles.infoRow}>
              <View style={[styles.infoDot, { backgroundColor: colors.primary }]} />
              <Text variant="body" color="textSecondary">
                Sealed in Vault
              </Text>
            </View>
            <View style={styles.infoRow}>
              <View style={[styles.infoDot, { backgroundColor: colors.accent }]} />
              <Text variant="body" color="textSecondary">
                Revealed on Day 21
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Quote */}
        <Animated.View entering={FadeIn.delay(1200).duration(400)} style={styles.quoteContainer}>
          <Text variant="bodySmall" color="textMuted" align="center" style={styles.quote}>
            "Connection before attraction.{'\n'}Substance before surface."
          </Text>
        </Animated.View>

        {/* Continue button */}
        <Animated.View
          entering={FadeInUp.delay(1400).duration(400)}
          style={styles.buttonContainer}
        >
          <Button
            title="Begin the Protocol"
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
    paddingTop: spacing['4xl'],
    alignItems: 'center',
  },
  vaultContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  glow: {
    position: 'absolute',
    width: 250,
    height: 250,
  },
  glowGradient: {
    flex: 1,
    borderRadius: 125,
  },
  lockContainer: {
    width: 120,
    height: 140,
  },
  lockOuter: {
    flex: 1,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  lockShackle: {
    width: 50,
    height: 40,
    borderWidth: 6,
    borderColor: colors.primary,
    borderBottomWidth: 0,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginBottom: -6,
  },
  shackleInner: {
    flex: 1,
    backgroundColor: colors.voidCard,
    borderTopLeftRadius: 19,
    borderTopRightRadius: 19,
    margin: 6,
    marginBottom: 0,
  },
  lockBody: {
    width: 80,
    height: 60,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyhole: {
    width: 12,
    height: 20,
    backgroundColor: colors.voidCard,
    borderRadius: 6,
  },
  content: {
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
    marginBottom: spacing['2xl'],
  },
  description: {
    maxWidth: 300,
  },
  infoContainer: {
    width: SCREEN_WIDTH - 48,
    marginBottom: spacing.xl,
  },
  infoCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  infoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  quoteContainer: {
    paddingHorizontal: spacing['2xl'],
    marginBottom: spacing.xl,
  },
  quote: {
    fontStyle: 'italic',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: spacing['4xl'],
    left: spacing.xl,
    right: spacing.xl,
  },
});

export default VaultConfirmationScreen;
