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
  Alert, // Import Alert for simple feedback
} from 'react-native';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [url, setUrl] = useState('');

  const backgroundStyle = {
    flex: 1, // Ensure SafeAreaView takes full height
    backgroundColor: isDarkMode ? '#333' : '#F3F3F3',
  };

  const handleFindMusic = () => {
    if (!url.trim()) {
      Alert.alert('提示', '请输入播客 Shownotes 的 URL');
      return;
    }
    // TODO: Implement the logic to call the backend/parse URL
    Alert.alert('进行中...', `将查找 URL: ${url}`);
    console.log('查找音乐 URL:', url);
  };

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

        {/* Placeholder for results */}
        <View style={styles.resultsContainer}>
          <Text style={{color: isDarkMode ? '#CCC' : '#555'}}>
            音乐结果将显示在这里...
          </Text>
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
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.02)', // Slight background tint
  },
});

export default App;
