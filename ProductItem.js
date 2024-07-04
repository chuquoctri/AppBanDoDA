import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const ProductItem = ({ product, onPress }) => {
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " ₫";
  };

  const shortenName = (name) => {
    return name.length > 20 ? name.substring(0, 17) + "..." : name;
  };
  

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: product.hinhanh }} 
            style={styles.image}
            resizeMode="cover" // Chế độ thay đổi kích thước hình ảnh
          />
        </View>
        <Text style={styles.price}>{formatPrice(product.giasp)}</Text>
        <Text style={styles.name}>{shortenName(product.tensanpham)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height:300,
    width:234,
    marginLeft: 18,
    marginTop: 30,
    margin: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor:'#e5dce8'
  },
  imageContainer: {
    width: 180,
    height: 200,
    overflow: "hidden", // Đảm bảo hình ảnh không vượt quá kích thước container
  },
  image: {
    width: "100%",
    height: "100%",
    marginTop:10,
  },
  price: {
    backgroundColor: '#ebb134',
    fontSize: 13,
    fontWeight: "bold",
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop:10,
  },
  name: {
    fontSize: 13,
    fontWeight: "bold",
    marginTop:10,
    paddingHorizontal: 10,
  }
});

export default ProductItem;
