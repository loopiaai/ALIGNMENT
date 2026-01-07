// ALIGNMENT - Post-Protocol Feedback Screen
// "Was this person who we predicted?"

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
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

type PostFeedbackScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PostFeedback'>;
  route: RouteProp<RootStackParamList, 'PostFeedback'>;
};

export const PostFeedbackScreen: React.FC<PostFeedbackScreenProps> = ({ navigation, route }) => {
  const { connectionId } = route.params;
  const [selectedAnswer, setSelectedAnswer] = useState<'yes' | 'no' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelect = (answer: 'yes' | 'no') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      navigation.navigate('Main');
    }, 1500);
  };

  return (
    <ScreenContainer gradient gradientColors={[colors.voidDeep, colors.void, colors.voidSurface]}>
      <View style={styles.container}>
        {/* Header */}
        <Animated.View entering={FadeInUp.delay(100).duration(400)} style={styles.header}>
          <Text variant="labelSmall" color="primary">
            FEEDBACK
          </Text>
          <Text variant="h1" color="textPrimary" align="center" style={styles.title}>
            One question
          </Text>
        </Animated.View>

        {/* Question */}
        <Animated.View entering={FadeInUp.delay(300).duration(400)} style={styles.questionContainer}>
          <Text variant="h2" color="textPrimary" align="center">
            Was this person who{'\n'}we predicted?
          </Text>
          <Text variant="body" color="textTertiary" align="center" style={styles.subtext}>
            Based on your resonance score and alignment reasons
          </Text>
        </Animated.View>

        {/* Answer options */}
        <Animated.View entering={FadeInUp.delay(500).duration(400)} style={styles.optionsContainer}>
          <TouchableOpacity
            onPress={() => handleSelect('yes')}
            activeOpacity={0.8}
            style={styles.optionWrapper}
          >
            <LinearGradient
              colors={
                selectedAnswer === 'yes'
                  ? [`${colors.success}20`, `${colors.success}05`]
                  : [colors.voidCard, colors.voidElevated]
              }
              style={[
                styles.option,
                selectedAnswer === 'yes' && styles.optionSelected,
                selectedAnswer === 'yes' && { borderColor: colors.success },
              ]}
            >
              <View style={[styles.optionIcon, selectedAnswer === 'yes' && { backgroundColor: colors.success }]}>
                <Text variant="h3" color={selectedAnswer === 'yes' ? 'white' : 'success'}>
                  ✓
                </Text>
              </View>
              <Text variant="h3" color={selectedAnswer === 'yes' ? 'success' : 'textSecondary'}>
                Yes
              </Text>
              <Text variant="bodySmall" color="textMuted" align="center">
                The match was accurate
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleSelect('no')}
            activeOpacity={0.8}
            style={styles.optionWrapper}
          >
            <LinearGradient
              colors={
                selectedAnswer === 'no'
                  ? [`${colors.error}20`, `${colors.error}05`]
                  : [colors.voidCard, colors.voidElevated]
              }
              style={[
                styles.option,
                selectedAnswer === 'no' && styles.optionSelected,
                selectedAnswer === 'no' && { borderColor: colors.error },
              ]}
            >
              <View style={[styles.optionIcon, selectedAnswer === 'no' && { backgroundColor: colors.error }]}>
                <Text variant="h3" color={selectedAnswer === 'no' ? 'white' : 'error'}>
                  ✗
                </Text>
              </View>
              <Text variant="h3" color={selectedAnswer === 'no' ? 'error' : 'textSecondary'}>
                No
              </Text>
              <Text variant="bodySmall" color="textMuted" align="center">
                Not what I expected
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Why this matters */}
        <Animated.View entering={FadeInUp.delay(700).duration(400)} style={styles.infoContainer}>
          <LinearGradient
            colors={[colors.voidCard, colors.voidElevated]}
            style={styles.infoCard}
          >
            <Text variant="labelSmall" color="textTertiary" style={styles.infoTitle}>
              WHY THIS MATTERS
            </Text>
            <Text variant="bodySmall" color="textMuted">
              Your feedback trains the AI to make better matches.
              One answer. No explanation needed.
              The system learns. Future matches improve.
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Submit button */}
        <Animated.View
          entering={FadeInUp.delay(900).duration(400)}
          style={styles.buttonContainer}
        >
          <Button
            title={isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            onPress={handleSubmit}
            variant="primary"
            size="lg"
            fullWidth
            disabled={!selectedAnswer}
            loading={isSubmitting}
          />
          <Button
            title="Skip"
            onPress={() => navigation.navigate('Main')}
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
    paddingTop: spacing['3xl'],
  },
  header: {
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing['2xl'],
  },
  title: {
    marginTop: spacing.sm,
  },
  questionContainer: {
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing['2xl'],
    paddingHorizontal: spacing.xl,
  },
  subtext: {
    marginTop: spacing.sm,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  optionWrapper: {
    flex: 1,
  },
  option: {
    alignItems: 'center',
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    borderColor: colors.border,
    gap: spacing.md,
  },
  optionSelected: {},
  optionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.voidSurface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    marginBottom: spacing.xl,
  },
  infoCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  infoTitle: {
    letterSpacing: 2,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: spacing['4xl'],
    left: 0,
    right: 0,
    gap: spacing.md,
  },
});

export default PostFeedbackScreen;
