import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';

const PriceSearchScreen = ({ navigation }) => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [products, setProducts] = useState([]); // State để lưu danh sách sản phẩm tìm kiếm được
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Hàm xử lý tìm kiếm sản phẩm theo khoảng giá
  const handleSearch = async () => {
    if (minPrice.trim() === '' || maxPrice.trim() === '') {
      setError('Vui lòng nhập đầy đủ thông tin khoảng giá.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`https://chuquoctri2310.000webhostapp.com/DoAn/timkiemtheogia.php?min_price=${minPrice.replace(/\D/g, '')}&max_price=${maxPrice.replace(/\D/g, '')}`);
      setProducts(response.data.result);
      setLoading(false);
    } catch (err) {
      setError('Có lỗi xảy ra khi tìm kiếm sản phẩm.');
      setLoading(false);
    }
  };
  // Hàm định dạng số thành dạng tiền tệ
  const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  // Hàm xử lý thay đổi giá tối thiểu
  const handleMinPriceChange = (value) => {
    const formattedValue = formatCurrency(value.replace(/\D/g, ''));
    setMinPrice(formattedValue);
  };
 // Hàm xử lý thay đổi giá tối đa
  const handleMaxPriceChange = (value) => {
    const formattedValue = formatCurrency(value.replace(/\D/g, ''));
    setMaxPrice(formattedValue);
  };
  // Hàm render cho từng sản phẩm trong danh sách
  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <Image source={{ uri: item.hinhanh }} style={styles.productImage} />
      <Text style={styles.productName}>{item.tensanpham}</Text>
      <Text style={styles.productPrice}>{formatCurrency(item.giasp)} VND</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tìm Kiếm Theo Khoảng Giá</Text>
      <TextInput
        style={styles.input}
        placeholder="Giá tối thiểu"
        keyboardType="numeric"
        value={minPrice}
        onChangeText={handleMinPriceChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Giá tối đa"
        keyboardType="numeric"
        value={maxPrice}
        onChangeText={handleMaxPriceChange}
      />
      <Button title="Tìm kiếm" onPress={handleSearch} />

      {error && <Text style={styles.error}>{error}</Text>}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          key={2}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
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
  error: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default PriceSearchScreen;
