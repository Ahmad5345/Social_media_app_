import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api.js';
import useStore from '../store/index.js';
import ProfileCard from './ProfileCard.js';

export default function ProfileDirectory() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('all');
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const navigation = useNavigation();
  const user = useStore((state) => state.authSlice.user);

  const limit = 20;

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/profiles/search', {
        params: {
          search: searchQuery || undefined,
          major: searchFilter === 'all' ? undefined : searchFilter,
          limit,
          offset,
        },
      });

      setProfiles(response.data.profiles || []);
      setHasMore(response.data.hasMore);
      setOffset(response.data.offset + response.data.profiles.length);
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [searchQuery, searchFilter, offset]);

  const loadMoreProfiles = useCallback(async () => {
    if (!hasMore || loadingMore) return;
    
    try {
      setLoadingMore(true);
      const response = await api.get('/profiles/search', {
        params: {
          search: searchQuery || undefined,
          major: searchFilter === 'all' ? undefined : searchFilter,
          limit,
          offset,
        },
      });

      setProfiles(prev => [...prev, ...response.data.profiles]);
      setHasMore(response.data.hasMore);
      setOffset(response.data.offset + response.data.profiles.length);
    } catch (error) {
      console.error('Error loading more profiles:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, offset, searchQuery, searchFilter]);

  const handleSearch = (text) => {
    setSearchQuery(text);
    setOffset(0);
    setHasMore(true);
  };

  const handleFilterChange = (filter) => {
    setSearchFilter(filter);
    setOffset(0);
    setHasMore(true);
  };

  const renderProfile = ({ item }) => (
    <TouchableOpacity
      style={styles.profileCard}
      onPress={() => navigation.navigate('UserProfile', { userId: item.user._id })}
    >
      <ProfileCard profile={item} />
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>People Directory</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Filter:</Text>
          <TouchableOpacity
            style={[styles.filterButton, searchFilter === 'all' && styles.activeFilter]}
            onPress={() => handleFilterChange('all')}
          >
            <Text style={styles.filterText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, searchFilter === 'cs' && styles.activeFilter]}
            onPress={() => handleFilterChange('cs')}
          >
            <Text style={styles.filterText}>CS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, searchFilter === 'ce' && styles.activeFilter]}
            onPress={() => handleFilterChange('ce')}
          >
            <Text style={styles.filterText}>CE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore && !hasMore) return null;
    
    return (
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={loadMoreProfiles}
          disabled={loadingMore}
        >
          <Text style={styles.loadMoreText}>
            {loadingMore ? 'Loading...' : 'Load More'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <FlatList
        data={profiles}
        renderItem={renderProfile}
        keyExtractor={(item) => item._id}
        refreshing={refreshing}
        onRefresh={loadProfiles}
        onEndReached={loadMoreProfiles}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#fafafa',
    color: '#111',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
  },
  activeFilter: {
    backgroundColor: '#2563eb',
  },
  filterText: {
    fontSize: 12,
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  profileCard: {
    marginBottom: 8,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  loadMoreButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  loadMoreText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});