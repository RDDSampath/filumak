import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import {
  responsiveHeight as hp,
  responsiveWidth as wp,
  responsiveFontSize as RF,
} from 'react-native-responsive-dimensions';
import Api from '../../Api/Api';
import { images } from '../../constants';

const DashboardScreen = ({ navigation }) => {
  const [nowPlaying, setNowPlaying] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState({
    nowPlaying: true,
    popular: true,
    topRated: true,
    upcoming: true,
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      // Fetch all data in parallel
      const [nowPlayingData, popularData, topRatedData, upcomingData] =
        await Promise.all([
          Api.getNowPlayingMovies(1),
          Api.getPopularMovies(1),
          Api.getTopRatedMovies(1),
          Api.getUpcomingMovies(1),
        ]);

      if (nowPlayingData) {
        setNowPlaying(nowPlayingData.results?.slice(0, 10) || []);
      }
      if (popularData) {
        setPopular(popularData.results?.slice(0, 10) || []);
      }
      if (topRatedData) {
        setTopRated(topRatedData.results?.slice(0, 10) || []);
      }
      if (upcomingData) {
        setUpcoming(upcomingData.results?.slice(0, 10) || []);
      }

      setLoading({
        nowPlaying: false,
        popular: false,
        topRated: false,
        upcoming: false,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading({
        nowPlaying: false,
        popular: false,
        topRated: false,
        upcoming: false,
      });
    }
  };

  const MovieItem = ({ item, category }) => (
    <TouchableOpacity
      style={styles.movieItem}
      onPress={() =>
        navigation.navigate('DetailsScreen', { details: item, title: 'Movie' })
      }
    >
      <ImageBackground
        source={{
          uri: item.poster_path
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : 'https://via.placeholder.com/300x450?text=No+Image',
        }}
        resizeMode="cover"
        style={styles.moviePoster}
      >
        <View style={styles.movieOverlay}>
          <Text style={styles.movieTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>
              ⭐ {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  const MovieSection = ({ title, data, isLoading, categoryKey }) => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('CategoryScreen', {
              category: categoryKey,
              title: title,
            })
          }
        >
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#007bff" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <MovieItem item={item} category={categoryKey} />
          )}
          keyExtractor={item => `${categoryKey}-${item.id}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Welcome Section with Dashboard Image */}
      <View style={styles.welcomeSection}>
        <Image source={images.dashboard} style={styles.dashboardImage} />
        <View style={styles.welcomeTextContainer}>
          <Text style={styles.welcomeTitle}>Welcome to Filumak !</Text>
          <Text style={styles.welcomeSubtitle}>
            Discover amazing movies and find your next favorite film
          </Text>
        </View>
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => navigation.navigate('AboutScreen')}
        >
          <Image source={images.infoIcon} style={styles.infoButtonIcon} />
        </TouchableOpacity>
      </View>

      {/* Now Playing Section */}
      <MovieSection
        title="Now Playing"
        data={nowPlaying}
        isLoading={loading.nowPlaying}
        categoryKey="now_playing"
      />

      {/* Popular Section */}
      <MovieSection
        title="Popular"
        data={popular}
        isLoading={loading.popular}
        categoryKey="popular"
      />

      {/* Top Rated Section */}
      <MovieSection
        title="Top Rated"
        data={topRated}
        isLoading={loading.topRated}
        categoryKey="top_rated"
      />

      {/* Upcoming Section */}
      <MovieSection
        title="Upcoming"
        data={upcoming}
        isLoading={loading.upcoming}
        categoryKey="upcoming"
      />

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
  welcomeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingTop: hp(4),
    paddingBottom: hp(3),
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  dashboardImage: {
    width: wp(16),
    height: wp(16),
    marginRight: wp(4),
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: RF(2.8),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp(0.5),
  },
  welcomeSubtitle: {
    fontSize: RF(1.6),
    color: '#666',
    lineHeight: RF(2.2),
  },
  infoButton: {
    position: 'absolute',
    top: wp(3),
    right: wp(3),
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: '#ffffffEF',
  },
  infoButtonIcon: {
    width: wp(4),
    height: wp(4),
    tintColor: '#007bff',
  },
  sectionContainer: {
    marginTop: hp(2.5),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    marginBottom: hp(1.5),
  },
  sectionTitle: {
    fontSize: RF(2.2),
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: RF(1.6),
    color: '#007bff',
    fontWeight: '600',
  },
  horizontalList: {
    paddingHorizontal: wp(3),
  },
  movieItem: {
    marginHorizontal: wp(2),
    width: wp(35),
  },
  moviePoster: {
    width: wp(35),
    height: hp(22),
    borderRadius: wp(3),
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  movieOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: wp(2.5),
  },
  movieTitle: {
    color: '#ffffff',
    fontSize: RF(1.5),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: hp(0.5),
  },
  ratingContainer: {
    alignSelf: 'center',
  },
  rating: {
    color: '#ffd700',
    fontSize: RF(1.3),
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(5),
  },
  loadingText: {
    fontSize: RF(1.6),
    color: '#666',
    marginLeft: wp(2),
  },
  bottomSpacing: {
    height: hp(14),
  },
});

export default DashboardScreen;
