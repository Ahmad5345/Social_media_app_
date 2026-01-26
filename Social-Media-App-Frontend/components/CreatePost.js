import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

import api from '../services/api.js';
import useStore from '../store/index.js';
import ProfileHeader from './ProfileHeader.js';

export default function CreatePost() {
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const user = useStore((state) => state.authSlice.user);

  const requestGalleryPermission = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  };

  const requestCameraPermission = async () => {
    const { status } =
      await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  };

  const pickImage = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Required',
        'Photo library access is required.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Required',
        'Camera access is required.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const uploadImage = async (uri) => {
    const formData = new FormData();
    formData.append('image', {
      uri,
      name: 'post-image.jpg',
      type: 'image/jpeg',
    });

    const response = await api.post('/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data.imageId;
  };

  const createPost = async () => {
    if (!text.trim() && !selectedImage) {
      Alert.alert(
        'Validation Error',
        'Please add text or an image.'
      );
      return;
    }

    try {
      setLoading(true);

      let imageId = null;
      if (selectedImage) {
        imageId = await uploadImage(selectedImage.uri);
      }

      await api.post('/posts', {
        text: text.trim(),
        imageId,
      });

      Alert.alert('Success', 'Post created.');
      navigation.navigate('Feed');
    } catch (err) {
      Alert.alert(
        'Error',
        'Failed to create post. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          keyboardShouldPersistTaps="handled"
        >
          <ProfileHeader />

          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Create Post</Text>

            <TouchableOpacity
              style={[
                styles.postButton,
                loading && styles.disabledButton,
              ]}
              onPress={createPost}
              disabled={loading}
            >
              <Text style={styles.postButtonText}>
                {loading ? 'Posting...' : 'Post'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <TextInput
              style={styles.textInput}
              placeholder="What's on your mind?"
              placeholderTextColor="#999"
              multiline
              value={text}
              onChangeText={setText}
              textAlignVertical="top"
            />

            {selectedImage && (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: selectedImage.uri }}
                  style={styles.selectedImage}
                />
                <TouchableOpacity
                  style={styles.removeImage}
                  onPress={() => setSelectedImage(null)}
                >
                  <Text style={styles.removeImageText}>✕</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.imageActions}>
              <TouchableOpacity
                style={styles.imageButton}
                onPress={pickImage}
              >
                <Text style={styles.imageButtonText}>
                  Gallery
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.imageButton}
                onPress={takePhoto}
              >
                <Text style={styles.imageButtonText}>
                  Camera
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  cancelButton: {
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  postButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  textInput: {
    fontSize: 16,
    minHeight: 120,
    color: '#111',
    marginBottom: 16,
  },
  imageContainer: {
    marginBottom: 16,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeImage: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
  },
  imageButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  imageButtonText: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '500',
  },
});
