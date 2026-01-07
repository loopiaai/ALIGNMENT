// ALIGNMENT - Custom Button Component

import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius, durations } from '../theme/spacing';
import { Text } from './Text';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  haptic?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  haptic = true,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
    opacity.value = withTiming(0.9, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    opacity.value = withTiming(1, { duration: 100 });
  };

  const handlePress = () => {
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const sizeStyles = {
    sm: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
    md: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl },
    lg: { paddingVertical: spacing.base, paddingHorizontal: spacing['2xl'] },
  };

  const getButtonContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          color={variant === 'ghost' || variant === 'outline' ? colors.primary : colors.white}
          size="small"
        />
      );
    }

    return (
      <Text
        variant={size === 'sm' ? 'buttonSmall' : 'button'}
        color={getTextColor()}
      >
        {title}
      </Text>
    );
  };

  const getTextColor = () => {
    switch (variant) {
      case 'ghost':
      case 'outline':
        return 'primary';
      case 'danger':
        return 'white';
      default:
        return 'white';
    }
  };

  const renderButton = () => {
    const baseStyle = [
      styles.base,
      sizeStyles[size],
      fullWidth && styles.fullWidth,
      disabled && styles.disabled,
      style,
    ];

    if (variant === 'primary') {
      return (
        <LinearGradient
          colors={disabled ? [colors.voidElevated, colors.voidElevated] : colors.gradientPrimary as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, sizeStyles[size], fullWidth && styles.fullWidth]}
        >
          {getButtonContent()}
        </LinearGradient>
      );
    }

    return (
      <Animated.View
        style={[
          baseStyle,
          variant === 'secondary' && styles.secondary,
          variant === 'ghost' && styles.ghost,
          variant === 'outline' && styles.outline,
          variant === 'danger' && styles.danger,
        ]}
      >
        {getButtonContent()}
      </Animated.View>
    );
  };

  return (
    <AnimatedTouchable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={1}
      style={[animatedStyle, fullWidth && styles.fullWidth]}
    >
      {renderButton()}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.base,
    flexDirection: 'row',
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.base,
  },
  fullWidth: {
    width: '100%',
  },
  secondary: {
    backgroundColor: colors.voidElevated,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  danger: {
    backgroundColor: colors.error,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Button;
