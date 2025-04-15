import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import AddUrlScreen from './src/screens/AddUrlScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { SearchProvider } from './src/contexts/SearchContext';

// Define the type for the stack navigator parameters
export type RootStackParamList = {
  Home: undefined; // No parameters expected for Home screen
  AddUrl: undefined; // No parameters expected for AddUrl screen
  Settings: undefined; // No parameters expected for Settings screen
  // Add other screens and their parameters here if needed
};

const Stack = createStackNavigator<RootStackParamList>(); // Use the defined type

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
