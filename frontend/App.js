import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { getListings, addListing, getWishlist, addToWishlist, clearAllData } from './utils/storage';

export default function App() {
  const [logs, setLogs] = useState([]);

  const addLog = (msg) => setLogs(prev => [...prev, msg]);

  useEffect(() => {
    const runTests = async () => {
      addLog('Starting Storage Tests...');

      try {
        await clearAllData();
        addLog('Cleared existing data');

        const listings = await getListings();
        addLog(`Fetched ${listings.length} listings (seeded)`);

        const newBook = {
          title: 'Test Book',
          author: 'Test Author',
          price: '999',
          status: 'Available'
        };
        const added = await addListing(newBook);
        addLog(`Added book: ${added.title} (ID: ${added.id})`);

        const updatedListings = await getListings();
        addLog(`Total listings after add: ${updatedListings.length}`);

        await addToWishlist(added.id);
        const wishlist = await getWishlist();
        addLog(`Wishlist size: ${wishlist.length} (Contains ${added.id}: ${wishlist.includes(added.id)})`);

        addLog('Tests Completed Successfully!');
      } catch (e) {
        addLog(`Test Failed: ${e.message}`);
        console.error(e);
      }
    };

    runTests();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Storage Verification</Text>
      <ScrollView style={styles.logs}>
        {logs.map((log, i) => (
          <Text key={i} style={styles.logText}>• {log}</Text>
        ))}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  logs: {
    flex: 1,
  },
  logText: {
    fontSize: 14,
    marginBottom: 5,
    fontFamily: 'monospace',
  },
});

