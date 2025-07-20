import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Movie from '../screens/dashboard/Movie';
import DetailsScreen from '../screens/dashboard/DetailsScreen';
import VideoScreen from '../screens/dashboard/VideoScreen';
import TrailerPlayer from '../screens/dashboard/TrailerPlayer';

const Stack = createNativeStackNavigator();

const MovieNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="MovieScreen">
      <Stack.Screen name="MovieScreen" component={Movie} />
      <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
      <Stack.Screen name="VideoScreen" component={VideoScreen} />
      <Stack.Screen name="TrailerPlayer" component={TrailerPlayer} />
    </Stack.Navigator>
  );
};

export default MovieNav;
