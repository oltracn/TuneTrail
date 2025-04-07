/**
 * Main App component setting up Navigation
 * @format
 */
import 'react-native-gesture-handler'; // Required for React Navigation gesture handling
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SearchProvider } from './src/context/SearchContext'; // Import the provider

// Import screen components
import HomeScreen from './src/screens/HomeScreen';
import AddUrlScreen from './src/screens/AddUrlScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Define the stack navigator
const Stack = createNativeStackNavigator();

// Define the type for the stack parameters (optional but good practice)
export type RootStackParamList = {
  Home: undefined; // No params expected for Home
  AddUrl: undefined; // No params expected for AddUrl (URL might be passed differently or handled via state)
  Settings: undefined; // No params expected for Settings
};

function App(): React.JSX.Element {
  return (
    <SearchProvider> {/* Wrap the navigator with the provider */}
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'TuneTrail Home' }} // Example title
        />
        <Stack.Screen
          name="AddUrl"
          component={AddUrlScreen}
          options={{ title: 'Add Podcast URL' }} // Example title
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Settings' }} // Example title
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SearchProvider>
  );
}

export default App;
