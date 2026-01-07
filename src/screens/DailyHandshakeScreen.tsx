// ALIGNMENT - Daily Handshake Screen
// Full-screen version of the handshake decision

import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
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
import { GlowOrb } from '../components/GlowOrb';
import { RootStackParamList } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type DailyHandshakeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DailyHandshake'>;
  route: RouteProp<RootStackParamList, 'DailyHandshake'>;
};

export const DailyHandshakeScreen: React.FC<DailyHandshakeScreenProps> = ({ navigation, route }) => {
  const { connectionId, day } = route.params;

  const pulseScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.3, { duration: 1500, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    navigation.navigate('Conversation', { connectionId });
  };

  const handleEnd = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    navigation.navigate('ConnectionEnded', { connectionId });
  };

  const isRevealDay = day === 20; // Next day would be 21

  return (
    <ScreenContainer gradient gradientColors={[colors.voidDeep, colors.void, colors.voidDeep]}>
      <View style={styles.container}>
        {/* Time indicator */}
        <Animated.View entering={FadeIn.delay(100).duration(400)} style={styles.timeContainer}>
          <Text variant="labelSmall" color="textMuted">
            9:00 PM • DAILY HANDSHAKE
          </Text>
        </Animated.View>

        {/* Visual */}
        <View style={styles.visualContainer}>
          <Animated.View style={[styles.glow, glowStyle]}>
            <LinearGradient
              colors={[
                `${isRevealDay ? colors.resonancePerfect : colors.primary}00`,
                `${isRevealDay ? colors.resonancePerfect : colors.primary}30`,
                `${isRevealDay ? colors.resonancePerfect : colors.primary}00`,
              ]}
              style={styles.glowGradient}
            />
          </Animated.View>

          <GlowOrb
            size={120}
            color={isRevealDay ? colors.resonancePerfect : colors.primary}
            intensity="high"
            speed="slow"
          />
        </View>

        {/* Day display */}
        <Animated.View style={[styles.dayContainer, pulseStyle]}>
          <Text variant="labelSmall" color="textTertiary">
            {isRevealDay ? 'FINAL STEP TO' : 'PROCEED TO'}
          </Text>
          <Text
            variant="displayLarge"
            color={isRevealDay ? 'resonancePerfect' : 'primary'}
          >
            Day {day + 1}
          </Text>
          {isRevealDay && (
            <View style={styles.revealBadge}>
              <Text variant="labelSmall" color="resonancePerfect">
                THE REVEAL AWAITS
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Partner info */}
        <Animated.View entering={FadeInUp.delay(300).duration(400)} style={styles.partnerContainer}>
          <Text variant="body" color="textSecondary" align="center">
            with <Text variant="h4" color="textPrimary">Thoughtful Soul</Text>
          </Text>
        </Animated.View>

        {/* Warning */}
        <Animated.View entering={FadeInUp.delay(400).duration(400)} style={styles.warningContainer}>
          <LinearGradient
            colors={[`${colors.warning}10`, `${colors.warning}05`]}
            style={styles.warningCard}
          >
            <View style={styles.warningDot} />
            <Text variant="bodySmall" color="textTertiary" align="center">
              One NO ends the connection for both.{'\n'}
              Silence is treated as NO.
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInUp.delay(500).duration(400)} style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text variant="h3" color="primary">{day}</Text>
            <Text variant="labelSmall" color="textMuted">DAYS</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text variant="h3" color="accent">{21 - day}</Text>
            <Text variant="labelSmall" color="textMuted">REMAINING</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text variant="h3" color="secondary">{day}</Text>
            <Text variant="labelSmall" color="textMuted">HANDSHAKES</Text>
          </View>
        </Animated.View>

        {/* Actions */}
        <Animated.View entering={FadeInUp.delay(600).duration(400)} style={styles.actionsContainer}>
          <Button
            title="Continue Together"
            onPress={handleContinue}
            variant="primary"
            size="lg"
            fullWidth
          />
          <Button
            title="End Connection"
            onPress={handleEnd}
            variant="ghost"
            size="lg"
            fullWidth
          />
        </Animated.View>

        {/* Countdown */}
        <Animated.View entering={FadeIn.delay(800).duration(400)} style={styles.countdownContainer}>
          <Text variant="labelSmall" color="textMuted" align="center">
            Auto-decline in 3 hours
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
    paddingTop: spacing['4xl'],
  },
  timeContainer: {
    marginBottom: spacing.xl,
  },
  visualContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
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
  dayContainer: {
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  revealBadge: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: `${colors.resonancePerfect}20`,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.resonancePerfect,
  },
  partnerContainer: {
    marginBottom: spacing.xl,
  },
  warningContainer: {
    width: SCREEN_WIDTH - 48,
    marginBottom: spacing.xl,
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: `${colors.warning}30`,
  },
  warningDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.warning,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
    marginBottom: spacing.xl,
  },
  statItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  actionsContainer: {
    width: SCREEN_WIDTH - 48,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  countdownContainer: {
    position: 'absolute',
    bottom: spacing['4xl'],
  },
});

export default DailyHandshakeScreen;
