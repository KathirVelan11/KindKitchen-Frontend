// screens/WalletPage.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView,
  Image
} from 'react-native';

interface Transaction {
  id: string;
  donor: string;
  amount: number;
  date: string;
}

const WalletPage = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch wallet data
  const fetchWalletData = async () => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch('https://your-api.com/wallet');
      // const data = await response.json();
      // setBalance(data.balance);
      // setTransactions(data.transactions);

      // For demonstration purposes, using sample data
      setBalance(50000);
      setTransactions([
        { id: '1', donor: 'Cafeteria', amount: 5000, date: '2023-04-10' },
        { id: '2', donor: 'Scholarship', amount: 20000, date: '2023-03-15' },
        { id: '3', donor: 'Refund', amount: 2500, date: '2023-02-28' },
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

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
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Wallet Icon and Balance */}
        <View style={styles.balanceContainer}>
          <Image 
            source={{ uri: 'https://example.com/wallet.png' }} 
            style={styles.walletIcon} 
          />
          <Text style={styles.balanceLabel}>Balance : </Text>
          <Text style={styles.balanceAmount}>₹{balance}</Text>
        </View>

        {/* Transaction Headers */}
        <View style={styles.transactionHeader}>
          <Text style={styles.headerText}>Donor</Text>
          <Text style={styles.headerText}>Amount</Text>
          <Text style={styles.headerText}>Date</Text>
        </View>

        {/* Divider Line */}
        <View style={styles.divider} />

        {/* Transaction List */}
        <FlatList
          data={transactions}
          renderItem={renderTransactionItem}
          keyExtractor={item => item.id}
          style={styles.transactionList}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f0e3',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f0e3',
  },
  container: {
    flex: 1,
    padding: 15,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  walletIcon: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  balanceLabel: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginBottom: 10,
  },
  transactionList: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  donor: {
    fontSize: 16,
    flex: 1,
  },
  amount: {
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
  },
  date: {
    fontSize: 16,
    flex: 1,
    textAlign: 'right',
  },
});

export default WalletPage;