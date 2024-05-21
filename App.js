import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ProductList from "./ProductList";
import ProductDetail from "./ProductDetail";
import MenCategoryScreen from "./MenCategoryScreen";
import Cart from './Cart';

const Stack = createStackNavigator();

const App = () => {
  const [cart, setCart] = useState([]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ProductList">
        <Stack.Screen name="ProductList" component={ProductList} />
        <Stack.Screen name="ProductDetail">
          {props => <ProductDetail {...props} cart={cart} setCart={setCart} />}
        </Stack.Screen>
        <Stack.Screen name="MenCategoryScreen" component={MenCategoryScreen} />
        <Stack.Screen name="Cart">
          {props => <Cart {...props} cart={cart} setCart={setCart} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
