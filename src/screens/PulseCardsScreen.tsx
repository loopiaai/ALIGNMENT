// ALIGNMENT - Binary Pulse Cards Screen
// The core swipe mechanic - rapid-fire psychological probes

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { Text } from '../components/Text';
import { SwipeCard } from '../components/SwipeCard';
import { RootStackParamList, PulseResponse } from '../types';
import { pulseCards } from '../data/pulseCards';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type PulseCardsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PulseCards'>;
};

export const PulseCardsScreen: React.FC<PulseCardsScreenProps> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<PulseResponse[]>([]);
  const [cardKey, setCardKey] = useState(0);

  const progressWidth = useSharedValue(0);

  const currentCard = pulseCards[currentIndex];
  const isComplete = currentIndex >= pulseCards.length;

  const handleSwipe = useCallback((direction: 'yes' | 'no') => {
    const startTime = Date.now();

    // Record response
    const response: PulseResponse = {
      cardId: currentCard.id,
      response: direction,
      responseTime: 0, // Would be calculated from actual swipe start
      timestamp: new Date(),
    };

    setResponses(prev => [...prev, response]);

    // Update progress
    const newProgress = ((currentIndex + 1) / pulseCards.length) * 100;
    progressWidth.value = withTiming(newProgress, { duration: 300 });

    // Haptic feedback based on level
    if (currentCard.level === 3) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Move to next card
    setTimeout(() => {
      if (currentIndex + 1 >= pulseCards.length) {
        navigation.navigate('PulseComplete');
      } else {
        setCurrentIndex(prev => prev + 1);
        setCardKey(prev => prev + 1);
      }
    }, 300);
  }, [currentIndex, currentCard, navigation, progressWidth]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const getLevelColor = () => {
    if (!currentCard) return colors.primary;
    switch (currentCard.level) {
      case 1: return colors.secondary;
      case 2: return colors.primary;
      case 3: return colors.accent;
      default: return colors.primary;
    }
  };

  const getLevelName = () => {
    if (!currentCard) return '';
    switch (currentCard.level) {
      case 1: return 'FOUNDATIONS';
      case 2: return 'LIFESTYLE';
      case 3: return 'SOUL';
      default: return '';
    }
  };

  if (isComplete) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <LinearGradient
        colors={[colors.voidDeep, colors.void, colors.voidSurface]}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.levelIndicator}>
          <View style={[styles.levelDot, { backgroundColor: getLevelColor() }]} />
          <Text variant="labelSmall" color="textTertiary">
            {getLevelName()}
          </Text>
        </View>

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
          <Text variant="labelSmall" color="textMuted" style={styles.progressText}>
            {currentIndex + 1} / {pulseCards.length}
          </Text>
        </View>
      </View>

      {/* Card stack */}
      <View style={styles.cardContainer}>
        {/* Background cards for depth effect */}
        {currentIndex + 2 < pulseCards.length && (
          <View style={[styles.backgroundCard, styles.backgroundCard2]} />
        )}
        {currentIndex + 1 < pulseCards.length && (
          <View style={[styles.backgroundCard, styles.backgroundCard1]} />
        )}

        {/* Active card */}
        <Animated.View
          key={cardKey}
          entering={SlideInRight.duration(300)}
          style={styles.activeCard}
        >
          <SwipeCard
            question={currentCard.question}
            level={currentCard.level}
            onSwipe={handleSwipe}
            cardIndex={currentIndex}
            totalCards={pulseCards.length}
          />
        </Animated.View>
      </View>

      {/* Footer hints */}
      <View style={styles.footer}>
        <View style={styles.hintContainer}>
          <View style={[styles.hintIcon, { backgroundColor: `${colors.error}30` }]}>
            <Text variant="labelSmall" color="error">←</Text>
          </View>
          <Text variant="labelSmall" color="textMuted">NO</Text>
        </View>

        <Text variant="bodySmall" color="textMuted">
          Trust your instinct
        </Text>

        <View style={styles.hintContainer}>
          <Text variant="labelSmall" color="textMuted">YES</Text>
          <View style={[styles.hintIcon, { backgroundColor: `${colors.success}30` }]}>
            <Text variant="labelSmall" color="success">→</Text>
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.void,
  },
  header: {
    paddingTop: spacing['4xl'],
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  levelIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  levelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  progressContainer: {
    gap: spacing.sm,
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.voidElevated,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    alignSelf: 'flex-end',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  backgroundCard: {
    position: 'absolute',
    width: SCREEN_WIDTH - 64,
    height: 400,
    backgroundColor: colors.voidCard,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backgroundCard1: {
    transform: [{ scale: 0.95 }, { translateY: 10 }],
    opacity: 0.5,
  },
  backgroundCard2: {
    transform: [{ scale: 0.9 }, { translateY: 20 }],
    opacity: 0.3,
  },
  activeCard: {
    position: 'absolute',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['4xl'],
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  hintIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PulseCardsScreen;
