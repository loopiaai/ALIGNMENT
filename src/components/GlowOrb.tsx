// ALIGNMENT - Animated Glow Orb Component
// Creates hypnotic pulsing orb effect

import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

interface GlowOrbProps {
  size?: number;
  color?: string;
  intensity?: 'low' | 'medium' | 'high';
  speed?: 'slow' | 'normal' | 'fast';
  style?: ViewStyle;
}

export const GlowOrb: React.FC<GlowOrbProps> = ({
  size = 200,
  color = colors.primary,
  intensity = 'medium',
  speed = 'normal',
  style,
}) => {
  const pulse = useSharedValue(0);
  const rotate = useSharedValue(0);

  const intensityMap = {
    low: 0.3,
    medium: 0.5,
    high: 0.8,
  };

  const speedMap = {
    slow: 4000,
    normal: 2500,
    fast: 1500,
  };

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: speedMap[speed], easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: speedMap[speed], easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );

    rotate.value = withRepeat(
      withTiming(360, { duration: speedMap[speed] * 4, easing: Easing.linear }),
      -1,
      false
    );
  }, [speed]);

  const animatedOrbStyle = useAnimatedStyle(() => {
    const scale = interpolate(pulse.value, [0, 1], [1, 1.15]);
    const opacity = interpolate(pulse.value, [0, 1], [intensityMap[intensity] * 0.6, intensityMap[intensity]]);

    return {
      transform: [
        { scale },
        { rotate: `${rotate.value}deg` },
      ],
      opacity,
    };
  });

  const animatedGlowStyle = useAnimatedStyle(() => {
    const scale = interpolate(pulse.value, [0, 1], [1.2, 1.5]);
    const opacity = interpolate(pulse.value, [0, 1], [0.1, 0.3]);

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <View style={[styles.container, { width: size * 2, height: size * 2 }, style]}>
      {/* Outer glow */}
      <Animated.View style={[styles.glow, animatedGlowStyle, { width: size * 1.5, height: size * 1.5 }]}>
        <LinearGradient
          colors={[`${color}00`, `${color}40`, `${color}00`]}
          style={styles.gradientFull}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </Animated.View>

      {/* Main orb */}
      <Animated.View style={[styles.orb, animatedOrbStyle, { width: size, height: size }]}>
        <LinearGradient
          colors={[`${color}60`, `${color}30`, `${color}10`]}
          style={styles.gradientFull}
          start={{ x: 0.3, y: 0 }}
          end={{ x: 0.7, y: 1 }}
        />
      </Animated.View>

      {/* Inner core */}
      <View style={[styles.core, { width: size * 0.3, height: size * 0.3, backgroundColor: `${color}20` }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  core: {
    position: 'absolute',
    borderRadius: 9999,
  },
  gradientFull: {
    flex: 1,
    borderRadius: 9999,
  },
});

export default GlowOrb;
