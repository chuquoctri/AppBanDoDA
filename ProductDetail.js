import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';

const ProductDetail = ({ route, navigation }) => {
  const { product } = route.params; // Lấy thông tin sản phẩm từ params của route
  const [relatedProducts, setRelatedProducts] = useState([]); // Khởi tạo state cho sản phẩm liên quan
  useEffect(() => {
       // Giả lập lấy dữ liệu sản phẩm liên quan
    const fetchedRelatedProducts = [
      { id: 1, name: 'Ví da', image: 'https://lano.vn/wp-content/uploads/2024/06/vi-3-gap-khau-tay-thu-cong-da-bo-cao-cap-nho-gon-tien-loi-lano-vdntk024-2-300x300.jpg', price: 1550000 },
      { id: 2, name: 'Túi da', image: 'https://lano.vn/wp-content/uploads/2024/04/tui-da-deo-cheo-nam-cong-so-gia-re-lano-kt217-1.jpg', price: 980000 },
      { id: 3, name: 'Balo da', image: 'https://lano.vn/wp-content/uploads/2021/11/balo-da-nu-cao-cap-thoi-trang-tien-loi-lano-blnu08-22-300x300.jpg', price: 2700000 },
      { id: 4, name: 'Túi xách da', image: 'https://lano.vn/wp-content/uploads/2023/03/tui-xach-nu-da-bo-deo-cheo-thoi-trang-sang-trong-txn070-1-300x300.jpg', price: 1550000 },
      { id: 5, name: 'Ví da', image: 'https://lano.vn/wp-content/uploads/2024/06/vi-3-gap-khau-tay-thu-cong-da-bo-cao-cap-nho-gon-tien-loi-lano-vdntk024-2-300x300.jpg', price: 1550000 },
      { id: 6, name: 'Túi da', image: 'https://lano.vn/wp-content/uploads/2024/04/tui-da-deo-cheo-nam-cong-so-gia-re-lano-kt217-1.jpg', price: 980000 },
    ];
    setRelatedProducts(fetchedRelatedProducts); // Đặt state cho sản phẩm liên quan
  }, []);

  const addToCart = async () => {
    try {
      const existingCart = await AsyncStorage.getItem('cart'); // Lấy dữ liệu giỏ hàng hiện tại từ AsyncStorage
      let cart = existingCart ? JSON.parse(existingCart) : [];  // Nếu giỏ hàng đã có sản phẩm thì parse JSON, nếu chưa thì khởi tạo mảng rỗng
      // Kiểm tra sản phẩm có tồn tại trong giỏ hàng không
      const existingProductIndex = cart.findIndex(item => item.id === product.id); // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
      if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
      } else {
        cart = [...cart, { ...product, quantity: 1 }]; // Nếu sản phẩm chưa có, thêm sản phẩm vào giỏ hàng
      }

      await AsyncStorage.setItem('cart', JSON.stringify(cart)); // Lưu giỏ hàng mới vào AsyncStorage
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
        <View style={styles.header}>
          <View style={styles.topMenu}>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Giới thiệu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Bảo hành</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Góc tư vấn</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Liên hệ</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bottomMenu}>
            <Image source={{ uri: 'https://lano.vn/wp-content/uploads/2020/10/logo.png' }} style={styles.logo} />
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm"
              />
              <Ionicons name="search" size={24} color="black" style={styles.searchIcon} />
            </View>
          </View>
          <View style={styles.breadcrumbContainer}>
            <Ionicons name="home" style={styles.Iconbread} />
            <Text style={styles.breadcrumbText}> Lano / Trang chủ / Đồ da</Text>
          </View>
        </View>
        <Image source={{ uri: product.hinhanh }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.text_ThongTin}>Thông tin sản phẩm</Text>
          <Text style={styles.text_ten}><Text style={styles.boldText}>{product.tensanpham}</Text></Text>
          <Text style={styles.text_gia}>Giá: <Text style={[styles.boldText, styles.largeText]}>{formatPrice(product.giasp)} ₫</Text></Text>
          
          <Text style={styles.descriptionTitle}>Mô tả: </Text>
          <Text style={styles.descriptionText}>{product.mota}</Text>

          <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
            <Text style={styles.addToCartButtonText}>Thêm vào giỏ hàng</Text>
          </TouchableOpacity>
        </View>

        {/* Related Products Section */}
        <View style={styles.relatedProductsContainer}>
          <Text style={styles.relatedProductsTitle}>Sản phẩm liên quan</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {relatedProducts.map((relatedProduct) => (
              <View key={relatedProduct.id} style={styles.relatedProductCard}>
                <Image source={{ uri: relatedProduct.image }} style={styles.relatedProductImage} />
                <Text style={styles.relatedProductName}>{relatedProduct.name}</Text>
                <Text style={styles.relatedProductPrice}>{formatPrice(relatedProduct.price)} ₫</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Footer Links */}
        <View style={styles.footerLinks}>
          <TouchableOpacity style={styles.footerLink}>
            <Text style={styles.footerLinkText_quydinh}>Quy định</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerLink}>
            <Text style={styles.footerLinkText_chinhsach}>Chính sách</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerLink}>
            <Text style={styles.footerLinkText}>Chính sách đổi, trả hàng hoàn tiền</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerLink}>
            <Text style={styles.footerLinkText}>Chính sách vận chuyển</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerLink}>
            <Text style={styles.footerLinkText}>Quy định & Thanh toán</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerLink}>
            <Text style={styles.footerLinkText}>Chính sách bảo mật thông tin</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerLink}>
            <Text style={styles.footerLinkText}>Kiểm tra mã vận</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerLink}>
            <Text style={styles.footerLinkText}>Đồ Da Handmade</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerLink}>
            <Text style={styles.footerLinkText}>Túi Xách Da Nữ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerLink}>
            <Text style={styles.footerLinkText}>Cặp Da Nam</Text>
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
    alignItems: 'center',
    paddingVertical: 20,
  },
  header: {
    width: '100%',
    backgroundColor: '#f8f8f8',
    paddingBottom: 10,
  },
  topMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#887839',
  },
  menuItem: {
    paddingHorizontal: 10,
  },
  menuText: {
    fontSize: 14,
    color: '#dde0f0',
    fontWeight: 'bold',
  },
  bottomMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingBottom: 10,
    marginTop: 10,
  },
  logo: {
    width: 230,
    height: 80,
    resizeMode: 'contain',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6e6e6',
    borderRadius: 5,
    paddingHorizontal: 10,
    flex: 1,
    marginLeft: -5,
    marginTop: 17,
  },
  searchInput: {
    flex: 1,
    height: 50,
  },
  searchIcon: {
    marginLeft: 5,
  },
  Iconbread: {
    marginLeft: 150,
    paddingBottom: 8,
    fontSize: 20,
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
    fontSize: 20,
    color: '#000',
    paddingBottom: 8,
  },
  image: {
    marginTop: 65,
    marginLeft: -300,
    width: 200,
    height: 300,
    marginBottom: 20,
  },
  infoContainer: {
    marginTop: -250,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  text_ThongTin: {
    fontWeight: 'bold',
    fontSize: 25,
    marginTop: -120,
  },
  text_ten: {
    marginTop: 25,
    fontSize: 20,
    width: 300,
    marginLeft: 220,
  },
  text_gia: {
    fontWeight: 'bold',
    marginTop: 20,
    fontSize: 20,
    width: 200,
    marginLeft: 230,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#887839',
  },
  largeText: {
    fontSize: 20,
    color: '#f58976',
  },
  addToCartButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
    marginLeft: 200,
  },
  addToCartButtonText: {
    width: 125,
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 12,
  },
  descriptionTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 20,
    marginBottom: 10,
  },
  descriptionText: {
    width: 160,
    fontSize: 15,
    color: '#555',
    marginLeft: 220,
    marginTop: -33,
  },
  relatedProductsContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 40,
    marginBottom: 20,
  },
  relatedProductsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  relatedProductCard: {
    alignItems: 'center',
    marginRight: 10,
  },
  relatedProductImage: {
    width: 100,
    height: 100,
  },
  relatedProductName: {
    fontSize: 16,
    marginTop: 5,
  },
  relatedProductPrice: {
    fontSize: 16,
    color: '#f58976',
    fontWeight: 'bold',
  },
  policyContainer: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 20,
  },
  policyTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  policyItem: {
    paddingVertical: 5,
  },
  policyItemText: {
    fontSize: 14,
    color: '#333',
  },
  productCategory: {
    width: '100%',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 20,
  },
  categoryTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  categoryItem: {
    paddingVertical: 5,
  },
  categoryItemText: {
    fontSize: 14,
    color: '#333',
  },
  footerLinks: {
    width: '100%',
    backgroundColor: '#887839',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 60,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  footerLink: {
    paddingVertical: 5,
    width: '50%',
  },
  footerLinkText: {
    fontSize: 14,
    color: '#fff',
  },
  footerLinkText_quydinh: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 30,
  },
  footerLinkText_chinhsach: {
    marginLeft: 30,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ProductDetail;
