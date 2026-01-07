// ALIGNMENT - Connection Ended Screen
// Clean closure - dignity preserved

import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
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

type ConnectionEndedScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ConnectionEnded'>;
  route: RouteProp<RootStackParamList, 'ConnectionEnded'>;
};

export const ConnectionEndedScreen: React.FC<ConnectionEndedScreenProps> = ({ navigation, route }) => {
  const lineWidth = useSharedValue(0);
  const fadeOpacity = useSharedValue(0);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    lineWidth.value = withDelay(
      300,
      withTiming(100, { duration: 800, easing: Easing.out(Easing.cubic) })
    );

    fadeOpacity.value = withDelay(
      500,
      withTiming(1, { duration: 600 })
    );
  }, []);

  const lineStyle = useAnimatedStyle(() => ({
    width: `${lineWidth.value}%`,
  }));

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: fadeOpacity.value,
  }));

  const handleReturn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Main');
  };

  return (
    <ScreenContainer gradient gradientColors={[colors.voidDeep, colors.void, colors.voidSurface]}>
      <View style={styles.container}>
        {/* Visual */}
        <View style={styles.visualContainer}>
          {/* Two fading circles */}
          <View style={styles.circlesContainer}>
            <Animated.View style={[styles.circle, styles.circleLeft, fadeStyle]} />
            <Animated.View style={[styles.lineContainer, lineStyle]}>
              <View style={styles.line} />
            </Animated.View>
            <Animated.View style={[styles.circle, styles.circleRight, fadeStyle]} />
          </View>
        </View>

        {/* Content */}
        <Animated.View entering={FadeInUp.delay(600).duration(400)} style={styles.content}>
          <Text variant="labelSmall" color="textMuted">
            CONNECTION ENDED
          </Text>
          <Text variant="h1" color="textPrimary" align="center" style={styles.title}>
            This path has closed
          </Text>
          <Text variant="bodyLarge" color="textTertiary" align="center" style={styles.description}>
            Some connections aren't meant to continue.{'\n'}
            That's okay. That's the protocol.
          </Text>
        </Animated.View>

        {/* Message */}
        <Animated.View entering={FadeInUp.delay(800).duration(400)} style={styles.messageContainer}>
          <LinearGradient
            colors={[colors.voidCard, colors.voidElevated]}
            style={styles.messageCard}
          >
            <Text variant="bodySmall" color="textMuted" align="center">
              No blame. No explanation needed.{'\n'}
              Your slot is now open for a new match.
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Quote */}
        <Animated.View entering={FadeIn.delay(1000).duration(400)} style={styles.quoteContainer}>
          <Text variant="bodySmall" color="textMuted" align="center" style={styles.quote}>
            "Every ending is a clean slate.{'\n'}Every goodbye preserves dignity."
          </Text>
        </Animated.View>

        {/* Return button */}
        <Animated.View
          entering={FadeInUp.delay(1200).duration(400)}
          style={styles.buttonContainer}
        >
          <Button
            title="Return Home"
            onPress={handleReturn}
            variant="primary"
            size="lg"
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
    paddingTop: spacing['5xl'],
  },
  visualContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  circlesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: SCREEN_WIDTH - 100,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
  },
  circleLeft: {
    borderColor: colors.textMuted,
  },
  circleRight: {
    borderColor: colors.textMuted,
  },
  lineContainer: {
    flex: 1,
    height: 2,
    overflow: 'hidden',
  },
  line: {
    flex: 1,
    backgroundColor: colors.textMuted,
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
    marginTop: spacing.sm,
  },
  messageContainer: {
    width: SCREEN_WIDTH - 48,
    marginBottom: spacing.xl,
  },
  messageCard: {
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
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

export default ConnectionEndedScreen;
