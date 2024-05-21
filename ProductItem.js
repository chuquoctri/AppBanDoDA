import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const ProductItem = ({ product, onPress }) => {
  const formatPrice = (price) => {
    // Sử dụng hàm toLocaleString để định dạng giá tiền với dấu phẩy hàng nghìn
    return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Image source={{ uri: product.picture }} style={styles.image} />
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        <Text style={styles.name}>{product.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft:10,
    marginTop: 30,
    margin: 10,
    alignItems: "center",
  },
  image: {
    width: 130,
    height: 130,
    marginLeft:10,
  },
  price: {
    backgroundColor:'#ebb134',
    fontSize: 13,
    fontWeight: "bold",
    marginLeft:10,
    marginTop: 3,
  },
  name:{
    fontSize: 13,
    fontWeight: "bold",
  }
});

export default ProductItem;
