import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { WebView } from 'react-native-webview';
import {
  responsiveHeight as hp,
  responsiveWidth as wp,
  responsiveFontSize as RF,
} from 'react-native-responsive-dimensions';

const { width, height } = Dimensions.get('window');

const TrailerPlayer = ({ route, navigation }) => {
  const { videoKey, videoTitle, contentTitle } = route.params;
  const [error, setError] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {contentTitle}
          </Text>
          <Text style={styles.videoSubtitle} numberOfLines={1}>
            {videoTitle}
          </Text>
        </View>
      </View>

      {/* Video Player */}
      <View style={styles.playerContainer}>
        {!error ? (
          <WebView
            source={{ uri: `https://www.youtube.com/embed/${videoKey}` }}
            style={{ alignSelf: 'center' }}
            width={width}
            height={height * 0.3}
            javaScriptEnabled={true}
            allowsFullscreenVideo={true}
          />
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load video</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => setError(false)}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Video Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.videoTitle}>{videoTitle}</Text>
        <Text style={styles.contentInfo}>From: {contentTitle}</Text>

        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.controlButtonText}>Back to Videos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.youtubeButton]}
            onPress={() => {
              const youtubeUrl = `https://www.youtube.com/watch?v=${videoKey}`;
              Alert.alert(
                'Open in YouTube',
                'Would you like to open this video in the YouTube app or browser?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Open YouTube',
                    onPress: () => {
                      Linking.openURL(youtubeUrl);
                    },
                  },
                ],
              );
            }}
          >
            <Text style={styles.controlButtonText}>Open in YouTube</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: hp(6),
    paddingHorizontal: wp(4),
    paddingBottom: hp(2),
    backgroundColor: '#000',
  },
  backButton: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(3),
  },
  backButtonText: {
    color: 'white',
    fontSize: RF(3),
    fontWeight: 'bold',
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: RF(2.2),
    fontWeight: 'bold',
    color: 'white',
  },
  videoSubtitle: {
    fontSize: RF(1.8),
    color: '#ccc',
    marginTop: hp(0.2),
  },
  playerContainer: {
    height: hp(30),
    width: '100%',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webView: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    zIndex: 1,
  },
  loadingText: {
    color: 'white',
    fontSize: RF(1.8),
    marginTop: hp(2),
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'white',
    fontSize: RF(2),
    marginBottom: hp(2),
  },
  retryButton: {
    backgroundColor: '#ff0000',
    paddingHorizontal: wp(6),
    paddingVertical: hp(1.5),
    borderRadius: wp(2),
  },
  retryButtonText: {
    color: 'white',
    fontSize: RF(1.8),
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: wp(5),
  },
  videoTitle: {
    fontSize: RF(2.4),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp(1),
  },
  contentInfo: {
    fontSize: RF(1.8),
    color: '#666',
    marginBottom: hp(3),
  },
  controlsContainer: {
    marginTop: hp(2),
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(3),
  },
  controlButton: {
    backgroundColor: '#007bff',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(6),
    borderRadius: wp(2),
    alignItems: 'center',
    marginBottom: hp(1),
  },
  youtubeButton: {
    backgroundColor: '#ff0000',
  },
  toggleButton: {
    backgroundColor: '#28a745',
  },
  controlButtonText: {
    color: 'white',
    fontSize: RF(1.8),
    fontWeight: '600',
  },
});

export default TrailerPlayer;
