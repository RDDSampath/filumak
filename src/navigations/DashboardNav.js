import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import CategoryScreen from '../screens/dashboard/CategoryScreen';
import AboutScreen from '../screens/dashboard/AboutScreen';
import DetailsScreen from '../screens/dashboard/DetailsScreen';
import VideoScreen from '../screens/dashboard/VideoScreen';
import TrailerPlayer from '../screens/dashboard/TrailerPlayer';

const Stack = createNativeStackNavigator();

const DashboardNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="DashboardScreen"
    >
      <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
      <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
      <Stack.Screen name="AboutScreen" component={AboutScreen} />
      <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
      <Stack.Screen name="VideoScreen" component={VideoScreen} />
      <Stack.Screen name="TrailerPlayer" component={TrailerPlayer} />
    </Stack.Navigator>
  );
};

export default DashboardNav;
