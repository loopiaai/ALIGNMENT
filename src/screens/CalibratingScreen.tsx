// ALIGNMENT - Calibrating Screen
// AI processing visual - dramatic reveal of signal processing

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
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { Text } from '../components/Text';
import { ScreenContainer } from '../components/ScreenContainer';
import { RootStackParamList } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type CalibratingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Calibrating'>;
};

const processingSteps = [
  { label: 'Analyzing responses', duration: 1500 },
  { label: 'Mapping values', duration: 1200 },
  { label: 'Detecting patterns', duration: 1400 },
  { label: 'Building profile', duration: 1600 },
  { label: 'Calibrating matches', duration: 1300 },
];

export const CalibratingScreen: React.FC<CalibratingScreenProps> = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const orbScale = useSharedValue(1);
  const orbRotation = useSharedValue(0);
  const progressWidth = useSharedValue(0);
  const particleOpacity = useSharedValue(0);

  useEffect(() => {
    // Orb animations
    orbScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );

    orbRotation.value = withRepeat(
      withTiming(360, { duration: 8000, easing: Easing.linear }),
      -1,
      false
    );

    particleOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 500 }),
        withTiming(0.3, { duration: 500 })
      ),
      -1,
      false
    );

    // Track all timer IDs for cleanup
    const timerIds: NodeJS.Timeout[] = [];

    // Progress through steps
    let totalDuration = 0;
    processingSteps.forEach((step, index) => {
      const stepTimer = setTimeout(() => {
        setCurrentStep(index);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        progressWidth.value = withTiming(((index + 1) / processingSteps.length) * 100, {
          duration: step.duration * 0.8,
        });
      }, totalDuration);
      timerIds.push(stepTimer);
      totalDuration += step.duration;
    });

    // Complete and navigate
    const completeTimer = setTimeout(() => {
      setIsComplete(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const navTimer = setTimeout(() => {
        navigation.navigate('Main');
      }, 1500);
      timerIds.push(navTimer);
    }, totalDuration + 500);
    timerIds.push(completeTimer);

    return () => {
      timerIds.forEach(id => clearTimeout(id));
    };
  }, []);

  const orbStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: orbScale.value },
      { rotate: `${orbRotation.value}deg` },
    ],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const particleStyle = useAnimatedStyle(() => ({
    opacity: particleOpacity.value,
  }));

  return (
    <ScreenContainer gradient gradientColors={[colors.voidDeep, colors.void, colors.voidDeep]}>
      <View style={styles.container}>
        {/* Processing visualization */}
        <View style={styles.visualContainer}>
          {/* Outer ring particles */}
          {[...Array(8)].map((_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.particle,
                particleStyle,
                {
                  transform: [
                    { rotate: `${i * 45}deg` },
                    { translateY: -100 },
                  ],
                },
              ]}
            >
              <View style={[styles.particleDot, { backgroundColor: colors.primary }]} />
            </Animated.View>
          ))}

          {/* Main orb */}
          <Animated.View style={[styles.orbContainer, orbStyle]}>
            <LinearGradient
              colors={[`${colors.primary}40`, `${colors.secondary}20`, `${colors.accent}10`]}
              style={styles.orb}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={styles.orbCore}>
              <LinearGradient
                colors={colors.gradientPrimary as [string, string, ...string[]]}
                style={styles.orbCoreGradient}
              />
            </View>
          </Animated.View>

          {/* Inner rings */}
          <View style={styles.ring1} />
          <View style={styles.ring2} />
        </View>

        {/* Status text */}
        <View style={styles.statusContainer}>
          {!isComplete ? (
            <Animated.View
              key={currentStep}
              entering={FadeIn.duration(300)}
              exiting={FadeOut.duration(200)}
              style={styles.statusContent}
            >
              <Text variant="labelSmall" color="primary">
                {processingSteps[currentStep]?.label.toUpperCase()}
              </Text>
              <View style={styles.dotsContainer}>
                <Animated.View style={[styles.loadingDot, { animationDelay: '0ms' }]} />
                <Animated.View style={[styles.loadingDot, { animationDelay: '200ms' }]} />
                <Animated.View style={[styles.loadingDot, { animationDelay: '400ms' }]} />
              </View>
            </Animated.View>
          ) : (
            <Animated.View entering={FadeIn.duration(400)} style={styles.statusContent}>
              <Text variant="h2" color="success">
                Calibration Complete
              </Text>
            </Animated.View>
          )}
        </View>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, progressStyle]}>
              <LinearGradient
                colors={colors.gradientPrimary as [string, string, ...string[]]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </Animated.View>
          </View>
          <View style={styles.stepIndicators}>
            {processingSteps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.stepDot,
                  index <= currentStep && styles.stepDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Footer message */}
        <Animated.View entering={FadeInUp.delay(500).duration(400)} style={styles.footer}>
          <Text variant="bodySmall" color="textMuted" align="center">
            Your unique psychological fingerprint{'\n'}
            is being mapped across 50+ dimensions
          </Text>
        </Animated.View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visualContainer: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  particle: {
    position: 'absolute',
  },
  particleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  orbContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orb: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 60,
  },
  orbCore: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  orbCoreGradient: {
    flex: 1,
  },
  ring1: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
  },
  ring2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: `${colors.primary}15`,
  },
  statusContainer: {
    height: 60,
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  statusContent: {
    alignItems: 'center',
    gap: spacing.md,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  loadingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  progressContainer: {
    width: SCREEN_WIDTH - 80,
    gap: spacing.md,
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
  stepIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.voidElevated,
  },
  stepDotActive: {
    backgroundColor: colors.primary,
  },
  footer: {
    position: 'absolute',
    bottom: spacing['5xl'],
    paddingHorizontal: spacing.xl,
  },
});

export default CalibratingScreen;
