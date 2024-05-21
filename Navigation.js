// Navigation.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ProductList from './ProductList';
import ProductDetail from './ProductDetail';
import MenCategoryScreen from './MenCategoryScreen';
import Cart from './Cart';

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="ProductList" component={ProductList} options={{ title: 'Product List' }} />
        <Stack.Screen name="ProductDetail" component={ProductDetail} options={{ title: 'Product Detail' }} />
        <Stack.Screen name="MenCategoryScreen" component={MenCategoryScreen} options={{ title: 'Đồ da nam' }} />
        <Stack.Screen name="Cart" component={Cart} options={{ title: 'Giỏ hàng' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
