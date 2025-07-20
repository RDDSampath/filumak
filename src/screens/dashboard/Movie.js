import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMovie } from '../../store/movieReducer';

const Movie = ({ navigation }) => {
  const {
    data: movieData,
    currentPage,
    totalPages,
    isLoader,
  } = useSelector(state => state.movie);
  const movie = movieData?.results;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMovie(1));
  }, [dispatch]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      dispatch(fetchMovie(currentPage + 1));
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      dispatch(fetchMovie(currentPage - 1));
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
        source={{ uri: 'https://image.tmdb.org/t/p/w500' + item.poster_path }}
        resizeMode="cover"
        style={styles.imagePlaceholder}
      >
        <Text style={styles.movieTitle}>{item.title}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Movies</Text>
      <FlatList
        data={movie}
        renderItem={({ item }) => <MovieItem item={item} />}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[
            styles.paginationButton,
            currentPage === 1 && styles.disabledButton,
          ]}
          onPress={handlePreviousPage}
          disabled={currentPage === 1 || isLoader}
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
          disabled={currentPage === totalPages || isLoader}
        >
          <Image
            source={require('../../assets/images/left.png')}
            style={styles.paginationIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    justifyContent: 'center',
    padding: 10,
    paddingBottom: 80, // Add space for pagination
  },
  movieItem: {
    flex: 1,
    margin: 10,
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: 150,
    height: 200,
    justifyContent: 'flex-end', // To position the title at the bottom
    borderRadius: 10,
    overflow: 'hidden',
  },
  movieTitle: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Background for better text visibility
    color: 'white',
    padding: 5,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#333333',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
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
    borderRadius: 20,
    minWidth: 40,
    minHeight: 40,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  paginationIcon: {
    width: 20,
    height: 20,
    tintColor: '#007bff',
  },
  pageInfo: {
    fontSize: 16,
    color: '#000000',
    backgroundColor: 'rgba(255, 255, 255)',
    padding: 8,
    borderRadius: 5,
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
    fontWeight: 'bold',
  },
});

export default Movie;
