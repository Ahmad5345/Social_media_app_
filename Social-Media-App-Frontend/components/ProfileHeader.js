import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useStore from '../store/index.js';

export default function ProfileHeader({ 
  showProfileButton = false,
  showFeedButton = true,
  showDirectoryButton = false,
}) {
  const navigation = useNavigation();
  const user = useStore((state) => state.authSlice.user);
  const logout = useStore((state) => state.authSlice.logout);

  const handleLogout = async () => {
    await logout();
  };

  const goToProfile = () => {
    navigation.navigate('Profile');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Social Media App</Text>
      <View style={styles.rightActions}>
        {showProfileButton && (
          <TouchableOpacity style={styles.profileButton} onPress={goToProfile}>
            <Text style={styles.profileButtonText}>Profile</Text>
          </TouchableOpacity>
        )}
        {showFeedButton && (
          <TouchableOpacity
            style={styles.feedButton}
            onPress={() => navigation.navigate('Feed')}
          >
            <Text style={styles.feedButtonText}>Feed</Text>
          </TouchableOpacity>
        )}
        {showDirectoryButton && (
        <TouchableOpacity
          style={styles.directoryButton}
          onPress={() => navigation.navigate('ProfileDirectory')}
        >
          <Text style={styles.directoryButtonText}>People</Text>
        </TouchableOpacity>
)}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  profileButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  feedButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  feedButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  directoryButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  directoryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
