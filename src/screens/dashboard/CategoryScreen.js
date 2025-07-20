import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import {
  responsiveHeight as hp,
  responsiveWidth as wp,
  responsiveFontSize as RF,
} from 'react-native-responsive-dimensions';
import Api from '../../Api/Api';

const CategoryScreen = ({ route, navigation }) => {
  const { category, title } = route.params;
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    fetchMovies(1);
  }, []);

  const fetchMovies = async (page = 1) => {
    if (page === 1) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      let response;
      switch (category) {
        case 'now_playing':
          response = await Api.getNowPlayingMovies(page);
          break;
        case 'popular':
          response = await Api.getPopularMovies(page);
          break;
        case 'top_rated':
          response = await Api.getTopRatedMovies(page);
          break;
        case 'upcoming':
          response = await Api.getUpcomingMovies(page);
          break;
        default:
          response = await Api.getPopularMovies(page);
      }

      if (response) {
        if (page === 1) {
          setMovies(response.results || []);
        } else {
          setMovies(prev => [...prev, ...(response.results || [])]);
        }
        setCurrentPage(response.page || 1);
        setTotalPages(response.total_pages || 1);
      }
    } catch (error) {
      console.error('Error fetching category movies:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages && !isLoadingMore) {
      fetchMovies(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1 && !isLoadingMore) {
      fetchMovies(currentPage - 1);
    }
  };

  const MovieItem = ({ item }) => (
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
            : 'https://via.placeholder.com/500x750?text=No+Image',
        }}
        resizeMode="cover"
        style={styles.imagePlaceholder}
      >
        <View style={styles.movieOverlay}>
          <Text style={styles.movieTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.movieYear}>
            {item.release_date
              ? new Date(item.release_date).getFullYear()
              : 'N/A'}
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

  if (isLoading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading {title}...</Text>
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Movies List */}
      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieItem item={item} />}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            style={[
              styles.paginationButton,
              currentPage === 1 && styles.disabledButton,
            ]}
            onPress={handlePreviousPage}
            disabled={currentPage === 1 || isLoadingMore}
          >
            <Image
              source={require('../../assets/images/right.png')}
              style={styles.paginationIcon}
            />
          </TouchableOpacity>

          <Text style={styles.pageInfo}>
            Page <Text style={styles.pageNumber}>{currentPage}</Text> of{' '}
            <Text style={styles.pageNumber}>{totalPages}</Text>
          </Text>

          <TouchableOpacity
            style={[
              styles.paginationButton,
              currentPage === totalPages && styles.disabledButton,
            ]}
            onPress={handleNextPage}
            disabled={currentPage === totalPages || isLoadingMore}
          >
            {isLoadingMore ? (
              <ActivityIndicator size="small" color="#007bff" />
            ) : (
              <Image
                source={require('../../assets/images/left.png')}
                style={styles.paginationIcon}
              />
            )}
          </TouchableOpacity>
        </View>
      )}
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
  listContainer: {
    padding: wp(2),
    paddingBottom: hp(12),
  },
  movieItem: {
    flex: 1,
    margin: wp(2),
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: wp(40),
    height: hp(25),
    justifyContent: 'flex-end',
    borderRadius: wp(3),
    overflow: 'hidden',
  },
  movieOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: wp(2),
  },
  movieTitle: {
    color: 'white',
    fontSize: RF(1.6),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: hp(0.5),
  },
  movieYear: {
    color: '#cccccc',
    fontSize: RF(1.4),
    textAlign: 'center',
    marginBottom: hp(0.5),
  },
  ratingContainer: {
    alignSelf: 'center',
  },
  rating: {
    color: '#ffd700',
    fontSize: RF(1.4),
    fontWeight: 'bold',
  },
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: RF(1.8),
    color: '#666',
    marginTop: hp(1),
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp(5),
    backgroundColor: '#f8f8f820',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  paginationButton: {
    backgroundColor: '#ffffffEF',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(5),
    minWidth: wp(10),
    minHeight: wp(10),
  },
  disabledButton: {
    backgroundColor: '#ccccccEF',
  },
  paginationIcon: {
    width: wp(5),
    height: wp(5),
    tintColor: '#007bff',
  },
  pageInfo: {
    fontSize: RF(1.6),
    fontWeight: 'bold',
    color: '#000000',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: wp(2),
    borderRadius: wp(1.5),
  },
  pageNumber: {
    color: '#007bff',
  },
});

export default CategoryScreen;
