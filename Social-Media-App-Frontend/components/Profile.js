import { useState, useEffect } from 'react';
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
import api from '../services/api.js';
import useStore from '../store/index.js';
import ProfileHeader from './ProfileHeader.js';

export default function Profile() {
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();
  const user = useStore((state) => state.authSlice.user);

  useEffect(() => {
    loadUserPosts();
  }, []);

  const loadUserPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/user-posts/user/${user._id}`);
      setUserPosts(response.data);
    } catch (error) {
      console.error('Error loading user posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await api.post(`/posts/${postId}/like`);
      setUserPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: post.likes.includes(user._id)
                  ? post.likes.filter((id) => id !== user._id)
                  : [...post.likes, user._id],
              }
            : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDelete = async (postId) => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/posts/${postId}`);
              setUserPosts((prev) =>
                prev.filter((post) => post._id !== postId)
              );
              Alert.alert('Success', 'Post deleted successfully');
            } catch (error) {
              console.error('Error deleting post:', error);
              Alert.alert('Error', 'Failed to delete post');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    console.log('POST AUTHOR:', item.author);
    console.log('CURRENT USER:', user._id);

    const isOwner = String(item.author?._id ?? item.author) === String(user._id);

    return (
      <View style={styles.postContainer}>
        <View style={styles.postHeader}>
          <Text style={styles.timestamp}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>

        {item.image && (
          <Image
            source={{ uri: `http://localhost:9090/api/images/${item.image._id}` }}
            style={styles.postImage}
          />
        )}

        {item.text && (
          <Text style={styles.postText}>{item.text}</Text>
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleLike(item._id)}
          >
            <Text style={styles.actionText}>
              {item.likes?.includes(user._id) ? '❤️' : '🤍'}{' '}
              {item.likes?.length || 0}
            </Text>
          </TouchableOpacity>

          {isOwner && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item._id)}
            >
              <Text style={styles.deleteButtonText}>🗑️</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProfileHeader />

      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={styles.email}>{user?.email}</Text>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{userPosts.length}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>
              {userPosts.reduce(
                (total, post) => total + (post.likes?.length || 0),
                0
              )}
            </Text>
            <Text style={styles.statLabel}>Likes</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.title}>My Posts</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('CreatePost')}
        >
          <Text style={styles.createButtonText}>+ Create</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={userPosts}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadUserPosts} />
        }
        style={styles.feed}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No posts yet</Text>
            <TouchableOpacity
              style={styles.createFirstButton}
              onPress={() => navigation.navigate('CreatePost')}
            >
              <Text style={styles.createFirstButtonText}>
                Create Your First Post
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  profileHeader: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
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

  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },

  email: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    marginBottom: 16,
  },

  stats: {
    flexDirection: 'row',
    gap: 32,
  },

  stat: {
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  statLabel: {
    fontSize: 14,
    color: '#666',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  createButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },

  createButtonText: {
    color: '#fff',
    fontWeight: '600',
  },

  feed: {
    flex: 1,
  },

  postContainer: {
    backgroundColor: '#fff',
    margin: 8,
    borderRadius: 8,
    padding: 16,
    elevation: 3,
  },

  postHeader: {
    marginBottom: 12,
  },

  timestamp: {
    fontSize: 12,
    color: '#666',
  },

  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },

  postText: {
    fontSize: 16,
    marginBottom: 12,
  },

  actions: {
    flexDirection: 'row',
    gap: 16,
  },

  actionButton: {
    paddingVertical: 4,
  },

  actionText: {
    fontSize: 14,
    color: '#666',
  },

  deleteButton: {
    paddingHorizontal: 8,
  },

  deleteButtonText: {
    fontSize: 16,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },

  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },

  createFirstButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },

  createFirstButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
