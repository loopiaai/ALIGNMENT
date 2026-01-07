// ALIGNMENT - Age Gate Screen
// Legal requirement - minimal and elegant

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { ScreenContainer } from '../components/ScreenContainer';
import { RootStackParamList } from '../types';

type AgeGateScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AgeGate'>;
};

export const AgeGateScreen: React.FC<AgeGateScreenProps> = ({ navigation }) => {
  const [selectedAge, setSelectedAge] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ageRanges = [
    { label: '18-24', value: 21 },
    { label: '25-34', value: 30 },
    { label: '35-44', value: 40 },
    { label: '45-54', value: 50 },
    { label: '55+', value: 60 },
  ];

  const handleAgeSelect = (value: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedAge(value);
    setError(null);
  };

  const handleContinue = () => {
    if (!selectedAge) {
      setError('Please select your age range');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Orientation');
  };

  return (
    <ScreenContainer gradient gradientColors={[colors.voidDeep, colors.void, colors.voidSurface]}>
      <View style={styles.container}>
        {/* Header */}
        <Animated.View entering={FadeInUp.delay(100).duration(400)} style={styles.header}>
          <Text variant="labelSmall" color="textMuted">
            STEP 1 OF 4
          </Text>
          <Text variant="h1" color="textPrimary" style={styles.title}>
            How old are you?
          </Text>
          <Text variant="body" color="textTertiary">
            This helps us find compatible connections.
          </Text>
        </Animated.View>

        {/* Age options */}
        <View style={styles.optionsContainer}>
          {ageRanges.map((range, index) => (
            <Animated.View
              key={range.value}
              entering={FadeInUp.delay(200 + index * 50).duration(400)}
            >
              <TouchableOpacity
                onPress={() => handleAgeSelect(range.value)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={
                    selectedAge === range.value
                      ? [colors.primarySubtle, `${colors.primary}10`]
                      : [colors.voidCard, colors.voidElevated]
                  }
                  style={[
                    styles.option,
                    selectedAge === range.value && styles.optionSelected,
                  ]}
                >
                  <Text
                    variant="h3"
                    color={selectedAge === range.value ? 'primary' : 'textSecondary'}
                  >
                    {range.label}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Error message */}
        {error && (
          <Animated.View entering={FadeIn.duration(200)} style={styles.errorContainer}>
            <Text variant="bodySmall" color="error">
              {error}
            </Text>
          </Animated.View>
        )}

        {/* Continue button */}
        <Animated.View
          entering={FadeInUp.delay(500).duration(400)}
          style={styles.buttonContainer}
        >
          <Button
            title="Continue"
            onPress={handleContinue}
            variant="primary"
            size="lg"
            fullWidth
            disabled={!selectedAge}
          />
        </Animated.View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing['4xl'],
  },
  header: {
    gap: spacing.md,
    marginBottom: spacing['3xl'],
  },
  title: {
    marginTop: spacing.sm,
  },
  optionsContainer: {
    gap: spacing.md,
  },
  option: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionSelected: {
    borderColor: colors.primary,
  },
  errorContainer: {
    marginTop: spacing.lg,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: spacing['4xl'],
    left: 0,
    right: 0,
  },
});

export default AgeGateScreen;
