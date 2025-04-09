import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import AddUrlScreen from './src/screens/AddUrlScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { SearchProvider } from './src/contexts/SearchContext';

const Stack = createStackNavigator();

const App = () => {
  return (
    <SearchProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddUrl" component={AddUrlScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SearchProvider>
  );
};

export default App;
