// ALIGNMENT - Location Screen
// For matching radius

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
import { GlowOrb } from '../components/GlowOrb';
import { RootStackParamList } from '../types';

type LocationScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Location'>;
};

export const LocationScreen: React.FC<LocationScreenProps> = ({ navigation }) => {
  const [locationGranted, setLocationGranted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEnableLocation = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);

    // Simulate location permission request
    setTimeout(() => {
      setLoading(false);
      setLocationGranted(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1500);
  };

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Verification');
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
            STEP 3 OF 4
          </Text>
          <Text variant="h1" color="textPrimary" style={styles.title}>
            Your location
          </Text>
          <Text variant="body" color="textTertiary">
            We use this to find connections near you.{'\n'}Your exact location is never shared.
          </Text>
        </Animated.View>

        {/* Location visualization */}
        <Animated.View
          entering={FadeIn.delay(300).duration(600)}
          style={styles.visualContainer}
        >
          <GlowOrb
            size={150}
            color={locationGranted ? colors.success : colors.primary}
            intensity={locationGranted ? 'high' : 'medium'}
            speed="slow"
          />
          {locationGranted && (
            <Animated.View entering={FadeIn.duration(400)} style={styles.checkmark}>
              <Text variant="displaySmall" color="success">✓</Text>
            </Animated.View>
          )}
        </Animated.View>

        {/* Location status */}
        <Animated.View entering={FadeInUp.delay(400).duration(400)} style={styles.statusContainer}>
          {locationGranted ? (
            <>
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
                <Text variant="label" color="success">
                  Location enabled
                </Text>
              </View>
              <Text variant="bodySmall" color="textMuted" style={styles.statusDetail}>
                London, United Kingdom
              </Text>
            </>
          ) : (
            <>
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, { backgroundColor: colors.warning }]} />
                <Text variant="label" color="textSecondary">
                  Location required
                </Text>
              </View>
              <Text variant="bodySmall" color="textMuted" style={styles.statusDetail}>
                Enable to find compatible connections nearby
              </Text>
            </>
          )}
        </Animated.View>

        {/* Privacy info */}
        <Animated.View entering={FadeInUp.delay(500).duration(400)} style={styles.privacyContainer}>
          <LinearGradient
            colors={[colors.voidCard, colors.voidElevated]}
            style={styles.privacyCard}
          >
            <Text variant="labelSmall" color="textTertiary" style={styles.privacyTitle}>
              PRIVACY PROMISE
            </Text>
            <View style={styles.privacyItem}>
              <Text variant="bodySmall" color="textMuted">•</Text>
              <Text variant="bodySmall" color="textMuted">
                Only your city is shown to matches
              </Text>
            </View>
            <View style={styles.privacyItem}>
              <Text variant="bodySmall" color="textMuted">•</Text>
              <Text variant="bodySmall" color="textMuted">
                Exact coordinates are never stored
              </Text>
            </View>
            <View style={styles.privacyItem}>
              <Text variant="bodySmall" color="textMuted">•</Text>
              <Text variant="bodySmall" color="textMuted">
                You can change this anytime
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Action button */}
        <Animated.View
          entering={FadeInUp.delay(600).duration(400)}
          style={styles.buttonContainer}
        >
          {locationGranted ? (
            <Button
              title="Continue"
              onPress={handleContinue}
              variant="primary"
              size="lg"
              fullWidth
            />
          ) : (
            <Button
              title="Enable Location"
              onPress={handleEnableLocation}
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            />
          )}
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
    marginBottom: spacing.xl,
  },
  title: {
    marginTop: spacing.sm,
  },
  visualContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    marginVertical: spacing.xl,
  },
  checkmark: {
    position: 'absolute',
  },
  statusContainer: {
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xl,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusDetail: {
    marginTop: spacing.xs,
  },
  privacyContainer: {
    marginTop: spacing.lg,
  },
  privacyCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  privacyTitle: {
    marginBottom: spacing.xs,
    letterSpacing: 2,
  },
  privacyItem: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: spacing['4xl'],
    left: 0,
    right: 0,
  },
});

export default LocationScreen;
