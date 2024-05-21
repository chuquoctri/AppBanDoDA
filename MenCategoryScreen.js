import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Text, TextInput, Image } from "react-native";
import axios from "axios";
import ProductItem from "./ProductItem";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const numColumns = 2;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    axios
      .get("http://192.168.0.102/home")
      .then((response) => {
        setProducts(response.data);
        console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

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
      <View style={styles.header}>
        
        <View style={styles.menuBottomRow}>
          <Image source={{ uri: 'https://lano.vn/wp-content/uploads/2020/10/logo.png' }} style={styles.logo} />
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm"
            />
            <Ionicons name="search" size={24} color="black" style={styles.searchIcon} />
          </View>
        </View>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText_2}>TRANG CHỦ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('MenCategoryScreen')}>
            <Text style={styles.menuText_2}>ĐỒ DA NAM</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText_2}>ĐỒ DA NỮ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText_2}>CLUTCH</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={products}
        renderItem={({ item }) => (
          <ProductItem product={item} onPress={() => handleProductPress(item)} />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
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
  header: {
    flexDirection: 'column',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  menuTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 5,
    backgroundColor: '#887839',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: 380,
    marginLeft: -24,
  },
  menuBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginTop: 10,
  },
  logo: {
    width: 130,
    height: 50,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    flex: 1,
    paddingHorizontal: 10,
    marginLeft: 20,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
  },
  searchIcon: {
    paddingHorizontal: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  iconItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },
  iconText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuContainer: {
    flexDirection: 'row',
    backgroundColor: '#e5cece',
    width: 400,
    marginLeft: -20,
  },
  menuItem: {
    padding: 8,
  },
  menuText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  menuText_2: {
    marginLeft: 10,
    fontSize: 11,
    fontWeight: 'bold',
    color: 'black',
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  column: {
    flex: 1,
  },
  storeTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  policyTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ProductList;
