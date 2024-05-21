import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const Cart = ({ navigation }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartString = await AsyncStorage.getItem('cart');
        if (cartString) {
          let cartItems = JSON.parse(cartString);
          // Remove duplicates based on item.id
          cartItems = cartItems.filter((item, index, self) =>
            index === self.findIndex((t) => (
              t.id === item.id
            ))
          );
          await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
          setCart(cartItems);
        }
      } catch (error) {
        console.error("Lỗi khi tải giỏ hàng từ AsyncStorage:", error);
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      loadCart();
    });

    return unsubscribe;
  }, [navigation]);

  const removeFromCart = async (productId) => {
    try {
      const updatedCart = cart.filter(item => item.id !== productId);
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
      setCart(updatedCart);
      console.log("Sản phẩm đã được xóa khỏi giỏ hàng:", productId);
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
    }
  };

  const addToCart = async (product) => {
    try {
      const existingProductIndex = cart.findIndex(item => item.id === product.id);
      if (existingProductIndex !== -1) {
        const updatedCart = [...cart];
        updatedCart[existingProductIndex].quantity += 1;
        await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
        setCart(updatedCart);
        console.log("Số lượng của sản phẩm đã được tăng lên:", product.id);
      } else {
        const updatedCart = [...cart, { ...product, quantity: 1 }];
        await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
        setCart(updatedCart);
        console.log("Sản phẩm đã được thêm vào giỏ hàng:", product.id);
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
    }
  };

  const decreaseQuantity = async (productId) => {
    try {
      const updatedCart = cart.map(item => {
        if (item.id === productId && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
      setCart(updatedCart);
      console.log("Sản phẩm đã được giảm số lượng:", productId);
    } catch (error) {
      console.error("Lỗi khi giảm số lượng sản phẩm:", error);
    }
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {cart.map((item, index) => (
          <View key={item.id} style={styles.itemContainer}>
            <Image source={{ uri: item.picture }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>{formatPrice(item.price)} ₫</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={() => decreaseQuantity(item.id)}>
                  <Ionicons name="remove-circle-outline" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => addToCart(item)}>
                  <Ionicons name="add-circle-outline" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.removeButton}>
              <Ionicons name="trash-bin-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Tổng tiền: {formatPrice(getTotalPrice())} ₫</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
  },
  itemImage: {
    width: 80,
    height: 80,
    marginRight: 20,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  removeButton: {
    padding: 10,
  },
  totalContainer: {
    marginTop: 20,
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Cart;
