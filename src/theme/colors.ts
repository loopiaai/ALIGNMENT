// ALIGNMENT Design System - Colors
// Hypnotic Dark Minimalism Theme

export const colors = {
  // Core Backgrounds
  void: '#050506',
  voidDeep: '#020203',
  voidSurface: '#0A0A0C',
  voidElevated: '#0F0F12',
  voidCard: '#141418',
  
  // Primary Accent - Ethereal Violet Pulse
  primary: '#8B5CF6',
  primaryLight: '#A78BFA',
  primaryDark: '#7C3AED',
  primaryMuted: '#6D28D9',
  primaryGlow: 'rgba(139, 92, 246, 0.4)',
  primarySubtle: 'rgba(139, 92, 246, 0.15)',
  
  // Secondary - Indigo Depths
  secondary: '#6366F1',
  secondaryLight: '#818CF8',
  secondaryDark: '#4F46E5',
  secondaryGlow: 'rgba(99, 102, 241, 0.4)',
  
  // Accent - Cosmic Teal
  accent: '#14B8A6',
  accentLight: '#2DD4BF',
  accentDark: '#0D9488',
  accentGlow: 'rgba(20, 184, 166, 0.4)',
  
  // Text Hierarchy
  textPrimary: '#F8F8FA',
  textSecondary: 'rgba(248, 248, 250, 0.72)',
  textTertiary: 'rgba(248, 248, 250, 0.48)',
  textMuted: 'rgba(248, 248, 250, 0.32)',
  textDisabled: 'rgba(248, 248, 250, 0.16)',
  
  // Semantic
  success: '#10B981',
  successGlow: 'rgba(16, 185, 129, 0.4)',
  warning: '#F59E0B',
  warningGlow: 'rgba(245, 158, 11, 0.4)',
  error: '#EF4444',
  errorGlow: 'rgba(239, 68, 68, 0.4)',
  
  // Special States
  resonance: '#8B5CF6',
  resonanceHigh: '#22D3EE',
  resonancePerfect: '#F0ABFC',
  
  // Gradients (as arrays for LinearGradient)
  gradientPrimary: ['#6366F1', '#8B5CF6', '#A855F7'],
  gradientVoid: ['#050506', '#0A0A0C', '#0F0F12'],
  gradientGlow: ['rgba(139, 92, 246, 0)', 'rgba(139, 92, 246, 0.2)', 'rgba(139, 92, 246, 0)'],
  gradientReveal: ['#8B5CF6', '#EC4899', '#F43F5E'],
  gradientSuccess: ['#059669', '#10B981', '#34D399'],
  
  // Overlays
  overlayLight: 'rgba(255, 255, 255, 0.04)',
  overlayMedium: 'rgba(255, 255, 255, 0.08)',
  overlayHeavy: 'rgba(255, 255, 255, 0.12)',
  overlayDark: 'rgba(0, 0, 0, 0.6)',
  overlayDarker: 'rgba(0, 0, 0, 0.8)',
  
  // Borders
  border: 'rgba(255, 255, 255, 0.06)',
  borderLight: 'rgba(255, 255, 255, 0.1)',
  borderActive: 'rgba(139, 92, 246, 0.4)',
  
  // Transparent
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
};

export type ColorKey = keyof typeof colors;
