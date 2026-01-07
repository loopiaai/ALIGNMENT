// ALIGNMENT - Splash Screen
// Hypnotic entry point - dark void with pulsing orb

import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  withDelay,
  withRepeat,
  Easing,
  FadeIn,
  FadeInUp,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { Text } from '../components/Text';
import { GlowOrb } from '../components/GlowOrb';
import { RootStackParamList } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type SplashScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
};

export const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const taglineOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);
  const breatheAnim = useSharedValue(1);

  useEffect(() => {
    // Entrance animation sequence
    logoOpacity.value = withDelay(500, withTiming(1, { duration: 1000 }));
    logoScale.value = withDelay(500, withTiming(1, { duration: 1000, easing: Easing.out(Easing.back) }));
    taglineOpacity.value = withDelay(1500, withTiming(1, { duration: 800 }));
    buttonOpacity.value = withDelay(2500, withTiming(1, { duration: 800 }));

    // Continuous breathing animation
    breatheAnim.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value * breatheAnim.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  const handleEnter = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    navigation.navigate('Philosophy');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.voidDeep, colors.void, colors.voidDeep]}
        style={StyleSheet.absoluteFill}
      />

      {/* Ambient glow orb */}
      <View style={styles.orbContainer}>
        <GlowOrb
          size={280}
          color={colors.primary}
          intensity="low"
          speed="slow"
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Logo / Brand */}
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <Text variant="displayLarge" color="textPrimary" align="center">
            ALIGNMENT
          </Text>
          <View style={styles.logoUnderline}>
            <LinearGradient
              colors={colors.gradientPrimary as [string, string, ...string[]]}
              style={styles.underlineGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
        </Animated.View>

        {/* Tagline */}
        <Animated.View style={[styles.taglineContainer, taglineStyle]}>
          <Text variant="body" color="textTertiary" align="center">
            A Protocol for Real Human Connection
          </Text>
        </Animated.View>

        {/* Principles */}
        <Animated.View style={[styles.principlesContainer, taglineStyle]}>
          <View style={styles.principleRow}>
            <View style={styles.principleDot} />
            <Text variant="labelSmall" color="textMuted">NO PHOTOS</Text>
          </View>
          <View style={styles.principleRow}>
            <View style={styles.principleDot} />
            <Text variant="labelSmall" color="textMuted">ONE CONVERSATION</Text>
          </View>
          <View style={styles.principleRow}>
            <View style={styles.principleDot} />
            <Text variant="labelSmall" color="textMuted">DAILY CHOICE</Text>
          </View>
        </Animated.View>
      </View>

      {/* Enter Button */}
      <Animated.View style={[styles.buttonContainer, buttonStyle]}>
        <TouchableOpacity
          onPress={handleEnter}
          activeOpacity={0.8}
          style={styles.enterButton}
        >
          <LinearGradient
            colors={[colors.voidCard, colors.voidElevated]}
            style={styles.buttonGradient}
          >
            <Text variant="button" color="primary">
              ENTER PROTOCOL
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text variant="labelSmall" color="textMuted" align="center" style={styles.disclaimer}>
          By entering, you agree to the Protocol rules
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.void,
  },
  orbContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.15,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoUnderline: {
    width: 120,
    height: 2,
    marginTop: spacing.md,
    borderRadius: 1,
    overflow: 'hidden',
  },
  underlineGradient: {
    flex: 1,
  },
  taglineContainer: {
    marginBottom: spacing['3xl'],
  },
  principlesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  principleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  principleDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: spacing['6xl'],
    left: spacing.xl,
    right: spacing.xl,
    alignItems: 'center',
  },
  enterButton: {
    width: '100%',
  },
  buttonGradient: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing['2xl'],
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderActive,
  },
  disclaimer: {
    marginTop: spacing.lg,
  },
});

export default SplashScreen;
