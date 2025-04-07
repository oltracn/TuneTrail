import React, { useLayoutEffect } from 'react'; // Remove useState
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Alert,
  useColorScheme,
  SafeAreaView,
  StatusBar,
  Button,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { useSearch } from '../context/SearchContext'; // Import the custom hook

// Define the structure of a result item (matching backend structure)
interface ResultItem {
  mention: string;
  youtubeTitle: string;
  youtubeMusicLink: string | null;
  spotifyTitle: string;
  spotifyArtist: string | null;
  spotifyLink: string | null;
  errorDetails?: string;
}

// Define navigation props type for this screen
type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: { navigation: HomeScreenProps['navigation'] }) => {
  const isDarkMode = useColorScheme() === 'dark';
  // Get state from context instead of local state
  const { isLoading, results } = useSearch();

  // Add Settings button to header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => navigation.navigate('Settings')} title="设置" />
      ),
    });
  }, [navigation]);

  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? '#333' : '#F3F3F3',
  };

  const openLink = (link: string | null) => {
    if (link) {
      Linking.openURL(link).catch(err =>
        Alert.alert('错误', `无法打开链接: ${err.message}`),
      );
    } else {
      Alert.alert('提示', '未找到有效的音乐链接。');
    }
  };

  // Render item for FlatList - Uses context results
  const renderResultItem = ({ item }: { item: ResultItem }) => (
    <View
      style={[
        styles.resultItem,
        {
          backgroundColor: isDarkMode ? '#555' : '#FFF',
          borderBottomColor: isDarkMode ? '#444' : '#EEE',
        },
      ]}
    >
      <Text style={[styles.mentionText, { color: isDarkMode ? '#DDD' : '#333' }]}>
        {item.mention}
      </Text>
      {/* YouTube Result */}
      {item.youtubeMusicLink || item.youtubeTitle !== 'Not Found' ? (
         <TouchableOpacity onPress={() => openLink(item.youtubeMusicLink)} disabled={!item.youtubeMusicLink}>
            <Text
                style={[
                styles.platformTitleText,
                { color: item.youtubeMusicLink ? (isDarkMode ? '#AEE' : '#007AFF') : (isDarkMode ? '#999' : '#AAA') },
                !item.youtubeMusicLink && styles.notFoundText,
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
            >
                YT: {item.youtubeTitle === 'Search Error' ? `搜索错误: ${item.errorDetails || '未知'}` : item.youtubeTitle}
            </Text>
         </TouchableOpacity>
      ) : null}
       {/* Spotify Result */}
       {item.spotifyLink || item.spotifyTitle !== 'Not Found' ? (
         <TouchableOpacity onPress={() => openLink(item.spotifyLink)} disabled={!item.spotifyLink}>
            <Text
                style={[
                styles.platformTitleText, {marginTop: 4},
                { color: item.spotifyLink ? (isDarkMode ? '#AEE' : '#1DB954') : (isDarkMode ? '#999' : '#AAA') },
                !item.spotifyLink && styles.notFoundText,
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
            >
                SP: {item.spotifyTitle === 'Search Error' ? `搜索错误: ${item.errorDetails || '未知'}` : `${item.spotifyArtist ? item.spotifyArtist + ' - ' : ''}${item.spotifyTitle}`}
            </Text>
         </TouchableOpacity>
       ) : null}
       {/* Show if both are not found */}
       {item.youtubeTitle === 'Not Found' && item.spotifyTitle === 'Not Found' && (
           <Text style={[styles.notFoundText, { color: isDarkMode ? '#999' : '#AAA' }]}>
               在 YouTube Music 和 Spotify 上均未找到。
           </Text>
       )}
    </View>
  );

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.container}>

        {/* Results Area - Uses context state */}
        <View style={[
          styles.resultsContainer,
          {
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
              keyExtractor={(item, index) => `${item.mention}-${index}`}
              style={styles.list}
            />
          ) : (
            <View style={styles.placeholderContainer}>
                <Text style={{ color: isDarkMode ? '#CCC' : '#555', textAlign: 'center' }}>
                点击右下角按钮添加 URL 开始搜索...{'\n\n'}搜索结果将显示在这里。
                </Text>
            </View>
          )}
        </View>

         {/* Floating Action Button (Simulated) */}
         <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.navigate('AddUrl')}
         >
            <Text style={styles.fabText}>+</Text>
         </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  resultsContainer: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
  },
  placeholderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
  },
  list: {
    flex: 1,
  },
  resultItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
  },
  mentionText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  platformTitleText: {
    fontSize: 14,
  },
  notFoundText: {
    fontStyle: 'italic',
  },
  fab: { // Floating Action Button style
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#007AFF', // Example color
    borderRadius: 28,
    elevation: 8, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 30,
    color: 'white',
    lineHeight: 30, // Adjust line height for vertical centering
  },
});

export default HomeScreen;
