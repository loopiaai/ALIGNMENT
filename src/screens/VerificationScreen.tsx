// ALIGNMENT - Verification Screen
// Selfie + ID verification

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Animated, { FadeIn, FadeInUp, FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { ScreenContainer } from '../components/ScreenContainer';
import { RootStackParamList } from '../types';

type VerificationScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Verification'>;
};

export const VerificationScreen: React.FC<VerificationScreenProps> = ({ navigation }) => {
  const [selfieComplete, setSelfieComplete] = useState(false);
  const [idComplete, setIdComplete] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleTakeSelfie = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Simulate camera capture
    setTimeout(() => {
      setSelfieComplete(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1000);
  };

  const handleScanID = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Simulate ID scan
    setTimeout(() => {
      setIdComplete(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1000);
  };

  const handleVerify = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setVerifying(true);

    // Simulate verification process
    setTimeout(() => {
      setVerifying(false);
      navigation.navigate('VaultConfirmation');
    }, 2000);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const isComplete = selfieComplete && idComplete;

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
            STEP 4 OF 4
          </Text>
          <Text variant="h1" color="textPrimary" style={styles.title}>
            Verify you're real
          </Text>
          <Text variant="body" color="textTertiary">
            Every user is verified. No catfishing. No fake profiles.
          </Text>
        </Animated.View>

        {/* Verification steps */}
        <View style={styles.stepsContainer}>
          {/* Selfie step */}
          <Animated.View entering={FadeInUp.delay(200).duration(400)}>
            <TouchableOpacity
              onPress={handleTakeSelfie}
              disabled={selfieComplete}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  selfieComplete
                    ? [`${colors.success}15`, `${colors.success}05`]
                    : [colors.voidCard, colors.voidElevated]
                }
                style={[
                  styles.stepCard,
                  selfieComplete && styles.stepComplete,
                ]}
              >
                <View style={styles.stepIcon}>
                  {selfieComplete ? (
                    <Text variant="h3" color="success">✓</Text>
                  ) : (
                    <View style={styles.cameraIcon}>
                      <View style={styles.cameraBody} />
                      <View style={styles.cameraLens} />
                    </View>
                  )}
                </View>
                <View style={styles.stepContent}>
                  <Text variant="h4" color={selfieComplete ? 'success' : 'textPrimary'}>
                    Take a selfie
                  </Text>
                  <Text variant="bodySmall" color="textMuted">
                    {selfieComplete ? 'Captured successfully' : 'Quick photo to verify your face'}
                  </Text>
                </View>
                {!selfieComplete && (
                  <View style={styles.stepArrow}>
                    <Text variant="body" color="textMuted">→</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* ID step */}
          <Animated.View entering={FadeInUp.delay(300).duration(400)}>
            <TouchableOpacity
              onPress={handleScanID}
              disabled={idComplete || !selfieComplete}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  idComplete
                    ? [`${colors.success}15`, `${colors.success}05`]
                    : [colors.voidCard, colors.voidElevated]
                }
                style={[
                  styles.stepCard,
                  idComplete && styles.stepComplete,
                  !selfieComplete && styles.stepDisabled,
                ]}
              >
                <View style={styles.stepIcon}>
                  {idComplete ? (
                    <Text variant="h3" color="success">✓</Text>
                  ) : (
                    <View style={styles.idIcon}>
                      <View style={styles.idCard} />
                    </View>
                  )}
                </View>
                <View style={styles.stepContent}>
                  <Text
                    variant="h4"
                    color={idComplete ? 'success' : selfieComplete ? 'textPrimary' : 'textMuted'}
                  >
                    Scan your ID
                  </Text>
                  <Text variant="bodySmall" color="textMuted">
                    {idComplete ? 'Verified successfully' : 'Passport, driver\'s license, or ID card'}
                  </Text>
                </View>
                {!idComplete && selfieComplete && (
                  <View style={styles.stepArrow}>
                    <Text variant="body" color="textMuted">→</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Security note */}
        <Animated.View entering={FadeInUp.delay(400).duration(400)} style={styles.securityNote}>
          <LinearGradient
            colors={[colors.voidCard, colors.voidElevated]}
            style={styles.securityCard}
          >
            <View style={styles.securityIcon}>
              <View style={styles.shieldIcon} />
            </View>
            <View style={styles.securityContent}>
              <Text variant="labelSmall" color="primary">
                SECURE & PRIVATE
              </Text>
              <Text variant="bodySmall" color="textMuted">
                Your ID is only used for verification and immediately deleted. 
                Your selfie is sealed in your vault until Day 21.
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Verify button */}
        <Animated.View
          entering={FadeInUp.delay(500).duration(400)}
          style={styles.buttonContainer}
        >
          <Button
            title={verifying ? 'Verifying...' : 'Complete Verification'}
            onPress={handleVerify}
            variant="primary"
            size="lg"
            fullWidth
            disabled={!isComplete}
            loading={verifying}
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
  stepsContainer: {
    gap: spacing.md,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.lg,
  },
  stepComplete: {
    borderColor: colors.success,
  },
  stepDisabled: {
    opacity: 0.5,
  },
  stepIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.voidSurface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepContent: {
    flex: 1,
    gap: spacing.xs,
  },
  stepArrow: {
    padding: spacing.sm,
  },
  cameraIcon: {
    width: 24,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraBody: {
    width: 24,
    height: 16,
    backgroundColor: colors.textMuted,
    borderRadius: 4,
  },
  cameraLens: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: colors.voidSurface,
    borderRadius: 4,
  },
  idIcon: {
    width: 24,
    height: 18,
  },
  idCard: {
    width: 24,
    height: 16,
    backgroundColor: colors.textMuted,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.voidSurface,
  },
  securityNote: {
    marginTop: spacing['2xl'],
  },
  securityCard: {
    flexDirection: 'row',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  securityIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shieldIcon: {
    width: 20,
    height: 24,
    backgroundColor: colors.primary,
    borderRadius: 10,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  securityContent: {
    flex: 1,
    gap: spacing.xs,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: spacing['4xl'],
    left: 0,
    right: 0,
  },
});

export default VerificationScreen;
