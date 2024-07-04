import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Button } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const Cart = ({ navigation }) => {
  const [cart, setCart] = useState([]);
// Load giỏ hàng từ AsyncStorage khi màn hình Cart được focus
  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartString = await AsyncStorage.getItem('cart');
        if (cartString) {
          let cartItems = JSON.parse(cartString);
          // Loại bỏ các phần tử trùng lặp dựa trên item.id
          cartItems = cartItems.filter((item, index, self) =>
            index === self.findIndex((t) => (
              t.id === item.id
            ))
          );
          // Đảm bảo tất cả các phần tử có giá trị giasp hợp lệ
          cartItems = cartItems.map(item => ({
            ...item,
            giasp: item.giasp ?? 0 // Đặt giá trị mặc định là 0 nếu giá trị giasp bị undefined hoặc null
          }));
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

  useEffect(() => {
    navigation.setOptions({ title: 'Giỏ hàng' });
  }, [navigation]);
  // xóa sản phẩm bằng productid
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
  // nếu sản phẩm có trong giỏ hàng thì tăng lên, nếu chưa có thì thêm vào giỏ
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
  

 // giảm số lượng 
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
  // định nghĩa giá tiền
  const formatPrice = (price) => {
    if (price === undefined || price === null) {
      return "0 ₫"; // hoặc giá trị mặc định mà bạn muốn hiển thị khi giá trị không hợp lệ
    }
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " ₫";
  };
  // dùng reduce để tính tổng số tiền 
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.giasp ?? 0) * item.quantity, 0);
  };

  const handleCheckout = async () => {
    const totalPrice = getTotalPrice();
    // Điều hướng tới màn hình thanh toán
    navigation.navigate('Payment', { cart, totalPrice });

    // Giả sử thanh toán thành công, xóa giỏ hàng
    await clearCart();
  };

  const clearCart = async () => {
    try {
      await AsyncStorage.removeItem('cart');
      setCart([]);
      console.log("Giỏ hàng đã được làm mới.");
    } catch (error) {
      console.error("Lỗi khi làm mới giỏ hàng:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {cart.map((item, index) => (
          <View key={item.id} style={styles.itemContainer}>
            <Image source={{ uri: item.hinhanh }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.tensanpham}</Text>
              <Text style={styles.itemPrice}>{formatPrice(item.giasp)} </Text>
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
          <Text style={styles.totalText}>Tổng tiền: {formatPrice(getTotalPrice())} </Text>
        </View>
        <Button title="Thanh toán" onPress={handleCheckout} />
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
