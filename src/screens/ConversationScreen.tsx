// ALIGNMENT - Conversation Screen
// The 21-day protocol chat interface

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import Animated, { FadeIn, FadeInUp, SlideInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { MessageBubble } from '../components/MessageBubble';
import { DayIndicator } from '../components/DayIndicator';
import { HandshakeModal } from '../components/HandshakeModal';
import { RootStackParamList, Message, Connection } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type ConversationScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Conversation'>;
  route: RouteProp<RootStackParamList, 'Conversation'>;
};

// Mock connection data
const mockConnection: Connection = {
  id: 'conn1',
  matchId: 'match1',
  partnerId: 'user2',
  partnerAlias: 'Thoughtful Soul',
  currentDay: 7,
  startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  lastHandshake: new Date(),
  status: 'active',
  voiceUnlocked: true,
  imagesUnlocked: false,
  revealed: false,
  messages: [],
};

// Mock messages
const mockMessages: Message[] = [
  {
    id: '1',
    connectionId: 'conn1',
    senderId: 'system',
    type: 'system',
    content: 'Day 1 begins. The protocol has started.',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: '2',
    connectionId: 'conn1',
    senderId: 'ai',
    type: 'ai_prompt',
    content: 'You both value depth over surface-level connection. Share a moment when you felt truly understood by someone.',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: '3',
    connectionId: 'conn1',
    senderId: 'user2',
    type: 'text',
    content: 'I remember sitting with my grandmother on her porch. We didn\'t even need words. She just held my hand and somehow knew exactly what I was feeling.',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 3600000),
    read: true,
  },
  {
    id: '4',
    connectionId: 'conn1',
    senderId: 'me',
    type: 'text',
    content: 'That\'s beautiful. There\'s something profound about connection that transcends words. For me, it was a late night conversation with a friend where we both just... understood each other\'s silences.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: '5',
    connectionId: 'conn1',
    senderId: 'system',
    type: 'system',
    content: 'Day 6 — Voice notes are now unlocked.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: '6',
    connectionId: 'conn1',
    senderId: 'user2',
    type: 'voice',
    content: '',
    voiceUrl: 'voice1.m4a',
    voiceDuration: 45,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: '7',
    connectionId: 'conn1',
    senderId: 'ai',
    type: 'ai_prompt',
    content: 'You both prefer understanding over being admired. Describe a time when you chose authenticity over approval.',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    read: true,
  },
];

export const ConversationScreen: React.FC<ConversationScreenProps> = ({ navigation, route }) => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputText, setInputText] = useState('');
  const [showHandshake, setShowHandshake] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const connection = mockConnection;

  useEffect(() => {
    // Scroll to bottom on load
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 500);
  }, []);

  const handleSend = () => {
    if (!inputText.trim()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const newMessage: Message = {
      id: Date.now().toString(),
      connectionId: connection.id,
      senderId: 'me',
      type: 'text',
      content: inputText.trim(),
      createdAt: new Date(),
      read: false,
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleVoiceRecord = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsRecording(!isRecording);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleShowDayInfo = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Could show a modal with day details
  };

  const handleContinueHandshake = () => {
    setShowHandshake(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleEndHandshake = () => {
    setShowHandshake(false);
    navigation.navigate('ConnectionEnded', { connectionId: connection.id });
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => (
    <MessageBubble
      message={item}
      isOwn={item.senderId === 'me'}
      index={index}
    />
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.voidDeep, colors.void]}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text variant="body" color="textSecondary">←</Text>
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text variant="h4" color="textPrimary">
              {connection.partnerAlias}
            </Text>
            <View style={styles.statusRow}>
              <View style={styles.onlineDot} />
              <Text variant="labelSmall" color="textMuted">
                Day {connection.currentDay} of 21
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={handleShowDayInfo} style={styles.dayButton}>
          <LinearGradient
            colors={[colors.primarySubtle, `${colors.primary}10`]}
            style={styles.dayBadge}
          >
            <Text variant="labelSmall" color="primary">
              DAY {connection.currentDay}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Day Progress */}
      <Animated.View entering={FadeInUp.delay(200).duration(400)}>
        <DayIndicator currentDay={connection.currentDay} />
      </Animated.View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <Animated.View entering={SlideInUp.delay(300).duration(400)} style={styles.inputContainer}>
          <LinearGradient
            colors={[colors.voidSurface, colors.voidCard]}
            style={styles.inputGradient}
          >
            <View style={styles.inputRow}>
              {connection.voiceUnlocked && (
                <TouchableOpacity
                  onPress={handleVoiceRecord}
                  style={[
                    styles.voiceButton,
                    isRecording && styles.voiceButtonRecording,
                  ]}
                >
                  <Text variant="body" color={isRecording ? 'error' : 'textMuted'}>
                    {isRecording ? '●' : '🎤'}
                  </Text>
                </TouchableOpacity>
              )}

              <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type a message..."
                placeholderTextColor={colors.textMuted}
                multiline
                maxLength={1000}
              />

              <TouchableOpacity
                onPress={handleSend}
                disabled={!inputText.trim()}
                style={[
                  styles.sendButton,
                  inputText.trim() && styles.sendButtonActive,
                ]}
              >
                <LinearGradient
                  colors={
                    inputText.trim()
                      ? (colors.gradientPrimary as [string, string, ...string[]])
                      : [colors.voidElevated, colors.voidElevated]
                  }
                  style={styles.sendButtonGradient}
                >
                  <Text variant="body" color={inputText.trim() ? 'white' : 'textMuted'}>
                    →
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Anti-leak warning would show here if detected */}
          </LinearGradient>
        </Animated.View>
      </KeyboardAvoidingView>

      {/* Daily Handshake Modal */}
      <HandshakeModal
        visible={showHandshake}
        currentDay={connection.currentDay}
        partnerAlias={connection.partnerAlias}
        onContinue={handleContinueHandshake}
        onEnd={handleEndHandshake}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.void,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing['4xl'],
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerInfo: {
    gap: spacing['2xs'],
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  dayButton: {
    padding: spacing.xs,
  },
  dayBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.borderActive,
  },
  messagesList: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  inputGradient: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.voidElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  voiceButtonRecording: {
    backgroundColor: `${colors.error}20`,
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    backgroundColor: colors.voidElevated,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.textPrimary,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  sendButtonActive: {},
  sendButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ConversationScreen;
