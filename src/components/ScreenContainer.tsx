// ALIGNMENT - Screen Container Component

import React from 'react';
import { View, StyleSheet, StatusBar, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { screenPadding } from '../theme/spacing';

interface ScreenContainerProps {
  children: React.ReactNode;
  gradient?: boolean;
  gradientColors?: string[];
  padding?: boolean;
  centered?: boolean;
  style?: ViewStyle;
  safeArea?: boolean;
  fadeIn?: boolean;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  gradient = false,
  gradientColors = colors.gradientVoid,
  padding = true,
  centered = false,
  style,
  safeArea = true,
  fadeIn = true,
}) => {
  const content = (
    <Animated.View
      entering={fadeIn ? FadeIn.duration(400) : undefined}
      style={[
        styles.content,
        padding && styles.padding,
        centered && styles.centered,
        style,
      ]}
    >
      {children}
    </Animated.View>
  );

  const Container = safeArea ? SafeAreaView : View;

  if (gradient) {
    return (
      <>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          colors={gradientColors as [string, string, ...string[]]}
          style={styles.gradient}
        >
          <Container style={styles.container}>
            {content}
          </Container>
        </LinearGradient>
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Container style={[styles.container, styles.solid]}>
        {content}
      </Container>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  solid: {
    backgroundColor: colors.void,
  },
  content: {
    flex: 1,
  },
  padding: {
    paddingHorizontal: screenPadding.horizontal,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ScreenContainer;
