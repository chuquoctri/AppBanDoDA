import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { AuthContext } from './AuthContext';

const OrderHistoryScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext); // Lấy thông tin người dùng từ context
  const [orders, setOrders] = useState([]); // State để lưu danh sách đơn hàng
  const [loading, setLoading] = useState(true); // State để theo dõi trạng thái tải dữ liệu
  const [error, setError] = useState(null); // State để lưu lỗi nếu có
  // useEffect để lấy dữ liệu đơn hàng khi component được render
  useEffect(() => {
    if (!user || !user.email) {
      // Nếu người dùng chưa đăng nhập, chuyển hướng đến màn hình đăng nhập
      navigation.navigate('LoginScreen');
    } else {
      fetch(`https://chuquoctri2310.000webhostapp.com/DoAn/xemdonhangemail.php?email=${user.email}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            setError(data.error); // Nếu có lỗi từ API, lưu lỗi vào state
          } else {
            setOrders(data); // Lưu danh sách đơn hàng vào state
          }
          setLoading(false); // Kết thúc trạng thái loading
        })
        .catch((error) => {
          console.error('Lỗi khi lấy đơn hàng:', error);
          setError(error); // Lưu lỗi vào state
          setLoading(false); // Kết thúc trạng thái loading
        });
    }
  }, [user, navigation]);  // useEffect phụ thuộc vào user và navigation

  const formatCurrency = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " ₫";
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Bạn chưa có đơn hàng nào!!: {error.message || error}</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Đơn hàng của bạn</Text>
      {orders.length > 0 ? (
        orders.map((order) => (
          <View key={order.id} style={styles.order}>
            <Text style={styles.orderId}>ID Đơn hàng: {order.id}</Text>
            <Text>Địa chỉ: {order.diachi}</Text>
            <Text>Email: {order.email}</Text>
            <Text>Số điện thoại: {order.sodienthoai}</Text>
            <Text>Số lượng sản phẩm: {order.soluong}</Text>
            <Text>Tổng tiền: {formatCurrency(order.tongtien)}</Text>
            <Text>Ngày đặt: {order.ngaydat}</Text>
            <Text>Trạng thái: {order.trangthai === 1 ? 'Đã xác nhận' : 'Chưa xác nhận'}</Text>
            <Text style={styles.orderDetailsHeader}>Chi tiết đơn hàng:</Text>
            {order.chitiet && order.chitiet.length > 0 ? (
              order.chitiet.map((detail, index) => (
                <View key={index} style={styles.orderDetail}>
                  <Image 
                    source={{ uri: detail.hinhanh }}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                  <View style={styles.productInfo}>
                    <Text>Sản phẩm: {detail.tensanpham}</Text>
                    <Text>Số lượng: {detail.soluong}</Text>
                    <Text>Giá: {formatCurrency(detail.giasp)}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text>Không có sản phẩm trong đơn hàng này.</Text>
            )}
          </View>
        ))
      ) : (
        <Text style={styles.noOrders}>Không tìm thấy đơn hàng nào cho người dùng này.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  order: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  orderDetailsHeader: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  orderDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  noOrders: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#888',
  },
});

export default OrderHistoryScreen;
