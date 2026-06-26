import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './LoginScreen.tsx';
import SelectRoleScreen from './Ad_screen.tsx';
import ForgetPasswordScreen from './Forget_password.tsx';
import JoinAsScreen from './JoinAsScreen.tsx';
import RestaurantSignupScreen from './RestaurantSignupScreen.tsx';
import NGOAccount from './NGO_Signup_Screen.tsx';
import DonorSignupScreen from './Donor_signup.tsx';
import DeliverySignupScreen from './Delivery_signup.tsx';
import RestaurantDashboardScreen from './Restaurant_dash.tsx';
import PostFoodScreen from './Post_food.tsx';
import PostSuccessScreen from './Post_success.tsx';
import FoodOrdersScreen from './Food_dashboard.tsx';
import ProfileScreen from './ProfileScreen.tsx';
import ContactUsScreen from './ContactUsScreen.tsx';
import DeliveryOrdersScreen from './Delivery_start.tsx';
import HomePage from './NgoHomePage.tsx'
import DonateScreen from './Donate_screen.tsx'
import FoodDetailPage from './FoodDetailPage.tsx'
import PaymentScreen from './Selectpayment.tsx'
import NameCard from './NameCard.tsx'
import FoodItem from './FoodItem.tsx'
import RestaurantHomePage from './RestaurantHomePage.tsx';
import WalletPage from './WalletPage.tsx';



export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ad: undefined;
  ForgetPassword: undefined;
  JoinAs: undefined;
  RestaurantSignup: undefined;
  NGOAccount: undefined;
  DonorSignup: undefined;


  
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Ad" component={SelectRoleScreen} />
        <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
        <Stack.Screen name="Joinas" component={JoinAsScreen} />
        <Stack.Screen name="Restaurantsign" component={RestaurantSignupScreen} />
        <Stack.Screen name="NGOsign" component={NGOAccount} />
        <Stack.Screen name="DonorSignup" component={DonorSignupScreen} />
        <Stack.Screen name="DeliverySignup" component={DeliverySignupScreen} />
        <Stack.Screen name="RestaurantDash" component={RestaurantDashboardScreen} />
        <Stack.Screen name="PostFood" component={PostFoodScreen} />
        <Stack.Screen name="PostSuccess" component={PostSuccessScreen} />
        <Stack.Screen name="Fooddash" component={FoodOrdersScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="ContactUs" component={ContactUsScreen} />
        <Stack.Screen name="DeliveryOrdersScreen" component={DeliveryOrdersScreen} />
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="DonateScreen" component={DonateScreen} />
        <Stack.Screen name="FoodDetailPage" component={FoodDetailPage} />
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
        <Stack.Screen name="NameCard" component={NameCard} />
        <Stack.Screen name="FoodItem" component={FoodItem} />
        <Stack.Screen name = "RestaurantHomePage" component={RestaurantHomePage} />
        <Stack.Screen name="WalletPage" component={WalletPage} />
        




      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
