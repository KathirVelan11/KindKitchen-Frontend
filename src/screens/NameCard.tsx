import { API_BASE_URL } from './config';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView, Alert } from 'react-native';

// Define the interfaces for our data structure
interface Address {
  street: string;
  city: string;
  state: string;
  postalcode: string;
}

interface Order {
  orderid: number;
  pickup: Address;
  drop: Address;
}

interface OrdersResponse {
  count: number;
  pending_orders: Order[];
}

// Format address for display
const formatAddress = (address: Address): string => {
  return `${address.street}, ${address.city}, ${address.state} - ${address.postalcode}`;
};

const NameCard = () => {
  // App state
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Navigation state
  const [currentScreen, setCurrentScreen] = useState<string>('Orders');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Dynamic containers from API response
  const [containers, setContainers] = useState<any[]>([]);

  // Navigation functions
  const navigateTo = (screen: string, params?: any) => {
    if (screen === 'OrderDetails' && params?.order) {
      setSelectedOrder(params.order);
    }
    
    setCurrentScreen(screen);
  };

  const goBack = () => {
    setCurrentScreen('Orders');
  };

  // Create dynamic containers from order data
  const createContainersFromOrders = (orders: Order[]) => {
    // Map each order to a container object with relevant data
    return orders.map(order => ({
      id: order.orderid,
      title: `Order #${order.orderid}`,
      pickupAddress: formatAddress(order.pickup),
      dropAddress: formatAddress(order.drop),
      originalOrder: order // Keep reference to original order data
    }));
  };

  // Fetch orders from the API
  useEffect(() => {
    fetchOrdersFromAPI();
  }, []);

  const fetchOrdersFromAPI = async () => {
    try {
      setLoading(true);
      // Replace the URL with your actual API endpoint
      const response = await fetch(`${API_BASE_URL}/orders/pending`);
      const data: OrdersResponse = await response.json();
      
      setPendingOrders(data.pending_orders);
      
      // Create containers dynamically from API response
      const newContainers = createContainersFromOrders(data.pending_orders);
      setContainers(newContainers);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders. Please try again later.');
      setLoading(false);
    }
  };

  // Retry fetching data
  const retryFetch = () => {
    setError(null);
    fetchOrdersFromAPI();
  };

  // Handle container/order selection
  const handleSelectContainer = (container: any) => {
    // Find original order data from container
    const order = container.originalOrder;
    navigateTo('OrderDetails', { order });
  };

  // Handle pick order
  const handlePickOrder = () => {
    if (selectedOrder) {
      Alert.alert(
        "Success!",
        "Order has been picked successfully.",
        [
          { 
            text: "OK", 
            onPress: () => {
              // Update pending orders state
              const updatedOrders = pendingOrders.filter(o => o.orderid !== selectedOrder.orderid);
              setPendingOrders(updatedOrders);
              
              // Update containers state
              const updatedContainers = containers.filter(c => c.id !== selectedOrder.orderid);
              setContainers(updatedContainers);
              
              setCompletedOrders(completedOrders + 1);
              goBack();
            }
          }
        ]
      );
    }
  };

  // Handle reject order
  const handleRejectOrder = () => {
    if (selectedOrder) {
      // Update pending orders state
      const updatedOrders = pendingOrders.filter(o => o.orderid !== selectedOrder.orderid);
      setPendingOrders(updatedOrders);
      
      // Update containers state
      const updatedContainers = containers.filter(c => c.id !== selectedOrder.orderid);
      setContainers(updatedContainers);
      
      goBack();
    }
  };

  // Render container card
  const renderContainerCard = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.orderCard}
      onPress={() => handleSelectContainer(item)}
    >
      <View style={styles.orderContent}>
        <View style={styles.orderField}>
          <Text style={styles.orderFieldLabel}>ORDER ID:</Text>
          <Text style={styles.orderFieldText}>{item.title}</Text>
        </View>
        
        <View style={styles.orderField}>
          <Text style={styles.orderFieldLabel}>PICK UP:</Text>
          <Text style={styles.orderFieldText}>{item.pickupAddress}</Text>
        </View>
        
        <View style={styles.orderField}>
          <Text style={styles.orderFieldLabel}>DROP:</Text>
          <Text style={styles.orderFieldText}>{item.dropAddress}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render loading state
  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#FFA07A" />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    );
  }

  // Render error state
  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={retryFetch}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render Order Details Screen
  if (currentScreen === 'OrderDetails' && selectedOrder) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.detailsHeader}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.detailsTitle}>Order #{selectedOrder.orderid} Details</Text>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.detailsField}>
            <Text style={styles.detailsFieldLabel}>PICK UP:</Text>
            <Text style={styles.detailsFieldText}>{formatAddress(selectedOrder.pickup)}</Text>
          </View>
          
          <View style={styles.detailsField}>
            <Text style={styles.detailsFieldLabel}>DROP:</Text>
            <Text style={styles.detailsFieldText}>{formatAddress(selectedOrder.drop)}</Text>
          </View>
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.pickButton]}
            onPress={handlePickOrder}
          >
            <Text style={styles.actionButtonText}>Pick Order</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.rejectButton]}
            onPress={handleRejectOrder}
          >
            <Text style={styles.actionButtonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Render Orders Dashboard Screen (default) with dynamic containers
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Orders</Text>
        <TouchableOpacity onPress={fetchOrdersFromAPI} style={styles.refreshButton}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {containers.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>No pending orders</Text>
          <Text style={styles.emptyStateSubtext}>You'll be notified when new orders arrive</Text>
          <TouchableOpacity 
            style={styles.refreshButton} 
            onPress={fetchOrdersFromAPI}
          >
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={containers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderContainerCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E9CF', // Cream/beige background
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#F5E9CF', // Same as container background
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  refreshButton: {
    backgroundColor: '#FFCC99',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  refreshButtonText: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 14,
  },
  orderCard: {
    backgroundColor: '#FFCC99', // Peach color for cards
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  orderContent: {
    padding: 15,
  },
  orderField: {
    marginBottom: 10,
  },
  orderFieldLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  orderFieldText: {
    fontSize: 14,
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
    margin: 20,
  },
  retryButton: {
    backgroundColor: '#FFCC99',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginTop: 10,
  },
  retryButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  // Order Details Screen styles
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#F5E9CF',
  },
  backButton: {
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  detailsCard: {
    backgroundColor: '#FFCC99',
    borderRadius: 15,
    margin: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  detailsField: {
    marginBottom: 15,
  },
  detailsFieldLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  detailsFieldText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  pickButton: {
    backgroundColor: '#4CAF50', // Green color for "Pick" action
  },
  rejectButton: {
    backgroundColor: '#f44336', // Red color for "Reject" action
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default NameCard;


