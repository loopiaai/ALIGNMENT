// ALIGNMENT - Architect Exit Screen
// The AI releases control - connection continues off-app

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
import { RouteProp } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { ScreenContainer } from '../components/ScreenContainer';
import { RootStackParamList } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ArchitectExitScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ArchitectExit'>;
  route: RouteProp<RootStackParamList, 'ArchitectExit'>;
};

export const ArchitectExitScreen: React.FC<ArchitectExitScreenProps> = ({ navigation, route }) => {
  const { connectionId } = route.params;

  const orbScale = useSharedValue(1);
  const orbOpacity = useSharedValue(1);
  const glowOpacity = useSharedValue(0.5);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    // Orb fading animation
    orbScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      3,
      false
    );

    // After animation, fade out
    setTimeout(() => {
      orbOpacity.value = withTiming(0.3, { duration: 2000 });
      glowOpacity.value = withTiming(0.1, { duration: 2000 });
      textOpacity.value = withDelay(1000, withTiming(1, { duration: 800 }));
    }, 4000);
  }, []);

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: orbScale.value }],
    opacity: orbOpacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const exitTextStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const handleFeedback = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('PostFeedback', { connectionId });
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Main');
  };

  return (
    <ScreenContainer gradient gradientColors={[colors.voidDeep, colors.void, colors.voidDeep]}>
      <View style={styles.container}>
        {/* Header */}
        <Animated.View entering={FadeInUp.delay(200).duration(400)} style={styles.header}>
          <Text variant="labelSmall" color="primary">
            THE ARCHITECT
          </Text>
        </Animated.View>

        {/* Architect orb (fading) */}
        <View style={styles.orbContainer}>
          <Animated.View style={[styles.glow, glowStyle]}>
            <LinearGradient
              colors={[`${colors.primary}00`, `${colors.primary}30`, `${colors.primary}00`]}
              style={styles.glowGradient}
            />
          </Animated.View>

          <Animated.View style={[styles.orb, orbStyle]}>
            <LinearGradient
              colors={[`${colors.primary}40`, `${colors.secondary}20`]}
              style={styles.orbGradient}
            />
            <View style={styles.orbCore}>
              <Text variant="h3" color="primary">✦</Text>
            </View>
          </Animated.View>
        </View>

        {/* Exit message */}
        <Animated.View style={[styles.exitMessage, exitTextStyle]}>
          <Text variant="h1" color="textPrimary" align="center">
            The system{'\n'}releases you
          </Text>
        </Animated.View>

        {/* Content */}
        <Animated.View entering={FadeInUp.delay(600).duration(400)} style={styles.content}>
          <Text variant="bodyLarge" color="textTertiary" align="center">
            21 days of guided connection.{'\n'}
            Now it's just the two of you.
          </Text>
        </Animated.View>

        {/* What happens next */}
        <Animated.View entering={FadeInUp.delay(800).duration(400)} style={styles.nextContainer}>
          <LinearGradient
            colors={[colors.voidCard, colors.voidElevated]}
            style={styles.nextCard}
          >
            <Text variant="labelSmall" color="textTertiary" style={styles.nextTitle}>
              WHAT HAPPENS NOW
            </Text>
            <View style={styles.nextList}>
              <View style={styles.nextItem}>
                <View style={[styles.nextDot, { backgroundColor: colors.success }]} />
                <Text variant="body" color="textSecondary">
                  Exchange contact information
                </Text>
              </View>
              <View style={styles.nextItem}>
                <View style={[styles.nextDot, { backgroundColor: colors.primary }]} />
                <Text variant="body" color="textSecondary">
                  Continue your conversation
                </Text>
              </View>
              <View style={styles.nextItem}>
                <View style={[styles.nextDot, { backgroundColor: colors.accent }]} />
                <Text variant="body" color="textSecondary">
                  Meet in the real world
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Quote */}
        <Animated.View entering={FadeIn.delay(1000).duration(400)} style={styles.quoteContainer}>
          <Text variant="bodySmall" color="textMuted" align="center" style={styles.quote}>
            "The protocol ends.{'\n'}The connection continues."
          </Text>
        </Animated.View>

        {/* Actions */}
        <Animated.View
          entering={FadeInUp.delay(1200).duration(400)}
          style={styles.buttonContainer}
        >
          <Button
            title="Give Feedback"
            onPress={handleFeedback}
            variant="primary"
            size="lg"
            fullWidth
          />
          <Button
            title="Skip"
            onPress={handleSkip}
            variant="ghost"
            size="md"
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
  header: {
    marginBottom: spacing.xl,
  },
  orbContainer: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  glow: {
    position: 'absolute',
    width: 200,
    height: 200,
  },
  glowGradient: {
    flex: 1,
    borderRadius: 100,
  },
  orb: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  orbGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  orbCore: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.voidCard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitMessage: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  content: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  nextContainer: {
    width: SCREEN_WIDTH - 48,
    marginBottom: spacing.xl,
  },
  nextCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  nextTitle: {
    marginBottom: spacing.md,
    letterSpacing: 2,
  },
  nextList: {
    gap: spacing.md,
  },
  nextItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  nextDot: {
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
    gap: spacing.md,
  },
});

export default ArchitectExitScreen;
