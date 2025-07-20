import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from 'react-native';
import {
  responsiveHeight as hp,
  responsiveWidth as wp,
  responsiveFontSize as RF,
} from 'react-native-responsive-dimensions';
import { images } from '../../constants';

const AboutScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Filumak</Text>
        <View style={styles.placeholder} />
      </View>

      {/* App Info Section */}
      <View style={styles.appInfoSection}>
        <View style={styles.logoContainer}>
          <Image source={images.dashboard} style={styles.appLogo} />
        </View>
        <Text style={styles.appName}>Filumak</Text>
        <Text style={styles.appTagline}>Your Movie & TV Show Companion</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>

      {/* Description Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About the App</Text>
        <Text style={styles.description}>
          Filumak is your ultimate companion for discovering movies and TV
          shows. Browse through popular, top-rated, now playing, and upcoming
          movies. Search for your favorite content and get detailed information
          including ratings, cast, trailers, and where to watch.
        </Text>
      </View>

      {/* Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🎬</Text>
            <Text style={styles.featureText}>Browse movies by categories</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📺</Text>
            <Text style={styles.featureText}>Discover TV shows</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🔍</Text>
            <Text style={styles.featureText}>Search movies & TV shows</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📊</Text>
            <Text style={styles.featureText}>
              Dashboard with curated content
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>⭐</Text>
            <Text style={styles.featureText}>Ratings and reviews</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🎥</Text>
            <Text style={styles.featureText}>Watch trailers</Text>
          </View>
        </View>
      </View>

      {/* Data Source Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Source</Text>
        <Text style={styles.description}>
          All movie and TV show data is provided by The Movie Database (TMDb).
          TMDb is a community built movie and TV database that's been around
          since 2008.
        </Text>
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => handleLinkPress('https://www.themoviedb.org')}
        >
          <Text style={styles.linkText}>Visit TMDb →</Text>
        </TouchableOpacity>
      </View>

      {/* Developer Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Developer</Text>
        <View style={styles.developerInfo}>
          <View style={styles.logoSection}>
            <Image source={images.deecodeLogo} style={styles.deecodeLogo} />
          </View>
          <Text style={styles.developerName}>
            Developed by <Text style={styles.deeText}>Dee</Text>
            <Text style={styles.codeText}>Code</Text>
          </Text>
          <Text style={styles.realName}>Dhanushka Sampath Rathnayaka</Text>
          <Text style={styles.profession}>Software Engineer</Text>
          <Text style={styles.developerDescription}>
            Building amazing mobile experiences with React Native
          </Text>
          <TouchableOpacity
            style={styles.linkedinButton}
            onPress={() =>
              Linking.openURL('https://www.linkedin.com/in/rddsampath')
            }
          >
            <Text style={styles.linkedinText}>💼 Connect on LinkedIn</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Legal Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Legal</Text>
        <Text style={styles.legalText}>
          This app uses the TMDb API but is not endorsed or certified by TMDb.
          All movie and TV show content, including images and metadata, belongs
          to their respective owners.
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Made with ❤️ using React Native</Text>
        <Text style={styles.copyright}>
          © 2025 DeeCode. All rights reserved.
        </Text>
      </View>

      {/* Bottom spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: hp(3),
    paddingHorizontal: wp(5),
    paddingBottom: hp(2),
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    justifyContent: 'space-between',
  },
  backButton: {
    width: wp(10),
    height: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: 'black',
    fontSize: RF(3),
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: RF(2.4),
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: wp(10),
  },
  appInfoSection: {
    alignItems: 'center',
    paddingVertical: hp(4),
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  logoContainer: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(2),
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  appLogo: {
    width: wp(12),
    height: wp(12),
  },
  appName: {
    fontSize: RF(3.5),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp(0.5),
  },
  appTagline: {
    fontSize: RF(1.8),
    color: '#666',
    textAlign: 'center',
    marginBottom: hp(1),
  },
  version: {
    fontSize: RF(1.6),
    color: '#999',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: wp(2),
  },
  section: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(3),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: RF(2.2),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp(1.5),
  },
  description: {
    fontSize: RF(1.7),
    color: '#555',
    lineHeight: RF(2.5),
    textAlign: 'justify',
  },
  featuresList: {
    marginTop: hp(1),
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.5),
  },
  featureIcon: {
    fontSize: RF(2.2),
    marginRight: wp(3),
    width: wp(8),
  },
  featureText: {
    fontSize: RF(1.7),
    color: '#555',
    flex: 1,
  },
  linkButton: {
    marginTop: hp(1.5),
    alignSelf: 'flex-start',
  },
  linkText: {
    fontSize: RF(1.7),
    color: '#007bff',
    fontWeight: '600',
  },
  developerInfo: {
    alignItems: 'center',
  },
  logoSection: {
    marginBottom: hp(2),
    alignItems: 'center',
  },
  deecodeLogo: {
    width: wp(25),
    height: wp(12),
    resizeMode: 'contain',
  },
  developerName: {
    fontSize: RF(2),
    color: '#333',
    marginBottom: hp(0.5),
    fontWeight: '600',
  },
  realName: {
    fontSize: RF(1.9),
    color: '#007bff',
    marginBottom: hp(0.3),
    fontWeight: '700',
    textAlign: 'center',
  },
  profession: {
    fontSize: RF(1.7),
    color: '#555',
    marginBottom: hp(1),
    fontWeight: '600',
    textAlign: 'center',
  },
  deeText: {
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  codeText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  developerDescription: {
    fontSize: RF(1.6),
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: hp(1.5),
  },
  linkedinButton: {
    backgroundColor: '#0077B5',
    paddingHorizontal: wp(6),
    paddingVertical: hp(1.2),
    borderRadius: wp(3),
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  linkedinText: {
    color: '#ffffff',
    fontSize: RF(1.6),
    fontWeight: '600',
    textAlign: 'center',
  },
  legalText: {
    fontSize: RF(1.6),
    color: '#666',
    lineHeight: RF(2.3),
    textAlign: 'justify',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: hp(3),
    backgroundColor: '#f8f9fa',
  },
  footerText: {
    fontSize: RF(1.7),
    color: '#666',
    marginBottom: hp(0.5),
  },
  copyright: {
    fontSize: RF(1.5),
    color: '#999',
  },
  bottomSpacing: {
    height: hp(2),
  },
});

export default AboutScreen;
