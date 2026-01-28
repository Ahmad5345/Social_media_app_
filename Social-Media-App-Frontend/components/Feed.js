import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
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

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [commentText, setCommentText] = useState({});
  const navigation = useNavigation();
  const user = useStore((state) => state.authSlice.user);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      setLoading(true);
      const response = await api.get('/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error loading feed:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await api.post(`/posts/${postId}/like`);
      setPosts(posts.map(post => 
        post._id === postId 
          ? { 
              ...post, 
              likes: post.likes.includes(user._id) 
                ? post.likes.filter(id => id !== user._id)
                : [...post.likes, user._id]
            }
          : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await api.delete(`/posts/${postId}`);
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleComment = async (postId) => {
    const text = commentText[postId];
    if (!text?.trim()) return;

    try {
      await api.post(`/posts/${postId}/comment`, { text });
      setCommentText({ ...commentText, [postId]: '' });
      loadFeed();
    } catch (error) {
      console.error('Error commenting:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.postContainer}>
      <View style={styles.header}>
        <Text style={styles.authorEmail}>{item.author?.email}</Text>
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
            {item.likes?.includes(user._id) ? '❤️' : '🤍'}
            {item.likes?.length || 0}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>
            💬
            {item.comments?.length || 0}
          </Text>
        </TouchableOpacity>

        {item.author._id === user._id && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item._id)}
          >
            <Text style={styles.deleteButtonText}>🗑️</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.commentsSection}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          value={commentText[item._id] || ''}
          onChangeText={(text) => setCommentText({ ...commentText, [item._id]: text })}
          onSubmitEditing={() => handleComment(item._id)}
        />

        {item.comments?.map((comment, index) => (
          <View key={index} style={styles.comment}>
            <Text style={styles.commentAuthor}>{comment.user?.email}</Text>
            <Text style={styles.commentText}>{comment.text}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadFeed} />
        }
        ListHeaderComponent={
          <>
            <ProfileHeader showProfileButton showFeedButton={false} showDirectoryButton/>

            <View style={styles.actionsHeader}>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate('CreatePost')}
              >
                <Text style={styles.createButtonText}>+ Create Post</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  authorEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
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
    lineHeight: 24,
    color: '#111',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  actionButton: {
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#dc2626',
    borderRadius: 4,
  },
  deleteButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  commentsSection: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 12,
    fontSize: 14,
  },
  comment: {
    marginBottom: 8,
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    color: '#111',
  },
  actionsHeader: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'flex-end',
  },
});
