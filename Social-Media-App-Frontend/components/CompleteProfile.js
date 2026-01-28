import { useState } from 'react';
import {
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { setProfile } from '../services/Social_Media_App-API.js';
import useStore from '../store/index.js';

export default function CompleteProfile() {
  const user = useStore((state) => state.authSlice.user);
  const clearJustSignedUp = useStore((state) => state.authSlice.clearJustSignedUp);
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [major, setMajor] = useState('');
  const [quote, setQuote] = useState('');

  const handleSubmit = async () => {
    if (!name || !year) {
      Alert.alert('Missing info', 'Name and year are required');
      return;
    }

    try {
      await setProfile({
        user: user._id,
        name,
        year: Number(year),
        major,
        quote,
        is_public: true,
      });

      clearJustSignedUp();
    } catch (err) {
      Alert.alert('Error', 'Failed to create profile');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Complete Your Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Class Year (e.g. 2027)"
        keyboardType="number-pad"
        value={year}
        onChangeText={setYear}
      />

      <TextInput
        style={styles.input}
        placeholder="Major"
        value={major}
        onChangeText={setMajor}
      />

      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Favorite quote (optional)"
        value={quote}
        onChangeText={setQuote}
        multiline
      />

      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Finish</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  multiline: {
    height: 80,
  },
  button: {
    height: 52,
    borderRadius: 10,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
