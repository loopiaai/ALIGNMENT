// ALIGNMENT - Subscription Screen
// Clean monetization - no dark patterns

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type SubscriptionScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Subscription'>;
};

export const SubscriptionScreen: React.FC<SubscriptionScreenProps> = ({ navigation }) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectPlan = (plan: 'monthly' | 'yearly') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPlan(plan);
  };

  const handleSubscribe = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setIsProcessing(true);

    // Simulate subscription
    setTimeout(() => {
      setIsProcessing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.goBack();
    }, 2000);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ScreenContainer gradient gradientColors={[colors.voidDeep, colors.void, colors.voidSurface]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeIn.duration(300)} style={styles.backContainer}>
          <Button title="← Back" onPress={handleBack} variant="ghost" size="sm" />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(100).duration(400)} style={styles.header}>
          <Text variant="labelSmall" color="primary">
            PREMIUM
          </Text>
          <Text variant="h1" color="textPrimary">
            Unlock More{'\n'}Connections
          </Text>
          <Text variant="body" color="textTertiary">
            More slots. More chances. Same intentional experience.
          </Text>
        </Animated.View>

        {/* Features comparison */}
        <Animated.View entering={FadeInUp.delay(200).duration(400)} style={styles.featuresContainer}>
          <LinearGradient
            colors={[colors.voidCard, colors.voidElevated]}
            style={styles.featuresCard}
          >
            {/* Free tier */}
            <View style={styles.tierColumn}>
              <Text variant="labelSmall" color="textMuted" style={styles.tierLabel}>FREE</Text>
              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <Text variant="body" color="textMuted">1 Active Slot</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text variant="body" color="textMuted">Full 21-Day Protocol</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text variant="body" color="textMuted">AI Orchestration</Text>
                </View>
                <View style={[styles.featureItem, styles.featureDisabled]}>
                  <Text variant="body" color="textDisabled">No Pause Days</Text>
                </View>
              </View>
            </View>

            <View style={styles.tierDivider} />

            {/* Premium tier */}
            <View style={styles.tierColumn}>
              <View style={styles.premiumBadge}>
                <Text variant="labelSmall" color="primary">PREMIUM</Text>
              </View>
              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <Text variant="body" color="primary">3 Active Slots</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text variant="body" color="textSecondary">Full 21-Day Protocol</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text variant="body" color="textSecondary">AI Orchestration</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text variant="body" color="accent">1 Pause Day / Month</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Plan selection */}
        <Animated.View entering={FadeInUp.delay(300).duration(400)} style={styles.plansContainer}>
          <Text variant="labelSmall" color="textTertiary" style={styles.plansTitle}>
            CHOOSE YOUR PLAN
          </Text>

          <View style={styles.planOptions}>
            {/* Monthly */}
            <TouchableOpacity
              onPress={() => handleSelectPlan('monthly')}
              activeOpacity={0.8}
              style={styles.planOption}
            >
              <LinearGradient
                colors={
                  selectedPlan === 'monthly'
                    ? [colors.primarySubtle, `${colors.primary}10`]
                    : [colors.voidCard, colors.voidElevated]
                }
                style={[
                  styles.planCard,
                  selectedPlan === 'monthly' && styles.planCardSelected,
                ]}
              >
                <Text variant="label" color={selectedPlan === 'monthly' ? 'primary' : 'textSecondary'}>
                  Monthly
                </Text>
                <View style={styles.priceContainer}>
                  <Text variant="h2" color={selectedPlan === 'monthly' ? 'primary' : 'textPrimary'}>
                    £9.99
                  </Text>
                  <Text variant="bodySmall" color="textMuted">/month</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Yearly */}
            <TouchableOpacity
              onPress={() => handleSelectPlan('yearly')}
              activeOpacity={0.8}
              style={styles.planOption}
            >
              <LinearGradient
                colors={
                  selectedPlan === 'yearly'
                    ? [colors.primarySubtle, `${colors.primary}10`]
                    : [colors.voidCard, colors.voidElevated]
                }
                style={[
                  styles.planCard,
                  selectedPlan === 'yearly' && styles.planCardSelected,
                ]}
              >
                <View style={styles.saveBadge}>
                  <Text variant="labelSmall" color="success">SAVE 33%</Text>
                </View>
                <Text variant="label" color={selectedPlan === 'yearly' ? 'primary' : 'textSecondary'}>
                  Yearly
                </Text>
                <View style={styles.priceContainer}>
                  <Text variant="h2" color={selectedPlan === 'yearly' ? 'primary' : 'textPrimary'}>
                    £79.99
                  </Text>
                  <Text variant="bodySmall" color="textMuted">/year</Text>
                </View>
                <Text variant="labelSmall" color="textMuted">£6.67/month</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Promise */}
        <Animated.View entering={FadeInUp.delay(400).duration(400)} style={styles.promiseContainer}>
          <LinearGradient
            colors={[colors.voidCard, colors.voidElevated]}
            style={styles.promiseCard}
          >
            <Text variant="labelSmall" color="textTertiary" style={styles.promiseTitle}>
              OUR PROMISE
            </Text>
            <View style={styles.promiseList}>
              <View style={styles.promiseItem}>
                <View style={styles.promiseDot} />
                <Text variant="bodySmall" color="textMuted">No boosts or pay-to-win features</Text>
              </View>
              <View style={styles.promiseItem}>
                <View style={styles.promiseDot} />
                <Text variant="bodySmall" color="textMuted">No paywalls mid-connection</Text>
              </View>
              <View style={styles.promiseItem}>
                <View style={styles.promiseDot} />
                <Text variant="bodySmall" color="textMuted">Cancel anytime, no questions</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Subscribe button */}
        <Animated.View entering={FadeInUp.delay(500).duration(400)} style={styles.buttonContainer}>
          <Button
            title={isProcessing ? 'Processing...' : `Subscribe ${selectedPlan === 'monthly' ? '£9.99/mo' : '£79.99/yr'}`}
            onPress={handleSubscribe}
            variant="primary"
            size="lg"
            fullWidth
            loading={isProcessing}
          />
          <Text variant="labelSmall" color="textMuted" align="center" style={styles.terms}>
            By subscribing, you agree to our Terms of Service
          </Text>
        </Animated.View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing['2xl'],
    paddingBottom: spacing['4xl'],
  },
  backContainer: {
    alignSelf: 'flex-start',
    marginBottom: spacing.lg,
  },
  header: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  featuresContainer: {
    marginBottom: spacing.xl,
  },
  featuresCard: {
    flexDirection: 'row',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tierColumn: {
    flex: 1,
    gap: spacing.md,
  },
  tierLabel: {
    letterSpacing: 2,
  },
  premiumBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing['2xs'],
    backgroundColor: colors.primarySubtle,
    borderRadius: borderRadius.sm,
  },
  featuresList: {
    gap: spacing.sm,
  },
  featureItem: {},
  featureDisabled: {
    opacity: 0.5,
  },
  tierDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.lg,
  },
  plansContainer: {
    marginBottom: spacing.xl,
  },
  plansTitle: {
    marginBottom: spacing.md,
    letterSpacing: 2,
  },
  planOptions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  planOption: {
    flex: 1,
  },
  planCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    gap: spacing.sm,
  },
  planCardSelected: {
    borderColor: colors.primary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
  },
  saveBadge: {
    position: 'absolute',
    top: -10,
    right: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing['2xs'],
    backgroundColor: `${colors.success}20`,
    borderRadius: borderRadius.sm,
  },
  promiseContainer: {
    marginBottom: spacing.xl,
  },
  promiseCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  promiseTitle: {
    marginBottom: spacing.md,
    letterSpacing: 2,
  },
  promiseList: {
    gap: spacing.sm,
  },
  promiseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  promiseDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.success,
  },
  buttonContainer: {
    gap: spacing.md,
  },
  terms: {
    marginTop: spacing.sm,
  },
});

export default SubscriptionScreen;
