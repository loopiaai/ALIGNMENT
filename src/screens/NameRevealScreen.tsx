// ALIGNMENT - Name Reveal Screen
// Real identity revealed

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
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { ScreenContainer } from '../components/ScreenContainer';
import { RootStackParamList } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type NameRevealScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'NameReveal'>;
  route: RouteProp<RootStackParamList, 'NameReveal'>;
};

export const NameRevealScreen: React.FC<NameRevealScreenProps> = ({ navigation, route }) => {
  const { connectionId } = route.params;
  const [showName, setShowName] = useState(false);

  const aliasOpacity = useSharedValue(1);
  const aliasScale = useSharedValue(1);
  const nameOpacity = useSharedValue(0);
  const nameScale = useSharedValue(0.8);
  const glowOpacity = useSharedValue(0);
  const lineWidth = useSharedValue(0);

  useEffect(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    // Show alias first
    setTimeout(() => {
      // Transition to real name
      aliasOpacity.value = withTiming(0, { duration: 800 });
      aliasScale.value = withTiming(0.8, { duration: 800 });
      
      lineWidth.value = withDelay(400, withTiming(100, { duration: 600 }));
      
      setTimeout(() => {
        setShowName(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        nameOpacity.value = withTiming(1, { duration: 800 });
        nameScale.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.back) });
        glowOpacity.value = withSequence(
          withTiming(0.6, { duration: 800 }),
          withTiming(0.3, { duration: 800 })
        );
      }, 1000);
    }, 2000);
  }, []);

  const aliasStyle = useAnimatedStyle(() => ({
    opacity: aliasOpacity.value,
    transform: [{ scale: aliasScale.value }],
  }));

  const nameStyle = useAnimatedStyle(() => ({
    opacity: nameOpacity.value,
    transform: [{ scale: nameScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const lineStyle = useAnimatedStyle(() => ({
    width: `${lineWidth.value}%`,
  }));

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('ArchitectExit', { connectionId });
  };

  return (
    <ScreenContainer gradient gradientColors={[colors.voidDeep, colors.void, colors.voidDeep]}>
      <View style={styles.container}>
        {/* Header */}
        <Animated.View entering={FadeInUp.delay(200).duration(400)} style={styles.header}>
          <Text variant="labelSmall" color="resonancePerfect">
            DAY 21 • THE REVEAL
          </Text>
          <Text variant="h2" color="textPrimary" align="center">
            Their name
          </Text>
        </Animated.View>

        {/* Name reveal area */}
        <View style={styles.nameContainer}>
          {/* Glow */}
          <Animated.View style={[styles.glow, glowStyle]}>
            <LinearGradient
              colors={[`${colors.resonancePerfect}00`, `${colors.resonancePerfect}30`, `${colors.resonancePerfect}00`]}
              style={styles.glowGradient}
            />
          </Animated.View>

          {/* Alias (fading out) */}
          {!showName && (
            <Animated.View style={[styles.nameDisplay, aliasStyle]}>
              <Text variant="labelSmall" color="textMuted">
                KNOWN AS
              </Text>
              <Text variant="displayMedium" color="textSecondary" align="center">
                Thoughtful Soul
              </Text>
            </Animated.View>
          )}

          {/* Transition line */}
          <Animated.View style={[styles.transitionLine, lineStyle]}>
            <LinearGradient
              colors={colors.gradientReveal as [string, string, ...string[]]}
              style={styles.lineGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </Animated.View>

          {/* Real name (fading in) */}
          {showName && (
            <Animated.View style={[styles.nameDisplay, nameStyle]}>
              <Text variant="labelSmall" color="resonancePerfect">
                REAL NAME
              </Text>
              <Text variant="displayLarge" color="textPrimary" align="center">
                Sarah
              </Text>
            </Animated.View>
          )}
        </View>

        {/* Journey summary */}
        <Animated.View entering={FadeInUp.delay(600).duration(400)} style={styles.journeyContainer}>
          <LinearGradient
            colors={[colors.voidCard, colors.voidElevated]}
            style={styles.journeyCard}
          >
            <Text variant="labelSmall" color="textTertiary" style={styles.journeyTitle}>
              YOUR JOURNEY
            </Text>
            <View style={styles.journeyTimeline}>
              <View style={styles.journeyItem}>
                <View style={[styles.journeyDot, { backgroundColor: colors.secondary }]} />
                <Text variant="bodySmall" color="textMuted">Day 1: First words</Text>
              </View>
              <View style={styles.journeyItem}>
                <View style={[styles.journeyDot, { backgroundColor: colors.primary }]} />
                <Text variant="bodySmall" color="textMuted">Day 6: Voice unlocked</Text>
              </View>
              <View style={styles.journeyItem}>
                <View style={[styles.journeyDot, { backgroundColor: colors.accent }]} />
                <Text variant="bodySmall" color="textMuted">Day 15: Deeper connection</Text>
              </View>
              <View style={styles.journeyItem}>
                <View style={[styles.journeyDot, { backgroundColor: colors.resonancePerfect }]} />
                <Text variant="bodySmall" color="textMuted">Day 21: The reveal</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Quote */}
        <Animated.View entering={FadeIn.delay(800).duration(400)} style={styles.quoteContainer}>
          <Text variant="bodySmall" color="textMuted" align="center" style={styles.quote}>
            "A name is just a word.{'\n'}You already know who they are."
          </Text>
        </Animated.View>

        {/* Continue button */}
        {showName && (
          <Animated.View
            entering={FadeInUp.duration(400)}
            style={styles.buttonContainer}
          >
            <Button
              title="Continue"
              onPress={handleContinue}
              variant="primary"
              size="lg"
              fullWidth
            />
          </Animated.View>
        )}
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
  header: {
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing['3xl'],
  },
  nameContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  glow: {
    position: 'absolute',
    width: 300,
    height: 200,
  },
  glowGradient: {
    flex: 1,
    borderRadius: 100,
  },
  nameDisplay: {
    alignItems: 'center',
    gap: spacing.md,
  },
  transitionLine: {
    position: 'absolute',
    height: 2,
    borderRadius: 1,
    overflow: 'hidden',
  },
  lineGradient: {
    flex: 1,
  },
  journeyContainer: {
    width: SCREEN_WIDTH - 48,
    marginBottom: spacing.xl,
  },
  journeyCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  journeyTitle: {
    marginBottom: spacing.md,
    letterSpacing: 2,
  },
  journeyTimeline: {
    gap: spacing.sm,
  },
  journeyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  journeyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  quoteContainer: {
    paddingHorizontal: spacing['2xl'],
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

export default NameRevealScreen;
