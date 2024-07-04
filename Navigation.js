// Navigation.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ProductList from './ProductList';
import ProductDetail from './ProductDetail';
import MenCategoryScreen from './MenCategoryScreen';
import Cart from './Cart';
import SearchResultsScreen from './SearchResultsScreen'; // Import màn hình SearchResultsScreen

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="ProductList" component={ProductList} options={{ title: 'Product List' }} />
        <Stack.Screen name="ProductDetail" component={ProductDetail} options={{ title: 'Product Detail' }} />
        <Stack.Screen name="MenCategoryScreen" component={MenCategoryScreen} options={{ title: 'Đồ da nam' }} />
        <Stack.Screen name="Cart" component={Cart} options={{ title: 'Giỏ hàng' }} />
        <Stack.Screen name="SearchResults" component={SearchResultsScreen} options={{ title: 'Kết quả tìm kiếm' }} /> 
        <Stack.Screen name="PriceSearch" component={PriceSearchScreen} options={{ title: 'Tìm kiếm theo khoảng giá' }} /> {/* Thêm màn hình SearchResultsScreen vào Stack.Navigator */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
