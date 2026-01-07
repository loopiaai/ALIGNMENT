// ALIGNMENT - Philosophy Screen
// The promise: Private. Intentional. No performance.

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  FadeIn,
  FadeInUp,
  FadeOut,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { RootStackParamList } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type PhilosophyScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Philosophy'>;
};

const philosophyStatements = [
  {
    title: 'No faces.',
    body: 'You will not be judged by how you look. Neither will they.',
  },
  {
    title: 'No bios.',
    body: 'No performance. No self-marketing. Just authentic responses.',
  },
  {
    title: 'No competition.',
    body: 'One connection at a time. Quality over quantity.',
  },
  {
    title: 'Daily choice.',
    body: 'Every day, you both decide to continue. Or you don\'t.',
  },
  {
    title: 'Clean endings.',
    body: 'No ghosting. No ambiguity. Dignity preserved.',
  },
];

export const PhilosophyScreen: React.FC<PhilosophyScreenProps> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showContinue, setShowContinue] = useState(false);

  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    // Animate in current statement
    textOpacity.value = withTiming(1, { duration: 600 });
    textTranslateY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) });
    
    // Update progress
    progressWidth.value = withTiming(((currentIndex + 1) / philosophyStatements.length) * 100, {
      duration: 400,
    });

    // Track all timer IDs for cleanup
    const timerIds: NodeJS.Timeout[] = [];

    // Auto-advance or show continue
    const timer = setTimeout(() => {
      if (currentIndex < philosophyStatements.length - 1) {
        // Animate out
        textOpacity.value = withTiming(0, { duration: 300 });
        textTranslateY.value = withTiming(-20, { duration: 300 });
        
        const innerTimer = setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
          textTranslateY.value = 20;
        }, 300);
        timerIds.push(innerTimer);
      } else {
        setShowContinue(true);
      }
    }, 2500);
    timerIds.push(timer);

    return () => {
      timerIds.forEach(id => clearTimeout(id));
    };
  }, [currentIndex]);

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('AgeGate');
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('AgeGate');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.voidDeep, colors.void, colors.voidSurface]}
        style={StyleSheet.absoluteFill}
      />

      {/* Skip button */}
      <Animated.View entering={FadeIn.delay(1000).duration(400)} style={styles.skipContainer}>
        <Button
          title="Skip"
          onPress={handleSkip}
          variant="ghost"
          size="sm"
          haptic={false}
        />
      </Animated.View>

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
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Animated.View style={[styles.statementContainer, textStyle]}>
          <Text variant="displaySmall" color="textPrimary" align="center">
            {philosophyStatements[currentIndex].title}
          </Text>
          <Text variant="bodyLarge" color="textSecondary" align="center" style={styles.body}>
            {philosophyStatements[currentIndex].body}
          </Text>
        </Animated.View>
      </View>

      {/* Continue button */}
      {showContinue && (
        <Animated.View
          entering={FadeInUp.duration(400)}
          style={styles.continueContainer}
        >
          <Button
            title="I Understand"
            onPress={handleContinue}
            variant="primary"
            size="lg"
            fullWidth
          />
          <Text variant="bodySmall" color="textMuted" align="center" style={styles.hint}>
            This is not a dating app.{'\n'}It's a connection protocol.
          </Text>
        </Animated.View>
      )}

      {/* Dots indicator */}
      <View style={styles.dotsContainer}>
        {philosophyStatements.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex && styles.dotActive,
              index < currentIndex && styles.dotCompleted,
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
    backgroundColor: colors.void,
  },
  skipContainer: {
    position: 'absolute',
    top: spacing['4xl'],
    right: spacing.xl,
    zIndex: 10,
  },
  progressContainer: {
    position: 'absolute',
    top: spacing['4xl'] + 50,
    left: spacing.xl,
    right: spacing.xl,
  },
  progressTrack: {
    height: 2,
    backgroundColor: colors.voidElevated,
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing['2xl'],
  },
  statementContainer: {
    alignItems: 'center',
    gap: spacing.xl,
  },
  body: {
    maxWidth: 300,
  },
  continueContainer: {
    position: 'absolute',
    bottom: spacing['5xl'],
    left: spacing.xl,
    right: spacing.xl,
    gap: spacing.lg,
  },
  hint: {
    marginTop: spacing.sm,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: spacing['3xl'],
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.voidElevated,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  dotCompleted: {
    backgroundColor: colors.primaryMuted,
  },
});

export default PhilosophyScreen;
