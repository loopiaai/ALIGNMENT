// ALIGNMENT - Custom Text Component

import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

type TypographyVariant = keyof typeof typography;

interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: keyof typeof colors | string;
  align?: 'left' | 'center' | 'right';
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color = 'textPrimary',
  align = 'left',
  style,
  children,
  ...props
}) => {
  const textColor = color in colors ? colors[color as keyof typeof colors] : color;
  
  return (
    <RNText
      style={[
        typography[variant],
        {
          color: textColor,
          textAlign: align,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

export default Text;
