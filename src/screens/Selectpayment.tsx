import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, TextInput,
  ActivityIndicator, ScrollView, Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_BASE_URL } from './config';
import { getUserId } from './auth.js';

const METHODS = ['UPI', 'Credit Card', 'Debit Card'] as const;

const PaymentScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const params = route.params || {};

  const ngoId: number | undefined = params.ngoId;
  const ngoName: string = params.ngoName || 'this NGO';
  const donorUserId = params.donorUserId ?? getUserId();

  const [amount, setAmount] = useState<string>(params.amount ? String(params.amount) : '');
  const [method, setMethod] = useState<string>('UPI');
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState<null | { balance: number; mode: string }>(null);

  const pay = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { Alert.alert('Enter a valid amount'); return; }
    if (!ngoId) { Alert.alert('No NGO selected', 'Please go back and choose an NGO.'); return; }
    setProcessing(true);
    try {
      // 1. Create a gateway order (Razorpay live, or mock when no keys configured)
      const orderRes = await fetch(`${API_BASE_URL}/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amt }),
      });
      const order = await orderRes.json();
      if (!orderRes.ok) throw new Error(order.detail || 'Could not create order');

      // (In LIVE mode you would open Razorpay Checkout here with order.order_id /
      //  order.key_id and pass the returned ids into /verify. In MOCK mode we verify directly.)

      // 2. Verify + record the payment, crediting the NGO wallet
      const verifyRes = await fetch(`${API_BASE_URL}/payments/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ngo_id: ngoId,
          donor_user_id: donorUserId,
          amount: amt,
          payment_method: method,
          razorpay_order_id: order.order_id,
          razorpay_payment_id: 'pay_' + Date.now(),
          razorpay_signature: 'mock_sig',
        }),
      });
      const result = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(result.detail || 'Payment verification failed');

      setDone({ balance: result.new_wallet_balance, mode: result.mode });
    } catch (e: any) {
      Alert.alert('Payment failed', e.message || 'Something went wrong');
    } finally {
      setProcessing(false);
    }
  };

  if (done) {
    return (
      <View style={[styles.container, styles.center]}>
        <View style={styles.tick}><Text style={styles.tickMark}>✓</Text></View>
        <Text style={styles.successTitle}>Payment Successful</Text>
        <Text style={styles.successSub}>You donated ₹{parseFloat(amount).toFixed(2)} to {ngoName}.</Text>
        <Text style={styles.successSub}>NGO wallet balance: ₹{done.balance.toFixed(2)}</Text>
        {done.mode === 'mock' && <Text style={styles.mockNote}>(test / mock payment)</Text>}
        <TouchableOpacity style={styles.payButton} onPress={() => navigation.goBack()}>
          <Text style={styles.payText}>Done</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Complete Payment</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Donating to</Text>
        <Text style={styles.cardValue}>{ngoName}</Text>
      </View>

      <Text style={styles.label}>Amount (₹)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="0"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Payment method</Text>
      <View style={styles.methodRow}>
        {METHODS.map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.method, method === m && styles.methodActive]}
            onPress={() => setMethod(m)}
          >
            <Text style={[styles.methodText, method === m && styles.methodTextActive]}>{m}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.payButton} onPress={pay} disabled={processing}>
        {processing
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.payText}>Pay ₹{amount || '0'}</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.cancel}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fde2cc', padding: 24, justifyContent: 'center' },
  center: { alignItems: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#7a3e12', marginBottom: 20, textAlign: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 22, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 },
  cardLabel: { color: '#9a7a63', fontSize: 13 },
  cardValue: { color: '#7a3e12', fontSize: 20, fontWeight: 'bold', marginTop: 2 },
  label: { color: '#7a3e12', fontWeight: '600', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 14, fontSize: 18, marginBottom: 22 },
  methodRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 28 },
  method: { borderWidth: 1.5, borderColor: '#e2834c', borderRadius: 22, paddingVertical: 9, paddingHorizontal: 16 },
  methodActive: { backgroundColor: '#e2834c' },
  methodText: { color: '#e2834c', fontWeight: '600' },
  methodTextActive: { color: '#fff' },
  payButton: { backgroundColor: '#e2834c', borderRadius: 28, paddingVertical: 15, alignItems: 'center', marginTop: 6 },
  payText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancel: { color: '#9a7a63', textAlign: 'center', marginTop: 16 },
  tick: { width: 84, height: 84, borderRadius: 42, backgroundColor: '#2e9e5b', alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  tickMark: { color: '#fff', fontSize: 46, fontWeight: 'bold' },
  successTitle: { fontSize: 24, fontWeight: 'bold', color: '#2e9e5b', marginBottom: 8 },
  successSub: { color: '#7a3e12', fontSize: 15, textAlign: 'center', marginBottom: 4 },
  mockNote: { color: '#9a7a63', fontStyle: 'italic', marginTop: 6, marginBottom: 4 },
});
