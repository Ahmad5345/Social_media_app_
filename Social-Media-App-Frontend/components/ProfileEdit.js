import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Switch,
  Alert,
  TextInput,
} from 'react-native';

import api from '../services/api.js';
import useStore from '../index.js';

export default function ProfileEdit({ route, navigation }) {
  const { profileId } = route.params || {};

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  const user = useStore((state) => state.authSlice.user);

  useEffect(() => {
    if (profileId) {
      loadProfile();
    }
  }, [profileId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/profile/${profileId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setProfile(response.data);
      setIsPublic(response.data.is_public);
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

      const response = await api.patch(
        `/profile/${profileId}`,
        {
          ...profile,
          is_public: isPublic,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setProfile(response.data);
      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
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
            <Text style={styles.backButton}>Back</Text>
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
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Edit Profile</Text>

        <TouchableOpacity onPress={handleSave} disabled={loading}>
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {renderField('Name', profile.name || '', (t) =>
          setProfile((p) => ({ ...p, name: t }))
        )}
        {renderField('Email', profile.email || '', (t) =>
          setProfile((p) => ({ ...p, email: t }))
        )}
        {renderField('Major', profile.major || '', (t) =>
          setProfile((p) => ({ ...p, major: t }))
        )}
        {renderField('Year', profile.year || '', (t) =>
          setProfile((p) => ({ ...p, year: t }))
        )}
        {renderField('Bio', profile.des || '', (t) =>
          setProfile((p) => ({ ...p, des: t }))
        )}
        {renderField('Core', profile.core ? 'Yes' : 'No', (t) =>
          setProfile((p) => ({ ...p, core: t === 'Yes' }))
        )}
        {renderField('Mentor', profile.mentor ? 'Yes' : 'No', (t) =>
          setProfile((p) => ({ ...p, mentor: t === 'Yes' }))
        )}
        {renderField('Developer', profile.dev ? 'Yes' : 'No', (t) =>
          setProfile((p) => ({ ...p, dev: t === 'Yes' }))
        )}
        {renderField('Tradition', profile.tradition || '', (t) =>
          setProfile((p) => ({ ...p, tradition: t }))
        )}
        {renderField('Fun Fact', profile.fun_fact || '', (t) =>
          setProfile((p) => ({ ...p, fun_fact: t }))
        )}

        {renderField(
          'Quote',
          profile.quote || '',
          (t) => setProfile((p) => ({ ...p, quote: t })),
          false
        )}

        <View style={styles.privacySection}>
          <Text style={styles.sectionTitle}>Privacy Settings</Text>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Public Profile</Text>
            <Switch value={isPublic} onValueChange={setIsPublic} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#111' },
  backButton: { fontSize: 16, color: '#2563eb' },
  saveButtonText: { fontSize: 16, color: '#2563eb', fontWeight: '600' },
  content: { padding: 16 },
  fieldContainer: { marginBottom: 16 },
  fieldLabel: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  fieldInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fafafa',
  },
  privacySection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: { fontSize: 14 },
});
