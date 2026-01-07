// ALIGNMENT - Settings Screen
// Account settings and preferences

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
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

type SettingsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
};

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [notifications, setNotifications] = useState(true);
  const [handshakeReminders, setHandshakeReminders] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [haptics, setHaptics] = useState(true);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleToggle = (setter: (value: boolean) => void, currentValue: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setter(!currentValue);
  };

  const handleDeleteAccount = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    // Would show confirmation modal
  };

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Would handle logout
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
          <Text variant="h1" color="textPrimary">
            Settings
          </Text>
        </Animated.View>

        {/* Account section */}
        <Animated.View entering={FadeInUp.delay(200).duration(400)} style={styles.section}>
          <Text variant="labelSmall" color="textTertiary" style={styles.sectionTitle}>
            ACCOUNT
          </Text>
          <LinearGradient
            colors={[colors.voidCard, colors.voidElevated]}
            style={styles.sectionCard}
          >
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text variant="body" color="textSecondary">Email</Text>
                <Text variant="bodySmall" color="textMuted">user@example.com</Text>
              </View>
              <Text variant="body" color="textMuted">→</Text>
            </TouchableOpacity>
            <View style={styles.settingDivider} />
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text variant="body" color="textSecondary">Phone Number</Text>
                <Text variant="bodySmall" color="textMuted">+44 *** *** 1234</Text>
              </View>
              <Text variant="body" color="textMuted">→</Text>
            </TouchableOpacity>
            <View style={styles.settingDivider} />
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text variant="body" color="textSecondary">Password</Text>
                <Text variant="bodySmall" color="textMuted">••••••••</Text>
              </View>
              <Text variant="body" color="textMuted">→</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        {/* Notifications section */}
        <Animated.View entering={FadeInUp.delay(300).duration(400)} style={styles.section}>
          <Text variant="labelSmall" color="textTertiary" style={styles.sectionTitle}>
            NOTIFICATIONS
          </Text>
          <LinearGradient
            colors={[colors.voidCard, colors.voidElevated]}
            style={styles.sectionCard}
          >
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text variant="body" color="textSecondary">Push Notifications</Text>
                <Text variant="bodySmall" color="textMuted">Messages and matches</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={() => handleToggle(setNotifications, notifications)}
                trackColor={{ false: colors.voidSurface, true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>
            <View style={styles.settingDivider} />
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text variant="body" color="textSecondary">Handshake Reminders</Text>
                <Text variant="bodySmall" color="textMuted">Daily 9PM reminder</Text>
              </View>
              <Switch
                value={handshakeReminders}
                onValueChange={() => handleToggle(setHandshakeReminders, handshakeReminders)}
                trackColor={{ false: colors.voidSurface, true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>
          </LinearGradient>
        </Animated.View>

        {/* App preferences section */}
        <Animated.View entering={FadeInUp.delay(400).duration(400)} style={styles.section}>
          <Text variant="labelSmall" color="textTertiary" style={styles.sectionTitle}>
            APP PREFERENCES
          </Text>
          <LinearGradient
            colors={[colors.voidCard, colors.voidElevated]}
            style={styles.sectionCard}
          >
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text variant="body" color="textSecondary">Sound Effects</Text>
                <Text variant="bodySmall" color="textMuted">UI sounds</Text>
              </View>
              <Switch
                value={soundEffects}
                onValueChange={() => handleToggle(setSoundEffects, soundEffects)}
                trackColor={{ false: colors.voidSurface, true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>
            <View style={styles.settingDivider} />
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text variant="body" color="textSecondary">Haptic Feedback</Text>
                <Text variant="bodySmall" color="textMuted">Vibration on interactions</Text>
              </View>
              <Switch
                value={haptics}
                onValueChange={() => handleToggle(setHaptics, haptics)}
                trackColor={{ false: colors.voidSurface, true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Privacy section */}
        <Animated.View entering={FadeInUp.delay(500).duration(400)} style={styles.section}>
          <Text variant="labelSmall" color="textTertiary" style={styles.sectionTitle}>
            PRIVACY & DATA
          </Text>
          <LinearGradient
            colors={[colors.voidCard, colors.voidElevated]}
            style={styles.sectionCard}
          >
            <TouchableOpacity style={styles.settingItem}>
              <Text variant="body" color="textSecondary">Privacy Policy</Text>
              <Text variant="body" color="textMuted">→</Text>
            </TouchableOpacity>
            <View style={styles.settingDivider} />
            <TouchableOpacity style={styles.settingItem}>
              <Text variant="body" color="textSecondary">Terms of Service</Text>
              <Text variant="body" color="textMuted">→</Text>
            </TouchableOpacity>
            <View style={styles.settingDivider} />
            <TouchableOpacity style={styles.settingItem}>
              <Text variant="body" color="textSecondary">Download My Data</Text>
              <Text variant="body" color="textMuted">→</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        {/* Danger zone */}
        <Animated.View entering={FadeInUp.delay(600).duration(400)} style={styles.section}>
          <Text variant="labelSmall" color="error" style={styles.sectionTitle}>
            DANGER ZONE
          </Text>
          <View style={styles.dangerButtons}>
            <Button
              title="Log Out"
              onPress={handleLogout}
              variant="outline"
              size="md"
              fullWidth
            />
            <Button
              title="Delete Account"
              onPress={handleDeleteAccount}
              variant="danger"
              size="md"
              fullWidth
            />
          </View>
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
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.md,
    letterSpacing: 2,
  },
  sectionCard: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
  },
  settingInfo: {
    flex: 1,
    gap: spacing['2xs'],
  },
  settingDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.lg,
  },
  dangerButtons: {
    gap: spacing.md,
  },
});

export default SettingsScreen;
