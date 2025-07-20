import React, { useState, useEffect } from 'react';
import 'react-native-gesture-handler';
import { store } from './src/store/store';
import { Provider } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Image, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  responsiveHeight as hp,
  responsiveWidth as wp,
  responsiveFontSize as RF,
} from 'react-native-responsive-dimensions';
import { images } from './src/constants';
import { MovieNav, TvNav, SearchNav, DashboardNav } from './src/navigations';
import SplashScreen from './src/screens/SplashScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleSplashFinish = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <Provider store={store}>
        <SplashScreen onFinish={handleSplashFinish} />
      </Provider>
    );
  }

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={() => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                  backgroundColor: '#ffffff',
                  height: wp(25),
                  paddingBottom: wp(2),
                  paddingTop: wp(1),
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                },
              })}
            >
              <Tab.Screen
                name="Dashboard"
                component={DashboardNav}
                options={() => ({
                  tabBarIcon: ({ focused }) => (
                    <View
                      style={[
                        styles.tabIconContainer,
                        focused && styles.activeTabContainer,
                      ]}
                    >
                      <Image
                        source={images.dashboard}
                        style={[
                          styles.bottomTabIcons,
                          { tintColor: focused ? '' : '#666666' },
                        ]}
                      />
                      <Text
                        style={[
                          styles.tabLabel,
                          { color: focused ? '#007bff' : '#666666' },
                        ]}
                      >
                        Dashboard
                      </Text>
                    </View>
                  ),
                })}
              />
              <Tab.Screen
                name="Movie"
                component={MovieNav}
                options={() => ({
                  tabBarIcon: ({ focused }) => (
                    <View
                      style={[
                        styles.tabIconContainer,
                        focused && styles.activeTabContainer,
                      ]}
                    >
                      <Image
                        source={images.movie}
                        style={[
                          styles.bottomTabIcons,
                          { tintColor: focused ? '#007bff' : '#666666' },
                        ]}
                      />
                      <Text
                        style={[
                          styles.tabLabel,
                          { color: focused ? '#007bff' : '#666666' },
                        ]}
                      >
                        Movies
                      </Text>
                    </View>
                  ),
                })}
              />
              <Tab.Screen
                name="Tv"
                component={TvNav}
                options={{
                  tabBarIcon: ({ focused }) => (
                    <View
                      style={[
                        styles.tabIconContainer,
                        focused && styles.activeTabContainer,
                      ]}
                    >
                      <Image
                        source={images.tv}
                        style={[
                          styles.bottomTabIcons,
                          { tintColor: focused ? '#007bff' : '#666666' },
                        ]}
                      />
                      <Text
                        style={[
                          styles.tabLabel,
                          { color: focused ? '#007bff' : '#666666' },
                        ]}
                      >
                        TV Shows
                      </Text>
                    </View>
                  ),
                }}
              />
              <Tab.Screen
                name="Search"
                component={SearchNav}
                options={{
                  tabBarIcon: ({ focused }) => (
                    <View
                      style={[
                        styles.tabIconContainer,
                        focused && styles.activeTabContainer,
                      ]}
                    >
                      <Image
                        source={images.search}
                        style={[
                          styles.bottomTabIcons,
                          { tintColor: focused ? '#007bff' : '#666666' },
                        ]}
                      />
                      <Text
                        style={[
                          styles.tabLabel,
                          { color: focused ? '#007bff' : '#666666' },
                        ]}
                      >
                        Search
                      </Text>
                    </View>
                  ),
                }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </Provider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(25),
    height: wp(10),
    paddingVertical: wp(0.5),
  },
  activeTabContainer: {
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    borderRadius: wp(2),
  },
  bottomTabIcons: {
    height: wp(5.5),
    width: wp(5.5),
  },
  tabLabel: {
    fontSize: RF(1.3),
    fontWeight: '600',
    marginTop: wp(0.5),
  },
  searchIcon: {
    fontSize: wp(6),
    textAlign: 'center',
  },
  dashboardIcon: {
    fontSize: wp(6),
    textAlign: 'center',
  },
});

export default App;
