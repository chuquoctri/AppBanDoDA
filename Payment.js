import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './AuthContext';

const Payment = ({ route, navigation }) => {
  const { cart, totalPrice } = route.params;
  const { user } = useContext(AuthContext);

  useEffect(() => {
    navigation.setOptions({ title: 'Trang thanh toán' });
  }, [navigation]);

  // State để lưu thông tin khách hàng
  const [name, setName] = useState(user ? user.username : '');
  const [sodienthoai, setSodienthoai] = useState('');
  const [email, setEmail] = useState(user ? user.email : '');
  const [diachi, setDiachi] = useState('');

  const formatPrice = (price) => {
    if (price === undefined || price === null) {
      return "0 ₫"; // hoặc giá trị mặc định mà bạn muốn hiển thị khi giá trị không hợp lệ
    }
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " ₫";
  };

  // Xử lý thanh toán
  const handlePayment = async () => {
    try {
      // Kiểm tra xem người dùng đã đăng nhập hay chưa
      if (!user) {
        Alert.alert('Yêu cầu đăng nhập', 'Vui lòng đăng nhập để tiếp tục thanh toán.', [
          { text: 'OK', onPress: () => navigation.navigate('LoginScreen') }
        ]);
        return;
      }

      // Kiểm tra xem đã điền đầy đủ thông tin chưa
      if (!name || !sodienthoai || !email || !diachi) {
        Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ thông tin trước khi thanh toán.');
        return;
      }

      const response = await fetch('https://chuquoctri2310.000webhostapp.com/DoAn/dathang.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          iduser: user.id,
          diachi: diachi,
          email: email,
          sodienthoai: sodienthoai,
          soluong: cart.reduce((total, item) => total + item.quantity, 0),
          tongtien: totalPrice,
          chitiet: JSON.stringify(cart.map(item => ({
            idsp: item.id,
            soluong: item.quantity,
            giasp: item.giasp
          })))
        }).toString()
      });

      const responseText = await response.text();
      console.log('Phản hồi từ máy chủ:', responseText);

      const data = JSON.parse(responseText);

      if (data.success) {
        // Xóa giỏ hàng sau khi thanh toán thành công
        await AsyncStorage.setItem('cartItems', JSON.stringify([]));

        Alert.alert('Thành công', 'Đặt hàng thành công');
        navigation.navigate('ProductList'); // Điều hướng đến trang ProductList sau khi thanh toán thành công
      } else {
        Alert.alert('Lỗi', 'Đặt hàng không thành công: ' + data.message);
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu thanh toán:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi gửi yêu cầu thanh toán: ' + error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Thông tin khách hàng</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên khách hàng"
        value={name}
        onChangeText={setName}
        editable={!user} // Không cho phép chỉnh sửa nếu đã đăng nhập
      />
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        value={sodienthoai}
        onChangeText={setSodienthoai}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        editable={!user} // Không cho phép chỉnh sửa nếu đã đăng nhập
      />
      <TextInput
        style={styles.input}
        placeholder="Địa chỉ"
        value={diachi}
        onChangeText={setDiachi}
      />
      <Text style={styles.title}>Chi tiết giỏ hàng</Text>
      {cart.map((item) => (
        <View key={item.id} style={styles.itemContainer}>
          <Image source={{ uri: item.hinhanh }} style={styles.itemImage} />
          <View style={styles.itemDetails}>
            <Text style={styles.itemName}>{item.tensanpham}</Text>
            <View style={styles.itemSubDetails}>
              <Text style={styles.itemText}>{item.quantity} x </Text>
              <Text style={styles.itemText}>{formatPrice(item.giasp)}</Text>
            </View>
          </View>
        </View>
      ))}
      <Text style={styles.totalText}>Tổng tiền: {formatPrice(totalPrice)}</Text>
      <Button title="Thanh toán" onPress={handlePayment} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemImage: {
    width: 75,
    height: 75,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
  },
  itemSubDetails: {
    flexDirection: 'row',
  },
  itemText: {
    fontSize: 14,
  },
  totalText: {
    textAlign:'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});

export default Payment;
