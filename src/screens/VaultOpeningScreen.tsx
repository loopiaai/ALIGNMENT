// ALIGNMENT - Vault Opening Screen
// Day 21 - The dramatic reveal sequence begins

import React, { useEffect, useState } from 'react';
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
  FadeOut,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { Text } from '../components/Text';
import { ScreenContainer } from '../components/ScreenContainer';
import { RootStackParamList } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type VaultOpeningScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'VaultOpening'>;
  route: RouteProp<RootStackParamList, 'VaultOpening'>;
};

const stages = [
  { text: 'Day 21', duration: 2000 },
  { text: 'The vault is opening', duration: 2500 },
  { text: '21 days of connection', duration: 2000 },
  { text: 'Now, the reveal', duration: 2000 },
];

export const VaultOpeningScreen: React.FC<VaultOpeningScreenProps> = ({ navigation, route }) => {
  const { connectionId } = route.params;
  const [currentStage, setCurrentStage] = useState(0);

  const textOpacity = useSharedValue(0);
  const lockRotation = useSharedValue(0);
  const lockScale = useSharedValue(1);
  const glowIntensity = useSharedValue(0.2);
  const vaultDoorLeft = useSharedValue(0);
  const vaultDoorRight = useSharedValue(0);

  useEffect(() => {
    // Initial haptic
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    // Text fade animations
    const animateText = () => {
      textOpacity.value = withSequence(
        withTiming(1, { duration: 600 }),
        withDelay(stages[currentStage].duration - 1200, withTiming(0, { duration: 600 }))
      );
    };

    animateText();

    // Progress through stages
    const timer = setTimeout(() => {
      if (currentStage < stages.length - 1) {
        setCurrentStage(prev => prev + 1);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        // Final animation - vault opens
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        lockRotation.value = withSequence(
          withTiming(-15, { duration: 200 }),
          withTiming(15, { duration: 200 }),
          withTiming(0, { duration: 200 })
        );

        lockScale.value = withTiming(0, { duration: 800, easing: Easing.in(Easing.back) });
        
        vaultDoorLeft.value = withDelay(400, withTiming(-SCREEN_WIDTH / 2, { duration: 1000, easing: Easing.out(Easing.cubic) }));
        vaultDoorRight.value = withDelay(400, withTiming(SCREEN_WIDTH / 2, { duration: 1000, easing: Easing.out(Easing.cubic) }));

        glowIntensity.value = withDelay(600, withTiming(1, { duration: 800 }));

        // Navigate to photo reveal
        setTimeout(() => {
          navigation.navigate('PhotoReveal', { connectionId });
        }, 2000);
      }
    }, stages[currentStage].duration);

    // Continuous glow pulse
    glowIntensity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.2, { duration: 1500, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );

    return () => clearTimeout(timer);
  }, [currentStage]);

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const lockStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${lockRotation.value}deg` },
      { scale: lockScale.value },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowIntensity.value,
  }));

  const leftDoorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: vaultDoorLeft.value }],
  }));

  const rightDoorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: vaultDoorRight.value }],
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.voidDeep, colors.void, colors.voidDeep]}
        style={StyleSheet.absoluteFill}
      />

      {/* Glow effect */}
      <Animated.View style={[styles.glow, glowStyle]}>
        <LinearGradient
          colors={[`${colors.resonancePerfect}00`, `${colors.resonancePerfect}40`, `${colors.resonancePerfect}00`]}
          style={styles.glowGradient}
        />
      </Animated.View>

      {/* Vault doors */}
      <Animated.View style={[styles.vaultDoor, styles.vaultDoorLeft, leftDoorStyle]}>
        <LinearGradient
          colors={[colors.voidCard, colors.voidElevated]}
          style={styles.doorGradient}
        />
      </Animated.View>
      <Animated.View style={[styles.vaultDoor, styles.vaultDoorRight, rightDoorStyle]}>
        <LinearGradient
          colors={[colors.voidElevated, colors.voidCard]}
          style={styles.doorGradient}
        />
      </Animated.View>

      {/* Lock icon */}
      <Animated.View style={[styles.lockContainer, lockStyle]}>
        <View style={styles.lockShackle} />
        <View style={styles.lockBody}>
          <View style={styles.keyhole} />
        </View>
      </Animated.View>

      {/* Stage text */}
      <Animated.View style={[styles.textContainer, textStyle]}>
        <Text
          variant={currentStage === 0 ? 'displayLarge' : 'h1'}
          color={currentStage === stages.length - 1 ? 'resonancePerfect' : 'textPrimary'}
          align="center"
        >
          {stages[currentStage].text}
        </Text>
      </Animated.View>

      {/* Progress dots */}
      <View style={styles.progressDots}>
        {stages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index <= currentStage && styles.progressDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.void,
  },
  glow: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  glowGradient: {
    flex: 1,
  },
  vaultDoor: {
    position: 'absolute',
    width: SCREEN_WIDTH / 2 + 10,
    height: SCREEN_HEIGHT,
  },
  vaultDoorLeft: {
    left: 0,
  },
  vaultDoorRight: {
    right: 0,
  },
  doorGradient: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
  },
  lockContainer: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  lockShackle: {
    width: 60,
    height: 45,
    borderWidth: 8,
    borderColor: colors.primary,
    borderBottomWidth: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginBottom: -8,
  },
  lockBody: {
    width: 90,
    height: 70,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyhole: {
    width: 16,
    height: 28,
    backgroundColor: colors.voidCard,
    borderRadius: 8,
  },
  textContainer: {
    position: 'absolute',
    paddingHorizontal: spacing['2xl'],
  },
  progressDots: {
    position: 'absolute',
    bottom: spacing['5xl'],
    flexDirection: 'row',
    gap: spacing.sm,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.voidElevated,
  },
  progressDotActive: {
    backgroundColor: colors.resonancePerfect,
  },
});

export default VaultOpeningScreen;
