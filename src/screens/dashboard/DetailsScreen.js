import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
  Linking,
  Alert,
} from 'react-native';
import {
  responsiveHeight as hp,
  responsiveWidth as wp,
  responsiveFontSize as RF,
} from 'react-native-responsive-dimensions';
import Api from '../../Api/Api';

const { width, height } = Dimensions.get('window');

const DetailsScreen = ({ route, navigation }) => {
  const { details, title } = route.params;
  const [watchProviders, setWatchProviders] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch watch providers on component mount
  useEffect(() => {
    fetchWatchProviders();
  }, []);

  const fetchWatchProviders = async () => {
    setLoading(true);
    try {
      const contentType = details.title ? 'movie' : 'tv';
      const providersData = await Api.getWatchProviders(
        details.id,
        contentType,
      );
      setWatchProviders(providersData);
    } catch (error) {
      console.error('Error fetching watch providers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get watch providers for user's region (defaulting to US)
  const getRegionalProviders = () => {
    if (!watchProviders?.results) return null;

    // You can modify this to detect user's actual region
    const userRegion = 'US'; // Default to US, you can make this dynamic
    return watchProviders.results[userRegion] || null;
  };

  // Helper function to format genres (if available)
  const formatGenres = genreIds => {
    // You can map these IDs to actual genre names if needed
    const genreMap = {
      27: 'Horror',
      28: 'Action',
      35: 'Comedy',
      18: 'Drama',
      53: 'Thriller',
      9648: 'Mystery',
      878: 'Sci-Fi',
      14: 'Fantasy',
      12: 'Adventure',
      16: 'Animation',
    };

    if (!genreIds || !Array.isArray(genreIds)) return 'N/A';
    return genreIds.map(id => genreMap[id] || 'Unknown').join(', ');
  };

  // Get the appropriate title based on content type
  const getTitle = () => {
    return details.title || details.name || 'Unknown Title';
  };

  // Get release date
  const getReleaseDate = () => {
    return details.release_date || details.first_air_date || 'N/A';
  };

  // Handle opening external links
  const handleOpenLink = async url => {
    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          'Unable to open link',
          'Your device cannot open this link. Please try copying the URL manually.',
          [
            {
              text: 'Copy URL',
              onPress: () => {
                // You can implement clipboard functionality here if needed
                console.log('URL to copy:', url);
              },
            },
            { text: 'OK', style: 'cancel' },
          ],
        );
      }
    } catch (error) {
      console.error('Error opening link:', error);
      Alert.alert(
        'Error',
        'Something went wrong while trying to open the link.',
        [{ text: 'OK', style: 'cancel' }],
      );
    }
  };

  // Get the first available watch link
  const getFirstWatchLink = () => {
    const providers = getRegionalProviders();
    if (!providers) return null;

    // Priority order: flatrate (streaming) > free > rent > buy
    const priorityOrder = ['flatrate', 'free', 'rent', 'buy'];

    for (const category of priorityOrder) {
      if (providers[category] && providers[category].length > 0) {
        // Return the general link for the region, as individual provider links aren't available
        return providers.link;
      }
    }

    // If no providers found, return the general link
    return providers.link || null;
  };

  // Handle Watch Now button press
  const handleWatchNow = () => {
    const watchLink = getFirstWatchLink();

    if (watchLink) {
      handleOpenLink(watchLink);
    } else {
      Alert.alert(
        'No Watch Options Available',
        'Sorry, we could not find any streaming options for this content in your region.',
        [
          {
            text: 'Search Online',
            onPress: () => {
              const searchQuery = encodeURIComponent(getTitle());
              const searchUrl = `https://www.google.com/search?q=${searchQuery}+watch+online`;
              handleOpenLink(searchUrl);
            },
          },
          { text: 'OK', style: 'cancel' },
        ],
      );
    }
  };

  // Render watch provider item
  const renderProviderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.providerItem}
      onPress={() => {
        // Open the general watch providers page for this region
        const regionLink = getRegionalProviders()?.link;
        if (regionLink) {
          handleOpenLink(regionLink);
        } else {
          Alert.alert(
            'Provider Info',
            `You selected ${item.provider_name}. This will redirect you to the main watch options page.`,
            [{ text: 'OK', style: 'default' }],
          );
        }
      }}
    >
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w92${item.logo_path}` }}
        style={styles.providerLogo}
      />
      <Text style={styles.providerName}>{item.provider_name}</Text>
    </TouchableOpacity>
  );

  // Render provider section
  const renderProviderSection = (providers, sectionTitle, color) => {
    if (!providers || providers.length === 0) return null;

    return (
      <View style={styles.providerSection}>
        <Text style={[styles.providerSectionTitle, { color }]}>
          {sectionTitle}
        </Text>
        <FlatList
          data={providers}
          renderItem={renderProviderItem}
          keyExtractor={item => item.provider_id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.providersList}
        />
      </View>
    );
  };

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
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      {/* Poster and Main Info */}
      <View style={styles.mainContent}>
        <View style={styles.posterContainer}>
          <Image
            source={{
              uri: details.poster_path
                ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
                : 'https://via.placeholder.com/500x750?text=No+Image',
            }}
            style={styles.posterImage}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.movieTitle}>{getTitle()}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Rating</Text>
              <Text style={styles.statValue}>
                ⭐{' '}
                {details.vote_average ? details.vote_average.toFixed(1) : 'N/A'}
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Votes</Text>
              <Text style={styles.statValue}>
                {details.vote_count || 'N/A'}
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Popularity</Text>
              <Text style={styles.statValue}>
                {details.popularity ? details.popularity.toFixed(0) : 'N/A'}
              </Text>
            </View>
          </View>

          <View style={styles.detailsRow}>
            <Text style={styles.detailLabel}>Release Date:</Text>
            <Text style={styles.detailValue}>{getReleaseDate()}</Text>
          </View>

          <View style={styles.detailsRow}>
            <Text style={styles.detailLabel}>Language:</Text>
            <Text style={styles.detailValue}>
              {details.original_language
                ? details.original_language.toUpperCase()
                : 'N/A'}
            </Text>
          </View>

          <View style={styles.detailsRow}>
            <Text style={styles.detailLabel}>Genres:</Text>
            <Text style={styles.detailValue}>
              {formatGenres(details.genre_ids)}
            </Text>
          </View>

          {details.adult && (
            <View style={styles.adultBadge}>
              <Text style={styles.adultText}>18+</Text>
            </View>
          )}
        </View>
      </View>

      {/* Overview Section */}
      <View style={styles.overviewSection}>
        <Text style={styles.overviewTitle}>Overview</Text>
        <Text style={styles.overviewText}>
          {details.overview || 'No overview available.'}
        </Text>
      </View>

      {/* Watch Providers Section */}
      {getRegionalProviders() && (
        <View style={styles.watchProvidersSection}>
          <Text style={styles.watchProvidersTitle}>Where to Watch</Text>
          {!loading ? (
            <View>
              {renderProviderSection(
                getRegionalProviders()?.flatrate,
                'Stream',
                '#28a745',
              )}
              {renderProviderSection(
                getRegionalProviders()?.rent,
                'Rent',
                '#ffc107',
              )}
              {renderProviderSection(
                getRegionalProviders()?.buy,
                'Buy',
                '#007bff',
              )}
              {renderProviderSection(
                getRegionalProviders()?.free,
                'Free',
                '#6f42c1',
              )}

              {getRegionalProviders()?.link && (
                <TouchableOpacity
                  style={styles.moreInfoButton}
                  onPress={() => handleOpenLink(getRegionalProviders()?.link)}
                >
                  <Text style={styles.moreInfoText}>View More Options</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <Text style={styles.loadingText}>Loading watch providers...</Text>
          )}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.trailerButton]}
          onPress={() => navigation.navigate('VideoScreen', { details, title })}
        >
          <Text style={styles.actionButtonText}>🎬 Watch Trailers</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.discoverButton,
            !getFirstWatchLink() && styles.searchButton,
          ]}
          onPress={handleWatchNow}
        >
          <Text style={styles.actionButtonText}>
            {getFirstWatchLink() ? 'Watch Now' : 'Search Online'}
          </Text>
        </TouchableOpacity>
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
    justifyContent: 'center',
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
  mainContent: {
    flexDirection: 'row',
    padding: wp(5),
    backgroundColor: '#fff',
  },
  posterContainer: {
    marginRight: wp(4),
  },
  posterImage: {
    width: wp(35),
    height: hp(25),
    borderRadius: wp(3),
    resizeMode: 'cover',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  movieTitle: {
    fontSize: RF(2.4),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp(1.5),
    lineHeight: RF(3),
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(2),
    backgroundColor: '#f8f9fa',
    padding: wp(2),
    borderRadius: wp(2),
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: RF(1.6),
    color: '#666',
    marginBottom: hp(0.5),
  },
  statValue: {
    fontSize: RF(1.8),
    fontWeight: 'bold',
    color: '#333',
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: hp(1),
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: RF(1.8),
    fontWeight: '600',
    color: '#555',
    width: wp(25),
  },
  detailValue: {
    fontSize: RF(1.7),
    color: '#333',
    flex: 1,
    flexWrap: 'wrap',
  },
  adultBadge: {
    backgroundColor: '#dc3545',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    borderRadius: wp(1),
    alignSelf: 'flex-start',
    marginTop: hp(1),
  },
  adultText: {
    color: 'white',
    fontSize: RF(1.6),
    fontWeight: 'bold',
  },
  overviewSection: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    backgroundColor: '#fff',
  },
  overviewTitle: {
    fontSize: RF(2.2),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp(1.5),
  },
  overviewText: {
    fontSize: RF(1.8),
    lineHeight: RF(2.6),
    color: '#555',
    textAlign: 'justify',
  },
  watchProvidersSection: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  watchProvidersTitle: {
    fontSize: RF(2.2),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp(1.5),
  },
  providerSection: {
    marginBottom: hp(4),
  },
  providerSectionTitle: {
    fontSize: RF(1.9),
    fontWeight: '600',
    marginBottom: hp(1),
    textTransform: 'uppercase',
  },
  providersList: {
    paddingVertical: hp(0.5),
  },
  providerItem: {
    alignItems: 'center',
    marginRight: wp(4),
    backgroundColor: '#f8f9fa',
    borderRadius: wp(2),
    padding: wp(2),
    minWidth: wp(20),
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  providerLogo: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(2),
    marginBottom: hp(0.5),
  },
  providerName: {
    fontSize: RF(1.4),
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  moreInfoButton: {
    backgroundColor: '#6c757d',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(5),
    borderRadius: wp(2),
    alignItems: 'center',
    marginTop: hp(1),
  },
  moreInfoText: {
    color: 'white',
    fontSize: RF(1.8),
    fontWeight: '600',
  },
  loadingText: {
    fontSize: RF(1.6),
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    gap: wp(3),
  },
  actionButton: {
    flex: 1,
    paddingVertical: hp(2),
    borderRadius: wp(3),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  trailerButton: {
    backgroundColor: '#ff4757',
  },
  discoverButton: {
    backgroundColor: '#007bff',
  },
  searchButton: {
    backgroundColor: '#6c757d',
  },
  actionButtonText: {
    color: 'white',
    fontSize: RF(1.9),
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: hp(12),
  },
});

export default DetailsScreen;
