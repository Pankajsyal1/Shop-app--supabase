import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { BRANDING } from '../constants/branding';

function AnimatedSplash({ onFinish }) {
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoSpin = useRef(new Animated.Value(0)).current;
  const ringPulse = useRef(new Animated.Value(0.85)).current;
  const glowFade = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const spinLoop = Animated.loop(
      Animated.timing(logoSpin, {
        toValue: 1,
        duration: 3200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 950,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 0.88,
          duration: 950,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    const ringLoop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ringPulse, {
            toValue: 1.12,
            duration: 1200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(glowFade, {
            toValue: 0.2,
            duration: 1200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(ringPulse, {
            toValue: 0.84,
            duration: 1200,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(glowFade, {
            toValue: 0.55,
            duration: 1200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    spinLoop.start();
    pulseLoop.start();
    ringLoop.start();

    const timeout = setTimeout(onFinish, 2500);

    return () => {
      clearTimeout(timeout);
      spinLoop.stop();
      pulseLoop.stop();
      ringLoop.stop();
    };
  }, [glowFade, logoScale, logoSpin, onFinish, ringPulse]);

  const spin = logoSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.splashRoot}>
      <Animated.View style={[styles.outerRing, { transform: [{ scale: ringPulse }], opacity: glowFade }]} />
      <Animated.View style={[styles.logoCore, { transform: [{ scale: logoScale }, { rotate: spin }] }]}>
        <View style={styles.logoSlash} />
        <View style={styles.logoBarTop} />
        <View style={styles.logoBarBottom} />
      </Animated.View>
      <Text style={styles.splashTitle}>{BRANDING.appName}</Text>
      <Text style={styles.splashTagline}>syncing commerce flow...</Text>
    </View>
  );
}

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      <StatusBar style="light" />
      {showSplash ? (
        <AnimatedSplash onFinish={() => setShowSplash(false)} />
      ) : (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#090d1d' } }} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  splashRoot: {
    flex: 1,
    backgroundColor: '#060910',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  outerRing: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 3,
    borderColor: '#51a6ff',
    backgroundColor: '#3d8fff22',
  },
  logoCore: {
    width: 116,
    height: 116,
    borderRadius: 58,
    borderWidth: 2,
    borderColor: '#73c4ff',
    backgroundColor: '#0f1d3a',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3ea0ff',
    shadowOpacity: 0.6,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },
  logoSlash: {
    position: 'absolute',
    width: 64,
    height: 10,
    borderRadius: 8,
    backgroundColor: '#9cd9ff',
    transform: [{ rotate: '-37deg' }],
  },
  logoBarTop: {
    position: 'absolute',
    width: 38,
    height: 9,
    borderRadius: 7,
    backgroundColor: '#6bb8ff',
    top: 34,
    right: 22,
  },
  logoBarBottom: {
    position: 'absolute',
    width: 38,
    height: 9,
    borderRadius: 7,
    backgroundColor: '#6bb8ff',
    bottom: 34,
    left: 22,
  },
  splashTitle: {
    marginTop: 10,
    fontSize: 34,
    color: '#e8f3ff',
    letterSpacing: 1.4,
    fontWeight: '800',
  },
  splashTagline: {
    color: '#88a5d9',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
