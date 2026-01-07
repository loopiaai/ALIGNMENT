// ALIGNMENT - Match Waiting Screen
// Awaiting their response

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

type MatchWaitingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MatchWaiting'>;
  route: RouteProp<RootStackParamList, 'MatchWaiting'>;
};

export const MatchWaitingScreen: React.FC<MatchWaitingScreenProps> = ({ navigation, route }) => {
  const pulseScale = useSharedValue(1);
  const dotOpacity1 = useSharedValue(0.3);
  const dotOpacity2 = useSharedValue(0.3);
  const dotOpacity3 = useSharedValue(0.3);

  useEffect(() => {
    // Pulse animation
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );

    // Track all timer IDs for cleanup
    const timerIds: NodeJS.Timeout[] = [];

    // Dot animations (staggered)
    const animateDot = (dotValue: Animated.SharedValue<number>, delay: number) => {
      const timerId = setTimeout(() => {
        dotValue.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 600 }),
            withTiming(0.3, { duration: 600 })
          ),
          -1,
          false
        );
      }, delay);
      timerIds.push(timerId);
    };

    animateDot(dotOpacity1, 0);
    animateDot(dotOpacity2, 200);
    animateDot(dotOpacity3, 400);

    // Simulate match acceptance after delay (for demo)
    const mainTimer = setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.navigate('Conversation', { connectionId: 'demo-connection' });
    }, 5000);
    timerIds.push(mainTimer);

    return () => {
      timerIds.forEach(id => clearTimeout(id));
    };
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const dot1Style = useAnimatedStyle(() => ({
    opacity: dotOpacity1.value,
  }));

  const dot2Style = useAnimatedStyle(() => ({
    opacity: dotOpacity2.value,
  }));

  const dot3Style = useAnimatedStyle(() => ({
    opacity: dotOpacity3.value,
  }));

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ScreenContainer gradient gradientColors={[colors.voidDeep, colors.void, colors.voidSurface]}>
      <View style={styles.container}>
        {/* Header */}
        <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
          <Button title="← Back" onPress={handleBack} variant="ghost" size="sm" />
        </Animated.View>

        {/* Waiting visualization */}
        <View style={styles.visualContainer}>
          <GlowOrb
            size={150}
            color={colors.warning}
            intensity="medium"
            speed="slow"
          />

          <Animated.View style={[styles.pulseRing, pulseStyle]}>
            <View style={styles.pulseRingInner} />
          </Animated.View>

          {/* Two silhouettes */}
          <View style={styles.silhouettes}>
            <View style={[styles.silhouette, styles.silhouetteYou]}>
              <View style={styles.silhouetteCheck}>
                <Text variant="labelSmall" color="success">✓</Text>
              </View>
            </View>
            <View style={styles.connectionLine}>
              <Animated.View style={[styles.connectionDot, dot1Style]} />
              <Animated.View style={[styles.connectionDot, dot2Style]} />
              <Animated.View style={[styles.connectionDot, dot3Style]} />
            </View>
            <View style={[styles.silhouette, styles.silhouetteThem]}>
              <Text variant="labelSmall" color="textMuted">?</Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <Animated.View entering={FadeInUp.delay(300).duration(400)} style={styles.content}>
          <Text variant="labelSmall" color="warning">
            AWAITING RESPONSE
          </Text>
          <Text variant="h1" color="textPrimary" align="center" style={styles.title}>
            You've accepted
          </Text>
          <Text variant="bodyLarge" color="textTertiary" align="center" style={styles.description}>
            Waiting for them to decide.{'\n'}
            This usually takes a few hours.
          </Text>
        </Animated.View>

        {/* Info card */}
        <Animated.View entering={FadeInUp.delay(500).duration(400)} style={styles.infoContainer}>
          <LinearGradient
            colors={[colors.voidCard, colors.voidElevated]}
            style={styles.infoCard}
          >
            <Text variant="labelSmall" color="textTertiary" style={styles.infoTitle}>
              WHAT HAPPENS NEXT
            </Text>
            <View style={styles.infoList}>
              <View style={styles.infoItem}>
                <Text variant="bodySmall" color="textMuted">•</Text>
                <Text variant="bodySmall" color="textMuted">
                  If they accept, the 21-day protocol begins
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text variant="bodySmall" color="textMuted">•</Text>
                <Text variant="bodySmall" color="textMuted">
                  If they pass, your slot opens for a new match
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text variant="bodySmall" color="textMuted">•</Text>
                <Text variant="bodySmall" color="textMuted">
                  You'll be notified when they respond
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Footer */}
        <Animated.View entering={FadeIn.delay(700).duration(400)} style={styles.footer}>
          <Text variant="bodySmall" color="textMuted" align="center">
            92% of responses happen within 24 hours
          </Text>
        </Animated.View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing['2xl'],
  },
  header: {
    alignSelf: 'flex-start',
    marginBottom: spacing.lg,
  },
  visualContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  pulseRing: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: `${colors.warning}30`,
  },
  pulseRingInner: {},
  silhouettes: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  silhouette: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.voidCard,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  silhouetteYou: {
    borderColor: colors.success,
  },
  silhouetteThem: {
    borderColor: colors.textMuted,
  },
  silhouetteCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectionLine: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  connectionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.warning,
  },
  content: {
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  title: {
    marginTop: spacing.sm,
  },
  description: {
    marginTop: spacing.xs,
  },
  infoContainer: {
    marginBottom: spacing.xl,
  },
  infoCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoTitle: {
    marginBottom: spacing.md,
    letterSpacing: 2,
  },
  infoList: {
    gap: spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  footer: {
    position: 'absolute',
    bottom: spacing['4xl'],
    left: spacing.xl,
    right: spacing.xl,
  },
});

export default MatchWaitingScreen;
