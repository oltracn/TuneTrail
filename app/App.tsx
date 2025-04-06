/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  useColorScheme,
  Alert,
  ActivityIndicator, // Import ActivityIndicator for loading state
  FlatList, // Import FlatList to display results
  TouchableOpacity, // To make items pressable
  Linking, // To open URLs
} from 'react-native';

// Define the structure of a result item
interface ResultItem {
  mention: string;
  youtubeTitle: string;
  youtubeMusicLink: string | null;
  errorDetails?: string; // Optional error details
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [results, setResults] = useState<ResultItem[]>([]); // Results state

  // Use 10.0.2.2 for Android Emulator to connect to host's localhost
  // For physical devices, replace with your computer's local IP address
  const API_ENDPOINT = 'http://10.0.2.2:3002/api/process-url';

  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? '#333' : '#F3F3F3',
  };

  const handleFindMusic = () => {
    if (!url.trim()) {
      Alert.alert('提示', '请输入播客 Shownotes 的 URL');
      return;
    }

    setIsLoading(true); // Start loading
    setResults([]); // Clear previous results

    console.log(`查找音乐 URL: ${url}`);
    console.log(`调用 API: ${API_ENDPOINT}`);

    fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: url }),
    })
      .then(response => {
        if (!response.ok) {
          // Attempt to read error message from response body
          return response.json().then(errData => {
            throw new Error(errData.error || `HTTP error! status: ${response.status}`);
          }).catch(() => {
            // Fallback if reading error body fails
            throw new Error(`HTTP error! status: ${response.status}`);
          });
        }
        return response.json();
      })
      .then(data => {
        console.log('API 响应:', data);
        if (data.results) {
          setResults(data.results);
        } else {
          // Handle cases where 'results' might be missing, even with a 200 OK
          setResults([]);
          Alert.alert('提示', '未能从 API 获取有效结果。');
        }
      })
      .catch(error => {
        console.error('API 调用失败:', error);
        Alert.alert('错误', `查找音乐失败: ${error.message}`);
        setResults([]); // Clear results on error
      })
      .finally(() => {
        setIsLoading(false); // Stop loading regardless of outcome
      });
  };

  const openLink = (link: string | null) => {
    if (link) {
      Linking.openURL(link).catch(err =>
        Alert.alert('错误', `无法打开链接: ${err.message}`),
      );
    } else {
      Alert.alert('提示', '未找到有效的 YouTube Music 链接。');
    }
  };

  // Render item for FlatList
  const renderResultItem = ({ item }: { item: ResultItem }) => (
    <TouchableOpacity
      style={[
        styles.resultItem,
        {
          backgroundColor: isDarkMode ? '#555' : '#FFF',
          borderBottomColor: isDarkMode ? '#444' : '#EEE', // Apply conditional border color here
        },
      ]}
      onPress={() => openLink(item.youtubeMusicLink)}
      disabled={!item.youtubeMusicLink} // Disable press if no link
    >
      <Text style={[styles.mentionText, { color: isDarkMode ? '#DDD' : '#333' }]}>
        {item.mention}
      </Text>
      <Text
        style={[
          styles.youtubeTitleText,
          { color: item.youtubeMusicLink ? (isDarkMode ? '#AEE' : '#007AFF') : (isDarkMode ? '#999' : '#AAA') },
          !item.youtubeMusicLink && styles.notFoundText, // Style differently if not found
        ]}
        numberOfLines={1} // Prevent long titles from wrapping excessively
        ellipsizeMode="tail"
      >
        {item.youtubeTitle === 'Search Error' ? `搜索错误: ${item.errorDetails || '未知'}` : item.youtubeTitle}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.container}>
        <Text style={[styles.title, {color: isDarkMode ? '#FFF' : '#000'}]}>
          TuneTrail
        </Text>
        <Text style={[styles.label, {color: isDarkMode ? '#CCC' : '#555'}]}>
          粘贴播客 Shownotes 链接:
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

        {/* Results Area */}
        <View style={[
          styles.resultsContainer,
          { // Apply conditional styles here
            borderColor: isDarkMode ? '#444' : '#DDD',
            backgroundColor: isDarkMode ? '#222' : 'rgba(0,0,0,0.02)',
          }
        ]}>
          {isLoading ? (
            <ActivityIndicator size="large" color={isDarkMode ? '#FFF' : '#000'} />
          ) : results.length > 0 ? (
            <FlatList
              data={results}
              renderItem={renderResultItem}
              keyExtractor={(item, index) => `${item.mention}-${index}`} // Simple key
              style={styles.list}
            />
          ) : (
            <Text style={{ color: isDarkMode ? '#CCC' : '#555' }}>
              输入链接后点击查找，结果将显示在这里...
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
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
    marginBottom: 30,
  },
  resultsContainer: {
    flex: 1, // Take remaining space
    borderWidth: 1, // Keep single borderWidth
    // Remove borderColor and backgroundColor, apply conditionally in JSX
    borderRadius: 5,
    // Remove fixed padding, let FlatList handle content
  },
  list: {
    flex: 1, // Ensure FlatList takes available space within resultsContainer
  },
  resultItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    // Remove borderBottomColor, apply conditionally in JSX
  },
  mentionText: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  youtubeTitleText: {
    fontSize: 14,
  },
  notFoundText: {
    fontStyle: 'italic',
  },
});

export default App;
