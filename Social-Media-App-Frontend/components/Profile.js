import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import api from '../services/Social_Media_App-API.js';
import useStore from '../store/index.js';
import ProfileHeader from './ProfileHeader.js';

export default function Profile() {
  const navigation = useNavigation();
  const user = useStore((state) => state.authSlice.user);

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      await Promise.all([loadProfile(), loadPosts()]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadProfile = async () => {
    try {
      const res = await api.get('/profile/me');
      setProfile(res.data);
    } catch (err) {
      console.error('Failed to load profile:', err.response?.status);
    }
  };

  const loadPosts = async () => {
    try {
      const res = await api.get(`/user-posts/user/${user._id}`);
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to load posts:', err.response?.status);
    }
  };

  const handleLike = async (postId) => {
    try {
      await api.post(`/posts/${postId}/like`);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                likes: p.likes.includes(user._id)
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        )
      );
    } catch (err) {
      console.error('Like failed:', err.response?.status);
    }
  };

  const handleDelete = (postId) => {
    Alert.alert('Delete Post', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/posts/${postId}`);
            setPosts((prev) => prev.filter((p) => p._id !== postId));
          } catch (err) {
            Alert.alert('Error', 'Failed to delete post');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => {
    const isOwner =
      String(item.author?._id ?? item.author) === String(user._id);

    return (
      <View style={styles.post}>
        <Text style={styles.timestamp}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>

        {item.image && (
          <Image
            source={{
              uri: `http://localhost:9090/api/images/${item.image._id}`,
            }}
            style={styles.image}
          />
        )}

        {item.text && <Text style={styles.text}>{item.text}</Text>}

        <View style={styles.actions}>
          <TouchableOpacity onPress={() => handleLike(item._id)}>
            <Text>
              {item.likes.includes(user._id) ? '❤️' : '🤍'} {item.likes.length}
            </Text>
          </TouchableOpacity>

          {isOwner && (
            <TouchableOpacity onPress={() => handleDelete(item._id)}>
              <Text>🗑️</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Loading profile…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ProfileHeader />

      {/* PROFILE INFO */}
      <View style={styles.profileBox}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {profile?.name?.charAt(0) ?? 'U'}
          </Text>
        </View>

        <Text style={styles.name}>{profile?.name}</Text>
        <Text style={styles.meta}>
          {profile?.major} · Class of {profile?.year}
        </Text>

        {profile?.quote && (
          <Text style={styles.quote}>"{profile.quote}"</Text>
        )}
      </View>

      {/* POSTS HEADER */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Posts</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CreatePost')}>
          <Text style={styles.create}>+ Create</Text>
        </TouchableOpacity>
      </View>

      {/* POSTS */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadAll} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text>No posts yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  profileBox: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  avatarText: { color: '#fff', fontSize: 32, fontWeight: '700' },

  name: { fontSize: 22, fontWeight: '700' },
  meta: { fontSize: 16, color: '#555', marginTop: 4 },
  quote: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },

  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
  },

  sectionTitle: { fontSize: 20, fontWeight: '700' },
  create: { color: '#2563eb', fontWeight: '600' },

  post: {
    backgroundColor: '#fff',
    margin: 8,
    padding: 16,
    borderRadius: 8,
  },

  timestamp: { fontSize: 12, color: '#666', marginBottom: 8 },
  image: { width: '100%', height: 200, borderRadius: 8, marginBottom: 8 },
  text: { fontSize: 16, marginBottom: 8 },

  actions: { flexDirection: 'row', gap: 16 },
  empty: { padding: 40, alignItems: 'center' },
});
