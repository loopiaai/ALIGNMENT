// ALIGNMENT - Message Bubble Component

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { Text } from './Text';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  index: number;
  onVoicePlay?: () => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  index,
  onVoicePlay,
}) => {
  const renderContent = () => {
    switch (message.type) {
      case 'text':
        return (
          <Text variant="body" color={isOwn ? 'white' : 'textPrimary'}>
            {message.content}
          </Text>
        );

      case 'voice':
        return (
          <TouchableOpacity onPress={onVoicePlay} style={styles.voiceContainer}>
            <View style={styles.voiceIcon}>
              <View style={styles.voiceBar} />
              <View style={[styles.voiceBar, styles.voiceBarTall]} />
              <View style={styles.voiceBar} />
              <View style={[styles.voiceBar, styles.voiceBarShort]} />
              <View style={styles.voiceBar} />
            </View>
            <Text variant="labelSmall" color={isOwn ? 'white' : 'textSecondary'}>
              {message.voiceDuration ? `${Math.floor(message.voiceDuration / 60)}:${(message.voiceDuration % 60).toString().padStart(2, '0')}` : '0:00'}
            </Text>
          </TouchableOpacity>
        );

      case 'ai_prompt':
        return (
          <View style={styles.aiPromptContainer}>
            <View style={styles.aiIcon}>
              <Text variant="labelSmall" color="primary">✦</Text>
            </View>
            <Text variant="body" color="textSecondary" style={styles.aiText}>
              {message.content}
            </Text>
          </View>
        );

      case 'system':
        return (
          <Text variant="bodySmall" color="textMuted" align="center">
            {message.content}
          </Text>
        );

      default:
        return null;
    }
  };

  // System messages render differently
  if (message.type === 'system') {
    return (
      <Animated.View
        entering={FadeInUp.delay(index * 50).duration(300)}
        style={styles.systemContainer}
      >
        {renderContent()}
      </Animated.View>
    );
  }

  // AI prompts render in the center
  if (message.type === 'ai_prompt') {
    return (
      <Animated.View
        entering={FadeInUp.delay(index * 50).duration(300)}
        style={styles.aiContainer}
      >
        <LinearGradient
          colors={[colors.primarySubtle, `${colors.primary}05`]}
          style={styles.aiBubble}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {renderContent()}
        </LinearGradient>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 50).duration(300)}
      style={[styles.container, isOwn ? styles.ownContainer : styles.otherContainer]}
    >
      {isOwn ? (
        <LinearGradient
          colors={colors.gradientPrimary as [string, string, ...string[]]}
          style={[styles.bubble, styles.ownBubble]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {renderContent()}
        </LinearGradient>
      ) : (
        <View style={[styles.bubble, styles.otherBubble]}>
          {renderContent()}
        </View>
      )}
      <Text variant="labelSmall" color="textMuted" style={styles.timestamp}>
        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    marginVertical: spacing.xs,
  },
  ownContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
  },
  ownBubble: {
    borderBottomRightRadius: borderRadius.xs,
  },
  otherBubble: {
    backgroundColor: colors.voidCard,
    borderBottomLeftRadius: borderRadius.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timestamp: {
    marginTop: spacing.xs,
    marginHorizontal: spacing.xs,
  },
  voiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minWidth: 120,
  },
  voiceIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 24,
  },
  voiceBar: {
    width: 3,
    height: 12,
    backgroundColor: colors.white,
    borderRadius: 2,
    opacity: 0.8,
  },
  voiceBarTall: {
    height: 20,
  },
  voiceBarShort: {
    height: 8,
  },
  systemContainer: {
    alignSelf: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  aiContainer: {
    alignSelf: 'center',
    maxWidth: '90%',
    marginVertical: spacing.lg,
  },
  aiBubble: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.borderActive,
  },
  aiPromptContainer: {
    gap: spacing.md,
  },
  aiIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primarySubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiText: {
    fontStyle: 'italic',
  },
});

export default MessageBubble;
