import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import {
  responsiveHeight as hp,
  responsiveWidth as wp,
  responsiveFontSize as RF,
} from 'react-native-responsive-dimensions';
import { images } from '../constants/images';

const SplashScreen = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const loadingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    Animated.sequence([
      // Logo animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
      ]),
      // Loading animation delay
      Animated.timing(loadingAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    // Finish splash after 3.5 seconds
    const timer = setTimeout(() => {
      onFinish();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onFinish, fadeAnim, scaleAnim, loadingAnim]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#007bff" barStyle="light-content" />

      {/* Background Gradient Effect */}
      <View style={styles.gradientOverlay} />

      {/* Main Content */}
      <View style={styles.contentContainer}>
        {/* App Logo/Icon */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.logoCircle}>
            <Image source={images.dashboard} style={styles.logo} />
          </View>
          <Text style={styles.appName}>Filumak</Text>
          <Text style={styles.tagline}>Your Movie & TV Show Companion</Text>
        </Animated.View>

        {/* Loading Indicator */}
        <Animated.View
          style={[
            styles.loadingContainer,
            {
              opacity: loadingAnim,
              transform: [
                {
                  translateY: loadingAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Loading...</Text>
          <View style={styles.loadingBar}>
            <View style={styles.loadingProgress} />
          </View>
        </Animated.View>
      </View>

      {/* Footer */}
      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <Text style={styles.footerText}>
          Powered by <Text style={styles.deeText}>Dee</Text>
          <Text style={styles.codeText}>Code</Text>
        </Text>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5baaffff',
    justifyContent: 'space-between',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(10),
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: hp(8),
  },
  logoCircle: {
    width: wp(28),
    height: wp(28),
    borderRadius: wp(14),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(3),
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logo: {
    width: wp(18),
    height: wp(18),
  },
  appName: {
    fontSize: RF(4.8),
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: hp(1),
    letterSpacing: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: RF(2),
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: RF(2.8),
    fontWeight: '300',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: RF(1.8),
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: hp(2),
    textAlign: 'center',
    fontWeight: '400',
  },
  loadingBar: {
    width: wp(60),
    height: hp(0.5),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: hp(0.25),
    marginTop: hp(2),
    overflow: 'hidden',
  },
  loadingProgress: {
    width: '70%',
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: hp(0.25),
  },
  footer: {
    alignItems: 'center',
    paddingBottom: hp(4),
  },
  footerText: {
    fontSize: RF(1.6),
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: hp(0.5),
    fontWeight: '300',
  },
  deeText: {
    color: '#FF6B35', // Orange color
    fontWeight: 'bold',
  },
  codeText: {
    color: '#000000', // Black color
    fontWeight: 'bold',
  },
  versionText: {
    fontSize: RF(1.4),
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '300',
  },
});

export default SplashScreen;
