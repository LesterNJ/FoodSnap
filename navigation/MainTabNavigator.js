import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import CameraScreen from '../screens/CameraScreen';
import SearchScreen from '../screens/SearchScreen';
import FoodScreen from '../screens/FoodScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

HomeStack.path = '';

const CameraStack = createStackNavigator(
  {
    Camera: CameraScreen,
  },
  config
);

CameraStack.navigationOptions = {
  tabBarLabel: 'Capture',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-restaurant' : 'md-restaurant'}
    />
  ),
};

CameraStack.path = '';

const SearchStack = createStackNavigator(
  {
    Search: SearchScreen,
  },
  config
);

SearchStack.navigationOptions = {
  tabBarLabel: 'Search',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'}
    />
  ),
};

SearchStack.path = '';

const FoodStack = createStackNavigator(
  {
    Food: FoodScreen,
  },
  config
);

FoodStack.navigationOptions = {
  tabBarLabel: 'Food',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};

FoodStack.path = '';

const tabNavigator = createBottomTabNavigator(
  {
    HomeStack,
    CameraStack,
    SearchStack,
    // FoodStack
  },
  {
    tabBarOptions: {
      style: {
        backgroundColor: 'black',
      },
    },
  }
);

tabNavigator.path = '';

export default tabNavigator;
