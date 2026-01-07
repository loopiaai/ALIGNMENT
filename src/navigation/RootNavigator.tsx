// ALIGNMENT - Root Navigator
// Main navigation structure

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

// Import all screens
import {
  SplashScreen,
  PhilosophyScreen,
  AgeGateScreen,
  OrientationScreen,
  LocationScreen,
  VerificationScreen,
  VaultConfirmationScreen,
  PulseIntroScreen,
  PulseCardsScreen,
  PulseCompleteScreen,
  CalibratingScreen,
  MatchRevealScreen,
  MatchWaitingScreen,
  ConversationScreen,
  ConnectionEndedScreen,
  DailyHandshakeScreen,
  VaultOpeningScreen,
  PhotoRevealScreen,
  NameRevealScreen,
  ArchitectExitScreen,
  PostFeedbackScreen,
  SubscriptionScreen,
  SettingsScreen,
} from '../screens';

import { MainTabNavigator } from './MainTabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        animationDuration: 300,
        contentStyle: { backgroundColor: '#050506' },
      }}
    >
      {/* Entry & Trust */}
      <Stack.Screen 
        name="Splash" 
        component={SplashScreen}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen 
        name="Philosophy" 
        component={PhilosophyScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen 
        name="AgeGate" 
        component={AgeGateScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen 
        name="Orientation" 
        component={OrientationScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen 
        name="Location" 
        component={LocationScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen 
        name="Verification" 
        component={VerificationScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen 
        name="VaultConfirmation" 
        component={VaultConfirmationScreen}
        options={{ animation: 'fade' }}
      />

      {/* Binary Pulse */}
      <Stack.Screen 
        name="PulseIntro" 
        component={PulseIntroScreen}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen 
        name="PulseCards" 
        component={PulseCardsScreen}
        options={{ animation: 'fade', gestureEnabled: false }}
      />
      <Stack.Screen 
        name="PulseComplete" 
        component={PulseCompleteScreen}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen 
        name="Calibrating" 
        component={CalibratingScreen}
        options={{ animation: 'fade', gestureEnabled: false }}
      />

      {/* Main App */}
      <Stack.Screen 
        name="Main" 
        component={MainTabNavigator}
        options={{ animation: 'fade' }}
      />

      {/* Matching */}
      <Stack.Screen 
        name="MatchReveal" 
        component={MatchRevealScreen}
        options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
      />
      <Stack.Screen 
        name="MatchWaiting" 
        component={MatchWaitingScreen}
        options={{ animation: 'slide_from_right' }}
      />

      {/* Protocol */}
      <Stack.Screen 
        name="Conversation" 
        component={ConversationScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen 
        name="DailyHandshake" 
        component={DailyHandshakeScreen}
        options={{ animation: 'fade', presentation: 'modal', gestureEnabled: false }}
      />
      <Stack.Screen 
        name="ConnectionEnded" 
        component={ConnectionEndedScreen}
        options={{ animation: 'fade' }}
      />

      {/* Reveal */}
      <Stack.Screen 
        name="VaultOpening" 
        component={VaultOpeningScreen}
        options={{ animation: 'fade', gestureEnabled: false }}
      />
      <Stack.Screen 
        name="PhotoReveal" 
        component={PhotoRevealScreen}
        options={{ animation: 'fade', gestureEnabled: false }}
      />
      <Stack.Screen 
        name="NameReveal" 
        component={NameRevealScreen}
        options={{ animation: 'fade', gestureEnabled: false }}
      />
      <Stack.Screen 
        name="ArchitectExit" 
        component={ArchitectExitScreen}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen 
        name="PostFeedback" 
        component={PostFeedbackScreen}
        options={{ animation: 'slide_from_right' }}
      />

      {/* Settings */}
      <Stack.Screen 
        name="Subscription" 
        component={SubscriptionScreen}
        options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
