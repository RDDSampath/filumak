import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import {
  responsiveHeight as hp,
  responsiveWidth as wp,
  responsiveFontSize as RF,
} from 'react-native-responsive-dimensions';
import Api from '../../Api/Api';
import { images } from '../../constants';

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState('movie'); // 'movie' or 'tv'

  const handleSearch = async (
    query = searchQuery,
    page = 1,
    contentType = activeTab,
  ) => {
    if (!query.trim()) {
      Alert.alert('Search Error', 'Please enter a search term');
      return;
    }

    setIsLoading(true);
    try {
      let response;
      if (contentType === 'movie') {
        response = await Api.searchMovies(query, page, 2025);
      } else {
        response = await Api.searchTv(query, page, 2025);
      }

      if (response) {
        setSearchResults(response.results || []);
        setCurrentPage(response.page || 1);
        setTotalPages(response.total_pages || 1);
        setHasSearched(true);
      } else {
        Alert.alert(
          'Search Error',
          `Failed to search ${
            contentType === 'movie' ? 'movies' : 'TV shows'
          }. Please try again.`,
        );
      }
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Search Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = tab => {
    setActiveTab(tab);
    if (hasSearched && searchQuery.trim()) {
      // Re-search with new content type
      handleSearch(searchQuery, 1, tab);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages && !isLoading) {
      handleSearch(searchQuery, currentPage + 1, activeTab);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1 && !isLoading) {
      handleSearch(searchQuery, currentPage - 1, activeTab);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setCurrentPage(1);
    setTotalPages(1);
    setHasSearched(false);
  };

  const SearchResultItem = ({ item }) => {
    const title = item.title || item.name || 'Unknown Title';
    const releaseDate = item.release_date || item.first_air_date;
    const contentType = activeTab === 'movie' ? 'Movie' : 'TV Shows';

    return (
      <TouchableOpacity
        style={styles.movieItem}
        onPress={() =>
          navigation.navigate('DetailsScreen', {
            details: item,
            title: contentType,
          })
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
              {title}
            </Text>
            <Text style={styles.movieYear}>
              {releaseDate ? new Date(releaseDate).getFullYear() : 'N/A'}
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
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Search</Text>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'movie' && styles.activeTabButton,
          ]}
          onPress={() => handleTabChange('movie')}
          disabled={isLoading}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'movie' && styles.activeTabButtonText,
            ]}
          >
            Movies
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'tv' && styles.activeTabButton,
          ]}
          onPress={() => handleTabChange('tv')}
          disabled={isLoading}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'tv' && styles.activeTabButtonText,
            ]}
          >
            TV Shows
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={`Search for ${
              activeTab === 'movie' ? 'movies' : 'TV shows'
            }`}
            placeholderTextColor={'#999999'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch()}
            returnKeyType="search"
            editable={!isLoading}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearSearch}
              disabled={isLoading}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.searchButton,
            isLoading && styles.disabledButtonsearch,
          ]}
          onPress={() => handleSearch()}
          disabled={isLoading || !searchQuery.trim()}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Image source={images.search} style={styles.searchButtonIcon} />
          )}
        </TouchableOpacity>
      </View>

      {/* Search Results */}
      <View style={styles.resultsContainer}>
        {isLoading && !hasSearched ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        ) : hasSearched ? (
          <>
            {searchResults.length > 0 ? (
              <>
                <Text style={styles.resultsHeader}>
                  Found {searchResults.length}{' '}
                  {activeTab === 'movie' ? 'movies' : 'TV shows'} for "
                  {searchQuery}"
                </Text>
                <FlatList
                  data={searchResults}
                  renderItem={({ item }) => <SearchResultItem item={item} />}
                  keyExtractor={item => item.id.toString()}
                  numColumns={2}
                  contentContainerStyle={styles.listContainer}
                  showsVerticalScrollIndicator={false}
                />
              </>
            ) : (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>
                  No {activeTab === 'movie' ? 'movies' : 'TV shows'} found for "
                  {searchQuery}"
                </Text>
                <Text style={styles.noResultsSubtext}>
                  Try different keywords
                </Text>
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>🔍</Text>
            <Text style={styles.emptyStateTitle}>
              Search for {activeTab === 'movie' ? 'Movies' : 'TV Shows'}
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Enter a {activeTab === 'movie' ? 'movie' : 'TV show'} title,
              actor, or genre to find content
            </Text>
          </View>
        )}
      </View>

      {/* Pagination */}
      {hasSearched && searchResults.length > 0 && totalPages > 1 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            style={[
              styles.paginationButton,
              currentPage === 1 && styles.disabledButton,
            ]}
            onPress={handlePreviousPage}
            disabled={currentPage === 1 || isLoading}
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
            disabled={currentPage === totalPages || isLoading}
          >
            <Image
              source={require('../../assets/images/left.png')}
              style={styles.paginationIcon}
            />
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
    fontSize: RF(2.8),
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: hp(2),
    color: '#333333',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: wp(5),
    marginBottom: hp(2),
    backgroundColor: '#f8f9fa',
    borderRadius: wp(3),
    padding: wp(1),
  },
  tabButton: {
    flex: 1,
    paddingVertical: hp(1.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(2.5),
  },
  activeTabButton: {
    backgroundColor: '#007bff',
  },
  tabButtonText: {
    fontSize: RF(1.8),
    fontWeight: '600',
    color: '#666',
  },
  activeTabButtonText: {
    color: '#ffffff',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp(5),
    marginBottom: hp(2),
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: wp(3),
    marginRight: wp(3),
    paddingHorizontal: wp(4),
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  searchInput: {
    flex: 1,
    fontSize: RF(1.8),
    paddingVertical: hp(1.5),
    color: '#333',
  },
  clearButton: {
    padding: wp(1),
  },
  clearButtonText: {
    fontSize: RF(2),
    color: '#666',
    fontWeight: 'bold',
  },
  searchButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: wp(6),
    minWidth: wp(12),
    minHeight: wp(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonIcon: {
    width: wp(6),
    height: wp(6),
    tintColor: '#007bff',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  disabledButtonsearch: {
    backgroundColor: '#007bff',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: wp(5),
  },
  resultsHeader: {
    fontSize: RF(1.8),
    color: '#666',
    marginBottom: hp(1.5),
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: hp(10),
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: RF(1.8),
    color: '#666',
    marginTop: hp(1),
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: RF(2),
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noResultsSubtext: {
    fontSize: RF(1.6),
    color: '#666',
    textAlign: 'center',
    marginTop: hp(1),
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: RF(8),
    marginBottom: hp(2),
    color: '#000',
  },
  emptyStateTitle: {
    fontSize: RF(2.4),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp(1),
  },
  emptyStateSubtext: {
    fontSize: RF(1.6),
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: wp(10),
    lineHeight: RF(2.2),
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp(5),
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
  },
  paginationButton: {
    backgroundColor: '#ffffff',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(5),
    minWidth: wp(10),
    minHeight: wp(10),
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
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
    backgroundColor: 'rgba(255, 255, 255)',
    padding: wp(2),
    borderRadius: wp(1.5),
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  pageNumber: {
    color: '#007bff',
  },
});

export default SearchScreen;
