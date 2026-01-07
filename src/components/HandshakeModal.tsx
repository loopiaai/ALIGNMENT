// ALIGNMENT - Daily Handshake Modal Component

import React, { useEffect } from 'react';
import { View, StyleSheet, Modal, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
  FadeIn,
  FadeInUp,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { Text } from './Text';
import { Button } from './Button';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface HandshakeModalProps {
  visible: boolean;
  currentDay: number;
  partnerAlias: string;
  onContinue: () => void;
  onEnd: () => void;
}

export const HandshakeModal: React.FC<HandshakeModalProps> = ({
  visible,
  currentDay,
  partnerAlias,
  onContinue,
  onEnd,
}) => {
  const pulseAnim = useSharedValue(1);
  const glowAnim = useSharedValue(0.3);

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

      pulseAnim.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );

      glowAnim.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.3, { duration: 1500, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );
    }
  }, [visible]);

  const dayStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowAnim.value,
  }));

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onContinue();
  };

  const handleEnd = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    onEnd();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <LinearGradient
          colors={[colors.overlayDarker, colors.void, colors.overlayDarker]}
          style={StyleSheet.absoluteFill}
        />

        <Animated.View entering={FadeIn.duration(400)} style={styles.content}>
          {/* Glow effect */}
          <Animated.View style={[styles.glow, glowStyle]}>
            <LinearGradient
              colors={[`${colors.primary}00`, `${colors.primary}30`, `${colors.primary}00`]}
              style={styles.glowGradient}
            />
          </Animated.View>

          {/* Time indicator */}
          <Animated.View entering={FadeInUp.delay(200).duration(400)}>
            <Text variant="labelSmall" color="textMuted" align="center">
              9:00 PM • DAILY HANDSHAKE
            </Text>
          </Animated.View>

          {/* Day display */}
          <Animated.View style={[styles.dayContainer, dayStyle]}>
            <Text variant="labelSmall" color="textTertiary">
              PROCEED TO
            </Text>
            <Text variant="displayMedium" color="primary">
              Day {currentDay + 1}
            </Text>
            <Text variant="bodySmall" color="textMuted">
              with {partnerAlias}?
            </Text>
          </Animated.View>

          {/* Warning text */}
          <Animated.View entering={FadeInUp.delay(400).duration(400)} style={styles.warningContainer}>
            <View style={styles.warningDot} />
            <Text variant="bodySmall" color="textTertiary" align="center">
              One NO ends the connection for both.{'\n'}
              Silence is treated as NO.
            </Text>
          </Animated.View>

          {/* Action buttons */}
          <Animated.View entering={FadeInUp.delay(600).duration(400)} style={styles.actions}>
            <Button
              title="Continue"
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

          {/* Countdown hint */}
          <Animated.View entering={FadeInUp.delay(800).duration(400)}>
            <Text variant="labelSmall" color="textMuted" align="center">
              Auto-decline in 3 hours
            </Text>
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: SCREEN_WIDTH - 48,
    alignItems: 'center',
    gap: spacing['2xl'],
  },
  glow: {
    position: 'absolute',
    width: 300,
    height: 300,
    top: 0,
  },
  glowGradient: {
    flex: 1,
    borderRadius: 150,
  },
  dayContainer: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing['2xl'],
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  warningDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.warning,
    marginTop: 6,
  },
  actions: {
    width: '100%',
    gap: spacing.md,
  },
});

export default HandshakeModal;
