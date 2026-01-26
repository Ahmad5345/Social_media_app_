import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';

export default function ProfileEdit({ route, navigation }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const user = useStore((state) => state.authSlice.user);
  const { profileId } = route.params;

  useEffect(() => {
    if (profileId) {
      loadProfile();
    }
  }, [profileId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/profile/${profileId}`);
      const data = await response.json();
      setProfile(data);
      setIsPublic(data.is_public);
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/profile/${profileId}`);
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          ...profile,
          is_public: isPublic,
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setProfile(updatedData);
        Alert.alert('Success', 'Profile updated successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const renderField = (label, value, onChangeText, editable = true) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.fieldInput}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        multiline={label.toLowerCase().includes('bio')}
      />
    </View>
  );

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
        </View>
        </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {renderField('Name', profile?.name || '', (text) => setProfile(prev => ({ ...prev, name: text }))}
        {renderField('Email', profile?.email || '', (text) => setProfile(prev => ({ ...prev, email: text }))}
        {renderField('Major', profile?.major || '', (text) => setProfile(prev => ({ ...prev, major: text }))}
        {renderField('Year', profile?.year || '', (text) => setProfile(prev => ({ ...prev, year: text }))}
        {renderField('Bio', profile?.des || '', (text) => setProfile(prev => ({ ...prev, des: text }))}
        {renderField('Core', profile?.core ? 'Yes' : 'No', (text) => setProfile(prev => ({ ...prev, core: text === 'Yes' }))}
        {renderField('Mentor', profile?.mentor ? 'Yes' : 'No', (text) => setProfile(prev => ({ ...prev, mentor: text === 'Yes' }))}
        {renderField('Developer', profile?.dev ? 'Yes' : 'No', (text) => setProfile(prev => ({ ...prev, dev: text === 'Yes' }))}
        {renderField('Tradition', profile?.tradition || '', (text) => setProfile(prev => ({ ...prev, tradition: text }))}
        {renderField('Fun Fact', profile?.fun_fact || '', (text) => setProfile(prev => ({ ...prev, fun_fact: text }))}
        {renderField('Quote', profile?.quote || '', (text) => setProfile(prev => ({ ...prev, quote: text }), false)}

        <View style={styles.privacySection}>
          <Text style={styles.sectionTitle}>Privacy Settings</Text>
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Public Profile</Text>
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
              trackColor={{ true: '#2563eb', false: '#ccc' }}
            />
          </View>
        </View>
      </View>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
  },
  backButton: {
    fontSize: 16,
    color: '#2563eb',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#fafafa',
    color: '#111',
  },
  privacySection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    fontSize: 14,
    color: '#333',
  },
});