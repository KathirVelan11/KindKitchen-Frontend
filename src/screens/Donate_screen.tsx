import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, TextInput,
  ScrollView, ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_BASE_URL } from './config';

type Ngo = { ngoid: number; name: string };

const QUICK = [100, 250, 500, 1000];

const DonateScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const preselected: Ngo | undefined = route.params?.ngo;
  const [ngos, setNgos] = useState<Ngo[]>(preselected ? [preselected] : []);
  const [selected, setSelected] = useState<Ngo | null>(preselected || null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/ngos/`);
        const data = await res.json();
        setNgos(data.ngos || []);
      } catch (e) {
        console.error('Failed to load NGOs', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const proceed = () => {
    navigation.navigate('PaymentScreen', {
      ngoId: selected?.ngoid,
      ngoName: selected?.name,
      amount: amount ? parseFloat(amount) : undefined,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Donate to an NGO</Text>
      <Text style={styles.subtitle}>Your contribution funds meals for those in need.</Text>

      <Text style={styles.label}>Choose an NGO</Text>
      {loading ? (
        <ActivityIndicator color="#e2834c" style={{ marginVertical: 20 }} />
      ) : ngos.length === 0 ? (
        <Text style={styles.empty}>No NGOs available yet.</Text>
      ) : (
        ngos.map((n) => (
          <TouchableOpacity
            key={n.ngoid}
            style={[styles.ngo, selected?.ngoid === n.ngoid && styles.ngoActive]}
            onPress={() => setSelected(n)}
          >
            <Text style={[styles.ngoText, selected?.ngoid === n.ngoid && styles.ngoTextActive]}>{n.name}</Text>
          </TouchableOpacity>
        ))
      )}

      <Text style={styles.label}>Amount (₹)</Text>
      <View style={styles.quickRow}>
        {QUICK.map((q) => (
          <TouchableOpacity key={q} style={styles.quick} onPress={() => setAmount(String(q))}>
            <Text style={styles.quickText}>₹{q}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter amount"
        value={amount}
        onChangeText={setAmount}
      />

      <TouchableOpacity
        style={[styles.button, !selected && styles.buttonDisabled]}
        onPress={proceed}
        disabled={!selected}
      >
        <Text style={styles.buttonText}>Continue to Payment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DonateScreen;

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fde2cc', padding: 24 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#7a3e12', marginTop: 10 },
  subtitle: { color: '#9a7a63', marginBottom: 22, marginTop: 4 },
  label: { color: '#7a3e12', fontWeight: '700', marginTop: 14, marginBottom: 10 },
  ngo: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 2, borderColor: 'transparent' },
  ngoActive: { borderColor: '#e2834c' },
  ngoText: { color: '#7a3e12', fontSize: 16, fontWeight: '600' },
  ngoTextActive: { color: '#e2834c' },
  empty: { color: '#9a7a63', fontStyle: 'italic', marginVertical: 16 },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  quick: { backgroundColor: '#fff', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 16 },
  quickText: { color: '#e2834c', fontWeight: '700' },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 14, fontSize: 18, marginBottom: 24 },
  button: { backgroundColor: '#e2834c', borderRadius: 28, paddingVertical: 15, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#e6b591' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
