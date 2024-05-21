import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductDetail = ({ route, navigation }) => {
  const { product } = route.params;

  const addToCart = async () => {
    try {
      const existingCart = await AsyncStorage.getItem('cart');
      let cart = existingCart ? JSON.parse(existingCart) : [];

      const existingProductIndex = cart.findIndex(item => item.id === product.id);
      if (existingProductIndex !== -1) {
        // Product already exists in cart
        cart[existingProductIndex].quantity += 1;
      } else {
        // Product does not exist in cart, add it
        cart = [...cart, { ...product, quantity: 1 }];
      }

      await AsyncStorage.setItem('cart', JSON.stringify(cart));
      console.log("Đã thêm sản phẩm vào giỏ hàng:", product);
      navigation.navigate('Cart');
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
    }
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={{ uri: product.picture }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.text_ThongTin}>Thông tin sản phẩm</Text>
          <Text style={styles.text}><Text style={styles.boldText}>{product.name}</Text></Text>
          <Text style={styles.text}>Giá: <Text style={[styles.boldText, styles.largeText]}>{formatPrice(product.price)} ₫</Text></Text>
          <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
            <Text style={styles.addToCartButtonText}>Thêm vào giỏ hàng</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    alignItems: 'center',
  },
  image: {
    width: 130,
    height: 160,
    marginBottom: 20,
  },
  infoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  text_ThongTin: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 10,
  },
  text: {
    fontSize: 15,
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#887839',
  },
  largeText: {
    fontSize: 18,
  },
  addToCartButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 5,
    marginTop: 20,
  },
  addToCartButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});

export default ProductDetail;
