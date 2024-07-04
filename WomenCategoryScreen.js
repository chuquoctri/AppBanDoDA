/**
 * Đồ Da Nữ
 */

import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, StyleSheet, Text } from "react-native";
import axios from "axios";
import ProductItem from "./ProductItem";
import { useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';

const numColumns = 2;

const WomenCategoryScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchProducts();
    navigation.setOptions({
      headerTitle: "Đồ Da Nữ",
    });
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://chuquoctri2310.000webhostapp.com/DoAn/getdodanu.php");
      setProducts(response.data.result);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleProductPress = (product) => {
    navigation.navigate("ProductDetail", { product });
  };

  const handleCartPress = () => {
    navigation.navigate("Cart");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.breadcrumbContainer}>
        <Ionicons name="home" style={styles.iconBread} />
        <Text style={styles.breadcrumbText}> Lano / Trang chủ / Đồ da nữ</Text>
      </View>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <ProductItem product={item} onPress={() => handleProductPress(item)} />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        contentContainerStyle={styles.productList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  breadcrumbContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  iconBread: {
    fontSize: 20,
    marginRight: 5,
  },
  breadcrumbText: {
    fontSize: 16,
    color: '#333',
  },
  productList: {
    paddingHorizontal: 10,
  },
  breadcrumbContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: '#c1c5db',
    marginLeft: -25,
  },
  breadcrumbText: {
    fontSize: 16,
    color: '#000',
    paddingBottom: 8,
    
  },
  iconBread: {
    marginLeft: 150,
    paddingBottom: 8,
    fontSize: 16,
  },
});

export default WomenCategoryScreen;
