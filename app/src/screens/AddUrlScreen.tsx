import React, { useState, useEffect } from 'react'; // Add useState, useEffect
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  useColorScheme, // Import useColorScheme
  SafeAreaView, // Import SafeAreaView
  StatusBar, // Import StatusBar
  Linking, // Import Linking
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack'; // Import navigation types
import type { RootStackParamList } from '../../App'; // Import stack param list type
import { useSearch } from '../context/SearchContext'; // Import the context hook
import { Text } from 'react-native';
import { useSearch } from '../contexts/SearchContext';

const AddUrlScreen = () => {
  const { error } = useSearch();
  
  return (
    <View>
      {/* 确保错误信息使用 Text 组件包裹 */}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      {/* 其他组件 */}
    </View>
  );
};

// Define navigation props type for this screen
type AddUrlScreenProps = NativeStackScreenProps<RootStackParamList, 'AddUrl'>;

// Remove explicit type annotation from function signature
const AddUrlScreen = ({ navigation }: { navigation: AddUrlScreenProps['navigation'] }) => { // Access navigation prop directly
  const isDarkMode = useColorScheme() === 'dark';
  const [url, setUrl] = useState('');
  const [initialUrlChecked, setInitialUrlChecked] = useState(false); // Track initial URL check
  const { setIsLoading, setResults, clearResults } = useSearch(); // Get functions from context

  // Use 10.0.2.2 for Android Emulator to connect to host's localhost
  // For physical devices, replace with your computer's local IP address
  // TODO: Consider moving API endpoint to a config file or context
  const API_ENDPOINT = 'http://10.0.2.2:3002/api/process-url';

  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? '#333' : '#F3F3F3',
  };

  // Effect to check for initial URL from sharing (moved from App.tsx)
  useEffect(() => {
    const getInitialUrl = async () => {
      if (!initialUrlChecked) {
        try {
          const initialUrl = await Linking.getInitialURL();
          if (initialUrl) {
            console.log('Received initial URL via sharing in AddUrlScreen:', initialUrl);
            if (initialUrl.startsWith('http://') || initialUrl.startsWith('https://')) {
               setUrl(initialUrl);
            } else {
               console.warn('Received initial content via sharing, but it does not look like a valid URL:', initialUrl);
            }
          }
        } catch (error) {
          console.error('Error getting initial URL:', error);
        } finally {
          setInitialUrlChecked(true);
        }
      }
    };
    getInitialUrl();
  }, [initialUrlChecked]);

  const handleFindMusic = () => {
    if (!url.trim()) {
      Alert.alert('提示', '请输入播客 Shownotes 的 URL');
      return;
    }

    // Use context functions to manage state
    clearResults(); // Clear previous results
    setIsLoading(true); // Set loading state
    console.log(`查找音乐 URL: ${url}`);
    console.log(`调用 API: ${API_ENDPOINT}`);

    // TODO: Get platform preference from Settings/Global State
    const platformPreference = 'both'; // Hardcoded for now

    fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: url, platform: platformPreference }), // Send platform pref
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errData => {
            throw new Error(errData.error || `HTTP error! status: ${response.status}`);
          }).catch(() => {
            throw new Error(`HTTP error! status: ${response.status}`);
          });
        }
        return response.json();
      })
      .then(data => {
        console.log('API 响应:', data);
        // Update results using context function
        setResults(data.results || []);
        navigation.goBack(); // Navigate back after successful fetch (results are now in context)

      })
      .catch(error => {
        console.error('API 调用失败:', error);
        Alert.alert('错误', `查找音乐失败: ${error.message}`);
        clearResults(); // Clear results on error
      })
      .finally(() => {
        setIsLoading(false); // Set loading state to false regardless of outcome
      });
  };


  return (
     <SafeAreaView style={backgroundStyle}>
       <StatusBar
         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
         backgroundColor={backgroundStyle.backgroundColor}
       />
       <View style={styles.container}>
         <Text style={[styles.label, {color: isDarkMode ? '#CCC' : '#555'}]}>
           粘贴或分享播客 Shownotes 链接:
         </Text>
         <TextInput
           style={[
             styles.input,
             {
               color: isDarkMode ? '#FFF' : '#000',
               borderColor: isDarkMode ? '#555' : '#CCC',
               backgroundColor: isDarkMode ? '#444' : '#FFF',
             },
           ]}
           placeholder="例如: https://..."
           placeholderTextColor={isDarkMode ? '#888' : '#AAA'}
           value={url}
           onChangeText={setUrl}
           keyboardType="url"
           autoCapitalize="none"
           autoCorrect={false}
         />
         <View style={styles.buttonContainer}>
           <Button title="查找音乐" onPress={handleFindMusic} />
         </View>
         {/* Maybe add a small loading indicator here too? */}
       </View>
     </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // justifyContent: 'center', // Remove center alignment
  },
   label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 20, // Add some top margin
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 10, // Adjust margin
  },
});

export default AddUrlScreen;
