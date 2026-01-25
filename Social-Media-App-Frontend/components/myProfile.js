import { useEffect, useState } from 'react';
import { Image } from 'expo-image';
// eslint-disable-next-line object-curly-newline
import { Pressable, View, Text, StyleSheet } from 'react-native';
import useStore from '../store/index.js';
import { getProfile } from '../services/Social_Media_App-API.js';

function MakeMyProfile() {
  const [myProfile, setMyProfile] = useState(null);
  const logout = useStore((state) => state.authSlice.logout);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile('69478bbbb8921ae34fc6862c');
        setMyProfile(data);
      } catch (error) {
        console.error(`Error MakeMyProfile: ${error}`);
      }
    };
    loadProfile();
  }, []);
  if (!myProfile) {
    return <Text>Loading....</Text>;
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: myProfile.picture_url }}
        style={styles.image}
        contentFit="cover"
      />
      <Text style={styles.name}>{myProfile.name}</Text>
      <Pressable onPress={logout}>
        <Text>Log Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    alignItems: 'center',
    marginTop: 40,
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  name: {
    marginTop: 16,
    fontSize: 22,
    fontWeight: '600',
  },
});

export default MakeMyProfile;
