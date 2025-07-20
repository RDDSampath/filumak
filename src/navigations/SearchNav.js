import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchScreen from '../screens/dashboard/SearchScreen';
import DetailsScreen from '../screens/dashboard/DetailsScreen';
import VideoScreen from '../screens/dashboard/VideoScreen';
import TrailerPlayer from '../screens/dashboard/TrailerPlayer';

const Stack = createNativeStackNavigator();

const SearchNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="SearchScreen"
    >
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
      <Stack.Screen name="VideoScreen" component={VideoScreen} />
      <Stack.Screen name="TrailerPlayer" component={TrailerPlayer} />
    </Stack.Navigator>
  );
};

export default SearchNav;
