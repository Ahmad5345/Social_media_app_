import { View, Text, StyleSheet } from 'react-native';

export default function ProfileCard({ profile }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {profile.name?.charAt(0) ?? 'U'}
          </Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.detail}>
            {profile.major} · Class of {profile.year}
          </Text>
          <Text style={styles.email}>{profile.user?.email}</Text>
        </View>
      </View>

      {profile.quote && (
        <Text style={styles.quote}>"{profile.quote}"</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  detail: {
    fontSize: 14,
    color: '#444',
  },
  quote: {
    marginTop: 10,
    fontStyle: 'italic',
    color: '#555',
  },
});
