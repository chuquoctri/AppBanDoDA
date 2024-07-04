import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';

const SearchResultsScreen = ({ route, navigation }) => {
  const { searchTerm } = route.params; // Lấy từ khóa tìm kiếm từ params của route
  const [products, setProducts] = useState([]);  // State để lưu trữ danh sách sản phẩm
  const [loading, setLoading] = useState(true); // trạng thái load dữ liệu

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(`https://chuquoctri2310.000webhostapp.com/DoAn/timkiem.php?timkiem=${encodeURIComponent(searchTerm)}`);
        setProducts(response.data.result);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }
  // cắt ngắn tên sản phẩm
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <Image source={{ uri: item.hinhanh }} style={styles.productImage} />
      <Text style={styles.productName}>{truncateText(item.tensanpham, 20)}</Text>
      <Text style={styles.productPrice}>{formatPrice(item.giasp)} VND</Text>
    </TouchableOpacity>
  );
  // dấu phẩy của số tiền
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Kết Quả Tìm Kiếm</Text>
      <FlatList
        data={products} // dữ liệu danh sách sản phẩm tìm ra
        renderItem={renderProductItem} // Hàm render từng sản phẩm
        keyExtractor={(item) => item.id.toString()} // Đảm bảo key là duy nhất
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  listContainer: {
    padding: 10,
  },
  productItem: {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2, // adds shadow for Android
    shadowColor: '#000', // adds shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // adds shadow for iOS
    shadowOpacity: 0.3, // adds shadow for iOS
    shadowRadius: 5, // adds shadow for iOS
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: '#888',
  },
});

export default SearchResultsScreen;
