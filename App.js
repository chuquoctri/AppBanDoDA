import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ProductList from "./ProductList";
import ProductDetail from "./ProductDetail";
import MenCategoryScreen from "./MenCategoryScreen";
import Cart from './Cart';
import Payment from './Payment';
import WomenCategoryScreen from './WomenCategoryScreen';
import HandmadeCategoryScreen from "./HandmadeCategoryScreen";
import LoginScreen from "./LoginScreen";
import { AuthProvider } from './AuthContext';
import SignupScreen from "./SignupScreen";
import SearchResultsScreen from "./SearchResultsScreen";
import OrderHistoryScreen from "./OrderHistoryScreen";
import PriceSearchScreen from "./PriceSearchScreen";


const Stack = createStackNavigator();

const App = () => {
  const [cart, setCart] = useState([]);

  // Tạo các thành phần để sử dụng với Stack.Screen
  const ProductDetailScreen = (props) => <ProductDetail {...props} cart={cart} setCart={setCart} />;
  const CartScreen = (props) => <Cart {...props} cart={cart} setCart={setCart} />;

  // Hàm xử lý khi đăng ký thành công
  const handleSignUpSuccess = () => {
    // Điều hướng đến màn hình đăng nhập
    navigation.navigate('LoginScreen');
  };

  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ProductList">
          <Stack.Screen name="ProductList" component={ProductList} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} 
           options={{ title: 'Trang chi tiết' }}/>
          <Stack.Screen name="MenCategoryScreen" component={MenCategoryScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Payment" component={Payment} />
          <Stack.Screen name="WomenCategoryScreen" component={WomenCategoryScreen} />
          <Stack.Screen name="HandmadeCategoryScreen" component={HandmadeCategoryScreen} />
          <Stack.Screen name="PriceSearchScreen" component={PriceSearchScreen}
           options={{ title: 'Trang tìm kiếm theo giá' }} />
          <Stack.Screen name="OrderHistoryScreen" component={OrderHistoryScreen}
           options={{ title: 'Trang thông tin đơn hàng' }} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} 
           options={{ title: 'Trang đăng nhập' }}/>
          <Stack.Screen name="SignupScreen">
            {(props) => <SignupScreen {...props} onSignUpSuccess={handleSignUpSuccess} />}
          </Stack.Screen>
          <Stack.Screen name="SearchResults" component={SearchResultsScreen} 
           options={{ title: 'Trang tìm kiếm' }}/>
        </Stack.Navigator>
        
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
