// ALIGNMENT - Match Reveal Screen
// Single candidate reveal with resonance score

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
import { MatchCard } from '../components/MatchCard';
import { ScreenContainer } from '../components/ScreenContainer';
import { RootStackParamList, Match } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type MatchRevealScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MatchReveal'>;
  route: RouteProp<RootStackParamList, 'MatchReveal'>;
};

// Mock match data
const mockMatch: Match = {
  id: 'match1',
  userId: 'user2',
  resonanceScore: 92,
  alignmentReasons: [
    'You both value depth over surface-level connection',
    'You both detach under pressure rather than escalate',
    'You both prefer understanding over being admired',
  ],
  createdAt: new Date(),
  status: 'pending',
};

export const MatchRevealScreen: React.FC<MatchRevealScreenProps> = ({ navigation, route }) => {
  const [showActions, setShowActions] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  const cardScale = useSharedValue(0.8);
  const cardOpacity = useSharedValue(0);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    cardOpacity.value = withTiming(1, { duration: 600 });
    cardScale.value = withSequence(
      withTiming(1.02, { duration: 500, easing: Easing.out(Easing.back) }),
      withTiming(1, { duration: 200 })
    );

    // Show actions after card animation
    setTimeout(() => {
      setShowActions(true);
    }, 1500);
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardOpacity.value,
  }));

  const handleAccept = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setIsAccepting(true);

    // Simulate acceptance
    setTimeout(() => {
      navigation.navigate('MatchWaiting', { matchId: mockMatch.id });
    }, 1000);
  };

  const handlePass = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.goBack();
  };

  return (
    <ScreenContainer gradient gradientColors={[colors.voidDeep, colors.void, colors.voidSurface]}>
      <View style={styles.container}>
        {/* Header */}
        <Animated.View entering={FadeInUp.delay(100).duration(400)} style={styles.header}>
          <Button
            title="← Back"
            onPress={() => navigation.goBack()}
            variant="ghost"
            size="sm"
          />
        </Animated.View>

        {/* Match Card */}
        <Animated.View style={[styles.cardContainer, cardStyle]}>
          <MatchCard match={mockMatch} />
        </Animated.View>

        {/* Actions */}
        {showActions && (
          <Animated.View
            entering={FadeInUp.duration(400)}
            style={styles.actionsContainer}
          >
            <View style={styles.actionsRow}>
              <View style={styles.actionButton}>
                <Button
                  title="Pass"
                  onPress={handlePass}
                  variant="outline"
                  size="lg"
                  fullWidth
                />
              </View>
              <View style={styles.actionButton}>
                <Button
                  title={isAccepting ? 'Accepting...' : 'Accept'}
                  onPress={handleAccept}
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isAccepting}
                />
              </View>
            </View>

            <Text variant="bodySmall" color="textMuted" align="center" style={styles.disclaimer}>
              Both must accept to begin the 21-day protocol
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
    paddingTop: spacing['2xl'],
  },
  header: {
    alignSelf: 'flex-start',
    marginBottom: spacing.lg,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsContainer: {
    paddingBottom: spacing['3xl'],
    gap: spacing.lg,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  disclaimer: {
    marginTop: spacing.sm,
  },
});

export default MatchRevealScreen;
