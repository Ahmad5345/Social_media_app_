import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

export default function ProfileCard({ profile }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchHeader}>
        <Text style={styles.searchTitle}>Find People</Text>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => navigation.navigate('ProfileSearch')}
        >
          <Text style={styles.searchButtonText}>🔍 Search</Text>
        </TouchableOpacity>
      </View>

      {renderHeader()}
      <FlatList
        data={profiles}
        renderItem={renderProfile}
        keyExtractor={(item) => item._id}
        refreshing={refreshing}
        onRefresh={loadProfiles}
        onEndReached={loadMoreProfiles}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
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
  header: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  detail: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  quote: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: 8,
    marginTop: 8,
  },
});