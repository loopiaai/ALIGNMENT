// ALIGNMENT - Photo Reveal Screen
// The moment of visual revelation

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
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
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { ScreenContainer } from '../components/ScreenContainer';
import { RootStackParamList } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type PhotoRevealScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PhotoReveal'>;
  route: RouteProp<RootStackParamList, 'PhotoReveal'>;
};

export const PhotoRevealScreen: React.FC<PhotoRevealScreenProps> = ({ navigation, route }) => {
  const { connectionId } = route.params;
  const [isRevealed, setIsRevealed] = useState(false);

  const blurIntensity = useSharedValue(100);
  const photoScale = useSharedValue(0.8);
  const photoOpacity = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  const frameOpacity = useSharedValue(0);

  useEffect(() => {
    // Initial animation
    photoOpacity.value = withTiming(1, { duration: 800 });
    photoScale.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.back) });
    frameOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));

    // Haptic
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }, []);

  const handleReveal = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsRevealed(true);

    // Unblur animation
    blurIntensity.value = withTiming(0, { duration: 2000, easing: Easing.out(Easing.cubic) });
    glowOpacity.value = withSequence(
      withTiming(0.8, { duration: 1000 }),
      withTiming(0.3, { duration: 1000 })
    );

    // Navigate after reveal
    setTimeout(() => {
      navigation.navigate('NameReveal', { connectionId });
    }, 3500);
  };

  const photoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: photoScale.value }],
    opacity: photoOpacity.value,
  }));

  const frameStyle = useAnimatedStyle(() => ({
    opacity: frameOpacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <ScreenContainer gradient gradientColors={[colors.voidDeep, colors.void, colors.voidDeep]}>
      <View style={styles.container}>
        {/* Header */}
        <Animated.View entering={FadeInUp.delay(200).duration(400)} style={styles.header}>
          <Text variant="labelSmall" color="resonancePerfect">
            DAY 21 • THE REVEAL
          </Text>
          <Text variant="h2" color="textPrimary" align="center">
            Their face
          </Text>
        </Animated.View>

        {/* Photo container */}
        <View style={styles.photoContainer}>
          {/* Glow effect */}
          <Animated.View style={[styles.glow, glowStyle]}>
            <LinearGradient
              colors={[`${colors.resonancePerfect}00`, `${colors.resonancePerfect}40`, `${colors.resonancePerfect}00`]}
              style={styles.glowGradient}
            />
          </Animated.View>

          {/* Photo frame */}
          <Animated.View style={[styles.photoFrame, frameStyle]}>
            <LinearGradient
              colors={colors.gradientReveal as [string, string, ...string[]]}
              style={styles.frameGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>

          {/* Photo */}
          <Animated.View style={[styles.photo, photoStyle]}>
            {/* Placeholder silhouette */}
            <LinearGradient
              colors={[colors.voidCard, colors.voidElevated]}
              style={styles.photoPlaceholder}
            >
              <View style={styles.silhouetteHead} />
              <View style={styles.silhouetteBody} />
            </LinearGradient>

            {/* Blur overlay - would be actual image in production */}
            {!isRevealed && (
              <BlurView
                intensity={50}
                style={styles.blurOverlay}
                tint="dark"
              />
            )}
          </Animated.View>
        </View>

        {/* Connection summary */}
        <Animated.View entering={FadeInUp.delay(600).duration(400)} style={styles.summaryContainer}>
          <LinearGradient
            colors={[colors.voidCard, colors.voidElevated]}
            style={styles.summaryCard}
          >
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text variant="h3" color="primary">21</Text>
                <Text variant="labelSmall" color="textMuted">DAYS</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text variant="h3" color="accent">92%</Text>
                <Text variant="labelSmall" color="textMuted">RESONANCE</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text variant="h3" color="secondary">∞</Text>
                <Text variant="labelSmall" color="textMuted">SHARED</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Quote */}
        <Animated.View entering={FadeIn.delay(800).duration(400)} style={styles.quoteContainer}>
          <Text variant="bodySmall" color="textMuted" align="center" style={styles.quote}>
            "You knew them before you saw them.{'\n'}That's the protocol."
          </Text>
        </Animated.View>

        {/* Reveal button */}
        {!isRevealed && (
          <Animated.View
            entering={FadeInUp.delay(1000).duration(400)}
            style={styles.buttonContainer}
          >
            <Button
              title="Reveal Photo"
              onPress={handleReveal}
              variant="primary"
              size="lg"
              fullWidth
            />
          </Animated.View>
        )}

        {isRevealed && (
          <Animated.View
            entering={FadeIn.duration(400)}
            style={styles.revealedText}
          >
            <Text variant="label" color="resonancePerfect" align="center">
              Revealing...
            </Text>
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
    marginBottom: spacing.xl,
  },
  photoContainer: {
    width: 260,
    height: 340,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  glow: {
    position: 'absolute',
    width: 320,
    height: 400,
  },
  glowGradient: {
    flex: 1,
    borderRadius: borderRadius['2xl'],
  },
  photoFrame: {
    position: 'absolute',
    width: 268,
    height: 348,
    borderRadius: borderRadius['2xl'] + 4,
    padding: 4,
  },
  frameGradient: {
    flex: 1,
    borderRadius: borderRadius['2xl'],
  },
  photo: {
    width: 260,
    height: 340,
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
  },
  photoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  silhouetteHead: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.voidSurface,
    marginBottom: spacing.md,
  },
  silhouetteBody: {
    width: 120,
    height: 100,
    backgroundColor: colors.voidSurface,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  summaryContainer: {
    width: SCREEN_WIDTH - 48,
    marginBottom: spacing.xl,
  },
  summaryCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
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
  revealedText: {
    position: 'absolute',
    bottom: spacing['5xl'],
  },
});

export default PhotoRevealScreen;
