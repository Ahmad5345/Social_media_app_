import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import api from '../services/Social_Media_App-API.js';
import ProfileCard from './ProfileCard.js';

export default function ProfileDirectory() {
  const navigation = useNavigation();

  const [profiles, setProfiles] = useState([]);

  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [majorFilter, setMajorFilter] = useState('all');

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const LIMIT = 20;

  const MAJOR_FILTERS = [
    {
      label: 'ALL',
      value: 'all',
    },
    {
      label: 'CS',
      value: 'CS',
      aliases: ['CS', 'Computer Science', 'Comp Sci', 'C.S.'],
    },
    {
      label: 'CE',
      value: 'CE',
      aliases: ['CE', 'Computer Engineering', 'Comp Eng', 'C.E.'],
    },
  ];

  useEffect(() => {
    resetAndLoad();
  }, [searchQuery, majorFilter]);

  const resetAndLoad = () => {
    setOffset(0);
    setHasMore(true);
    fetchProfiles(true);
  };

  const fetchProfiles = async (reset = false) => {
    if (loading || loadingMore) return;
    if (!hasMore && !reset) return;

    reset ? setLoading(true) : setLoadingMore(true);

    try {
      const res = await api.get('/profile/search', {
        params: {
          search: searchQuery || undefined,
          major: majorFilter === 'all' ? undefined : normalizeMajor(majorFilter),
          limit: LIMIT,
          offset: reset ? 0 : offset,
        },
      });

      const newProfiles = res.data.profiles || [];

      setProfiles(prev =>
        reset ? newProfiles : [...prev, ...newProfiles]
      );

      setOffset(prev => prev + newProfiles.length);
      setHasMore(res.data.hasMore);
    } catch (err) {
      console.error('Error loading profiles:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    resetAndLoad();
  };

  const renderProfile = ({ item }) => (
    <ProfileCard profile={item} />
  );

  const normalizeMajor = (major) => {
    if (!major) return undefined;

    const normalized = major.trim().toLowerCase();

    const match = MAJOR_FILTERS.find(filter =>
      filter.value !== 'all' &&
      (
        filter.value.toLowerCase() === normalized ||
        filter.aliases?.includes(normalized)
      )
    );

    return match ? match.value : major;
  };

  // 🔒 MEMOIZED HEADER (this fixes the bug)
  const renderHeader = useCallback(() => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.title}>People Directory</Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Feed')}
        >
          <Text style={styles.backButtonText}>Feed</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search by name or major"
        value={searchInput}
        onChangeText={setSearchInput}
        returnKeyType="search"
        blurOnSubmit={false}
        onSubmitEditing={() => {
          setSearchQuery(searchInput.trim());
        }}
      />

      <View style={styles.filters}>
        {MAJOR_FILTERS.map(filter => (
          <TouchableOpacity
            key={filter.value}
            style={[
              styles.filterButton,
              majorFilter === filter.value && styles.activeFilter,
            ]}
            onPress={() => setMajorFilter(filter.value)}
          >
            <Text
              style={[
                styles.filterText,
                majorFilter === filter.value && styles.activeFilterText,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  ), [searchInput, majorFilter]);

  const renderFooter = () => {
    if (!loadingMore || !hasMore) return null;

    return (
      <View style={styles.footer}>
        <Text style={styles.loadingText}>Loading more…</Text>
      </View>
    );
  };

return (
  <SafeAreaView style={styles.container}>
    {/* HEADER JSX INLINE — NO COMPONENT */}
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.title}>People Directory</Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Feed')}
        >
          <Text style={styles.backButtonText}>Feed</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search by name or major and hit Enter"
        value={searchInput}
        onChangeText={setSearchInput}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        onSubmitEditing={() => {
          setSearchQuery(searchInput.trim());
        }}
      />

      <View style={styles.filters}>
        {['all', 'CS', 'CE'].map(filter => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              majorFilter === filter && styles.activeFilter,
            ]}
            onPress={() => setMajorFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                majorFilter === filter && styles.activeFilterText,
              ]}
            >
              {filter.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>

    <FlatList
      data={profiles}
      keyExtractor={(item, index) => `${item._id}-${index}`}
      renderItem={renderProfile}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onEndReached={() => fetchProfiles(false)}
      onEndReachedThreshold={0.4}
      contentContainerStyle={styles.list}
      keyboardShouldPersistTaps="handled"
    />
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#e5e5e5',
  },
  activeFilter: {
    backgroundColor: '#2563eb',
  },
  filterText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#fff',
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loadingText: {
    color: '#666',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
