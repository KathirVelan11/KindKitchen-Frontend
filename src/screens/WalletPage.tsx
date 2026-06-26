// screens/WalletPage.tsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator,
} from 'react-native';
import { API_BASE_URL } from './config';
import { getUserId, getAuthToken } from './auth.js';

interface Transaction {
  id: string;
  donor: string;
  amount: number;
  date: string;
}

const WalletPage = () => {
  const [balance, setBalance] = useState(0);
  const [ngoName, setNgoName] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWalletData = async () => {
    try {
      const userId = getUserId();
      if (!userId) { setError('Not logged in'); setLoading(false); return; }

      // 1. Resolve this NGO + live wallet balance
      const ngoRes = await fetch(`${API_BASE_URL}/ngos/by-user/${userId}`);
      const ngo = await ngoRes.json();
      if (!ngoRes.ok) throw new Error(ngo.detail || 'Could not load NGO');
      setBalance(ngo.walletbalance);
      setNgoName(ngo.name);

      // 2. Load donations received (requires auth token)
      const token = getAuthToken();
      const donRes = await fetch(`${API_BASE_URL}/donors/ngodonations/${ngo.ngoid}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (donRes.ok) {
        const dons = await donRes.json();
        setTransactions(
          (dons || []).map((d: any, i: number) => ({
            id: String(i),
            donor: d.donor_name,
            amount: d.amount,
            date: (d.date || '').slice(0, 10),
          }))
        );
      }
    } catch (e: any) {
      setError(e.message || 'Failed to load wallet');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWalletData(); }, []);

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.donor}>{item.donor}</Text>
      <Text style={styles.amount}>₹{item.amount}</Text>
      <Text style={styles.date}>{item.date}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator color="#e2834c" size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>{ngoName || 'Wallet'} Balance</Text>
          <Text style={styles.balanceAmount}>₹{balance.toFixed(2)}</Text>
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <Text style={styles.sectionTitle}>Donations Received</Text>
        <View style={styles.transactionHeader}>
          <Text style={styles.headerText}>Donor</Text>
          <Text style={[styles.headerText, { textAlign: 'center' }]}>Amount</Text>
          <Text style={[styles.headerText, { textAlign: 'right' }]}>Date</Text>
        </View>
        <View style={styles.divider} />

        <FlatList
          data={transactions}
          renderItem={renderTransactionItem}
          keyExtractor={(item) => item.id}
          style={styles.transactionList}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.empty}>No donations yet.</Text>}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8f0e3' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f0e3' },
  container: { flex: 1, padding: 15 },
  balanceCard: { backgroundColor: '#e2834c', borderRadius: 18, paddingVertical: 28, alignItems: 'center', marginVertical: 20 },
  balanceLabel: { fontSize: 16, color: '#fff7f0', marginBottom: 6 },
  balanceAmount: { fontSize: 36, fontWeight: 'bold', color: '#fff' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#7a3e12', marginBottom: 12 },
  error: { color: '#c0392b', marginBottom: 10 },
  transactionHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, marginBottom: 10 },
  headerText: { fontSize: 15, fontWeight: 'bold', flex: 1, color: '#7a3e12' },
  divider: { height: 1, backgroundColor: '#ddd', marginBottom: 10 },
  transactionList: { flex: 1 },
  listContent: { paddingBottom: 20 },
  empty: { color: '#9a7a63', fontStyle: 'italic', textAlign: 'center', marginTop: 20 },
  transactionItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  donor: { fontSize: 16, flex: 1, color: '#333' },
  amount: { fontSize: 16, flex: 1, textAlign: 'center', color: '#2e9e5b', fontWeight: '600' },
  date: { fontSize: 14, flex: 1, textAlign: 'right', color: '#777' },
});

export default WalletPage;
