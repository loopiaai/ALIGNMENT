// ALIGNMENT - Orientation Screen
// Who you seek

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
import { RootStackParamList, Gender, Orientation } from '../types';

type OrientationScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Orientation'>;
};

export const OrientationScreen: React.FC<OrientationScreenProps> = ({ navigation }) => {
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  const [selectedSeeking, setSelectedSeeking] = useState<Orientation | null>(null);

  const genderOptions: { label: string; value: Gender }[] = [
    { label: 'Man', value: 'male' },
    { label: 'Woman', value: 'female' },
    { label: 'Non-binary', value: 'non-binary' },
    { label: 'Other', value: 'other' },
  ];

  const seekingOptions: { label: string; value: Orientation }[] = [
    { label: 'Men', value: 'men' },
    { label: 'Women', value: 'women' },
    { label: 'Everyone', value: 'everyone' },
  ];

  const handleGenderSelect = (value: Gender) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedGender(value);
  };

  const handleSeekingSelect = (value: Orientation) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedSeeking(value);
  };

  const handleContinue = () => {
    if (!selectedGender || !selectedSeeking) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Location');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ScreenContainer gradient gradientColors={[colors.voidDeep, colors.void, colors.voidSurface]}>
      <View style={styles.container}>
        {/* Back button */}
        <Animated.View entering={FadeIn.duration(300)} style={styles.backContainer}>
          <Button title="← Back" onPress={handleBack} variant="ghost" size="sm" />
        </Animated.View>

        {/* Header */}
        <Animated.View entering={FadeInUp.delay(100).duration(400)} style={styles.header}>
          <Text variant="labelSmall" color="textMuted">
            STEP 2 OF 4
          </Text>
          <Text variant="h1" color="textPrimary" style={styles.title}>
            Who are you?
          </Text>
        </Animated.View>

        {/* I am section */}
        <Animated.View entering={FadeInUp.delay(200).duration(400)} style={styles.section}>
          <Text variant="label" color="textTertiary" style={styles.sectionLabel}>
            I AM A
          </Text>
          <View style={styles.optionsRow}>
            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => handleGenderSelect(option.value)}
                activeOpacity={0.8}
                style={styles.optionWrapper}
              >
                <LinearGradient
                  colors={
                    selectedGender === option.value
                      ? [colors.primarySubtle, `${colors.primary}10`]
                      : [colors.voidCard, colors.voidElevated]
                  }
                  style={[
                    styles.option,
                    selectedGender === option.value && styles.optionSelected,
                  ]}
                >
                  <Text
                    variant="label"
                    color={selectedGender === option.value ? 'primary' : 'textSecondary'}
                  >
                    {option.label}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Seeking section */}
        <Animated.View entering={FadeInUp.delay(300).duration(400)} style={styles.section}>
          <Text variant="label" color="textTertiary" style={styles.sectionLabel}>
            SEEKING
          </Text>
          <View style={styles.optionsRow}>
            {seekingOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => handleSeekingSelect(option.value)}
                activeOpacity={0.8}
                style={styles.optionWrapper}
              >
                <LinearGradient
                  colors={
                    selectedSeeking === option.value
                      ? [colors.primarySubtle, `${colors.primary}10`]
                      : [colors.voidCard, colors.voidElevated]
                  }
                  style={[
                    styles.option,
                    selectedSeeking === option.value && styles.optionSelected,
                  ]}
                >
                  <Text
                    variant="label"
                    color={selectedSeeking === option.value ? 'primary' : 'textSecondary'}
                  >
                    {option.label}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Privacy note */}
        <Animated.View entering={FadeInUp.delay(400).duration(400)} style={styles.privacyNote}>
          <View style={styles.privacyDot} />
          <Text variant="bodySmall" color="textMuted">
            This information is private and only used for matching.
          </Text>
        </Animated.View>

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
            disabled={!selectedGender || !selectedSeeking}
          />
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
  backContainer: {
    alignSelf: 'flex-start',
    marginBottom: spacing.lg,
  },
  header: {
    gap: spacing.md,
    marginBottom: spacing['2xl'],
  },
  title: {
    marginTop: spacing.sm,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    marginBottom: spacing.md,
    letterSpacing: 2,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  optionWrapper: {
    flexGrow: 1,
    minWidth: '45%',
  },
  option: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.base,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  optionSelected: {
    borderColor: colors.primary,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  privacyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: spacing['4xl'],
    left: 0,
    right: 0,
  },
});

export default OrientationScreen;
