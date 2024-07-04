import React, { useEffect, useState, useContext } from "react";
import { View, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Text, TextInput, Image, Dimensions } from "react-native";
import axios from "axios";
import ProductItem from "./ProductItem";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "./AuthContext";
import Carousel from "react-native-snap-carousel";

import { ViewPropTypes } from 'deprecated-react-native-prop-types';

const numColumns = 2;
const viewportWidth = Dimensions.get('window').width;

// Hình ảnh cho SliderBox
const slideImages = [
  "https://lano.vn/wp-content/uploads/2020/09/cap-nam-cong-so-da-bo-cao-cap-dung-laptop-15-6-inch-lano-cd112-1-300x300.jpg",
  "https://lano.vn/wp-content/uploads/2023/03/tui-xach-nu-da-bo-deo-cheo-thoi-trang-sang-trong-txn070-1-300x300.jpg",
  "https://lano.vn/wp-content/uploads/2023/09/clutch-da-that-cam-tay-1-khoa-handmade-khau-tay-thu-cong-100-lano-cltk03-5-2-300x300.jpg",
];

const renderSlideItem = ({ item }) => {
  return (
    <Image source={{ uri: item }} style={styles.slideImage} />
  );
};

// Header Component
const Header = ({ searchTerm, setSearchTerm, handleSearch, navigateToCart, user, navigation }) => {
  return (
    <View style={styles.header}>
      {/* <View>
      <TouchableOpacity style={styles.toolbarItem_new} onPress={() => navigation.navigate('LoginScreen')}>
          <Ionicons name="person-outline" size={24} color="black" />
          <Text style={styles.toolbarItem}>{user ? user.username : "Đăng nhập"}</Text>
        </TouchableOpacity>
      </View> */}
      <View style={styles.menuBottomRow}>
        <Image source={{ uri: 'https://lano.vn/wp-content/uploads/2020/10/logo.png' }} style={styles.logo} />
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <TouchableOpacity onPress={handleSearch}>
            <Ionicons name="search" size={24} color="black" style={styles.searchIcon} />
          </TouchableOpacity>
        </View>
      </View>
     
      <Carousel // slide show
        data={slideImages}
        renderItem={renderSlideItem}
        sliderWidth={viewportWidth}
        itemWidth={viewportWidth}
        loop={true}
        autoplay={true}
        autoplayInterval={3000}
      />

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText_2}>TRANG CHỦ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('MenCategoryScreen')}>
          <Text style={styles.menuText_2}>ĐỒ DA NAM</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('WomenCategoryScreen')}>
          <Text style={styles.menuText_2}>ĐỒ DA NỮ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('HandmadeCategoryScreen')}>
          <Text style={styles.menuText_2}>ĐỒ HANDMADE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Main Component
const ProductList = () => {
  const { user } = useContext(AuthContext);  // Lấy thông tin người dùng từ AuthContext
  const [products, setProducts] = useState([]); // State để lưu danh sách sản phẩm
  const [loading, setLoading] = useState(true); // State để theo dõi trạng thái tải dữ liệu
  const [searchTerm, setSearchTerm] = useState(""); // State để lưu từ khóa tìm kiếm
  const navigation = useNavigation(); // Hook để điều hướng

  useEffect(() => {
    axios
      .get("https://chuquoctri2310.000webhostapp.com/DoAn/getsanphammoi.php")
      .then((response) => {
        setProducts(response.data.result);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Gọi API để lấy danh sách sản phẩm mới
    navigation.setOptions({ title: 'Trang chủ' });
  }, [navigation]);
  // Hàm xử lý khi nhấn vào một sản phẩm
  const handleProductPress = (product) => {
    navigation.navigate("ProductDetail", { product });
  };
  // Hàm điều hướng tới giỏ hàng
  const navigateToCart = () => {
    navigation.navigate("Cart");
  };
  // Hàm xử lý tìm kiếm
  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      navigation.navigate("SearchResults", { searchTerm }); 
    }
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
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        navigateToCart={navigateToCart}
        user={user}
        navigation={navigation}
      />
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <ProductItem product={item} onPress={() => handleProductPress(item)} />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
      />
      <View style={styles.bottomToolbar}>
        <TouchableOpacity style={styles.toolbarItem} onPress={() => navigation.navigate('LoginScreen')}>
          <Ionicons name="person-outline" size={24} color="black" />
          <Text style={styles.toolbarItem}>{user ? user.username : "Đăng nhập"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolbarItem} onPress={() => navigation.navigate('PriceSearchScreen')}>
          <Ionicons name="search" size={24} color="black" style={styles.searchIcon} />
          <Text style={styles.toolbarText}>Tìm kiếm</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolbarItem} onPress={navigateToCart}>
          <Ionicons name="cart-outline" size={24} color="black" />
          <Text style={styles.toolbarText}>Giỏ hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolbarItem} onPress={() => navigation.navigate('OrderHistoryScreen')}>
          <Ionicons name="receipt-outline" size={24} color="black" />
          <Text style={styles.toolbarText}>Đơn hàng</Text>
        </TouchableOpacity>
        
      </View>
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
  menuBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 10,
  },
  logo: {
    width: 200,
    height: 90,
    marginLeft: 5,
  },
  toolbarItem_new:{
    marginLeft:400,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    flex: 1,
    paddingHorizontal: 10,
    marginLeft: 8,
    marginTop: 35,
    height: 50,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 6,
    fontSize: 16,
  },
  searchIcon: {
    paddingHorizontal: 10,
    paddingRight: -20,
  },
  menuContainer: {
    flexDirection: 'row',
    backgroundColor: '#e5cece',
    width: 493,
    height: 50,
    marginTop: 2,
  },
  menuText_2: {
    paddingLeft:12,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 10,
  },
  bottomToolbar: {
    flexDirection: 'row', // nằm ngang
    justifyContent: 'space-around', // cách đều 10
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  toolbarItem: {
    alignItems: 'center',
  },
  toolbarText: {
    marginTop: 4,
    fontSize: 12,
    color: 'black',
  },
  slideImage: {
    width: 493,
    height: 200,
  },
});

export default ProductList;
