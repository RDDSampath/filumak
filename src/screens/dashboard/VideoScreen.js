import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {
  responsiveHeight as hp,
  responsiveWidth as wp,
  responsiveFontSize as RF,
} from 'react-native-responsive-dimensions';
import Api from '../../Api/Api';

const { width, height } = Dimensions.get('window');

const VideoScreen = ({ route, navigation }) => {
  const { details, title } = route.params;
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const contentType = details.title ? 'movie' : 'tv';
      const videosData = await Api.getMovieVideos(details.id, contentType);

      if (videosData?.results) {
        // Filter and sort videos - prioritize trailers and official content
        const sortedVideos = videosData.results
          .filter(video => video.site === 'YouTube') // Only YouTube videos
          .sort((a, b) => {
            // Prioritize official content
            if (a.official && !b.official) return -1;
            if (!a.official && b.official) return 1;

            // Prioritize trailers
            if (a.type === 'Trailer' && b.type !== 'Trailer') return -1;
            if (a.type !== 'Trailer' && b.type === 'Trailer') return 1;

            // Sort by publish date (newest first)
            return new Date(b.published_at) - new Date(a.published_at);
          });

        setVideos(sortedVideos);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      Alert.alert('Error', 'Failed to load videos. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openTrailerPlayer = (videoKey, videoTitle) => {
    navigation.navigate('TrailerPlayer', {
      videoKey,
      videoTitle,
      contentTitle: getContentTitle(),
    });
  };

  const formatDuration = seconds => {
    if (!seconds) return '';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getVideoTypeColor = type => {
    switch (type) {
      case 'Trailer':
        return '#ff4757';
      case 'Teaser':
        return '#ffa502';
      case 'Clip':
        return '#3742fa';
      case 'Behind the Scenes':
        return '#2ed573';
      case 'Featurette':
        return '#a55eea';
      default:
        return '#747d8c';
    }
  };

  const renderVideoItem = ({ item }) => (
    <TouchableOpacity
      style={styles.videoItem}
      onPress={() => openTrailerPlayer(item.key, item.name)}
    >
      <View style={styles.videoInfo}>
        <View style={styles.videoHeader}>
          <Text style={styles.videoTitle} numberOfLines={2}>
            {item.name}
          </Text>
          {item.official && (
            <View style={styles.officialBadge}>
              <Text style={styles.officialText}>OFFICIAL</Text>
            </View>
          )}
        </View>

        <View style={styles.videoDetails}>
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: getVideoTypeColor(item.type) },
            ]}
          >
            <Text style={styles.typeText}>{item.type}</Text>
          </View>

          <Text style={styles.videoMeta}>
            {item.size}p • {new Date(item.published_at).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.playButton}>
          <Text style={styles.playButtonText}>▶ Watch Trailer</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const getContentTitle = () => {
    return details.title || details.name || 'Unknown Title';
  };

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
        <Text style={styles.headerTitle}>Videos</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.contentTitle}>{getContentTitle()}</Text>
          <Text style={styles.videoCount}>
            {videos.length} video{videos.length !== 1 ? 's' : ''} available
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={styles.loadingText}>Loading videos...</Text>
          </View>
        ) : videos.length > 0 ? (
          <FlatList
            data={videos}
            renderItem={renderVideoItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.videosList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.noVideosContainer}>
            <Text style={styles.noVideosText}>No videos available</Text>
            <Text style={styles.noVideosSubText}>
              Check back later for trailers and clips
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
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
  },
  backButton: {
    width: wp(10),
    height: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(4),
  },
  backButtonText: {
    color: 'black',
    fontSize: RF(3),
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: RF(2.8),
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  content: {
    flex: 1,
    marginBottom: hp(8),
  },
  titleSection: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  contentTitle: {
    fontSize: RF(2.6),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp(0.5),
  },
  videoCount: {
    fontSize: RF(1.8),
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(10),
  },
  loadingText: {
    fontSize: RF(1.8),
    color: '#666',
    marginTop: hp(2),
  },
  noVideosContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(10),
  },
  noVideosText: {
    fontSize: RF(2.2),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp(1),
  },
  noVideosSubText: {
    fontSize: RF(1.8),
    color: '#666',
    textAlign: 'center',
  },
  videosList: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
  },
  videoItem: {
    backgroundColor: '#fff',
    borderRadius: wp(3),
    marginBottom: hp(2),
    padding: wp(4),
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  videoInfo: {
    flex: 1,
  },
  videoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(1),
  },
  videoTitle: {
    fontSize: RF(2.0),
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: wp(2),
  },
  officialBadge: {
    backgroundColor: '#28a745',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.3),
    borderRadius: wp(1),
  },
  officialText: {
    color: 'white',
    fontSize: RF(1.2),
    fontWeight: 'bold',
  },
  videoDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.5),
  },
  typeBadge: {
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.5),
    borderRadius: wp(1),
    marginRight: wp(3),
  },
  typeText: {
    color: 'white',
    fontSize: RF(1.4),
    fontWeight: '600',
  },
  videoMeta: {
    fontSize: RF(1.6),
    color: '#666',
  },
  playButton: {
    backgroundColor: '#ff0000',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    borderRadius: wp(2),
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  playButtonText: {
    color: 'white',
    fontSize: RF(1.8),
    fontWeight: 'bold',
  },
});

export default VideoScreen;
