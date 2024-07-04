import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const SignupScreen = ({ navigation }) => {
  const { setUser } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    try {
      // Kiểm tra xác nhận mật khẩu
      if (password !== confirmPassword) {
        setMessage('Mật khẩu và xác nhận mật khẩu không khớp');
        return;
      }

      const response = await axios.post('https://chuquoctri2310.000webhostapp.com/DoAn/dangky.php', {
        username,
        email,
        password,
      });

      const result = response.data;
      setMessage(result.message);
      if (result.success) {
        Alert.alert('Thông báo', 'Đăng ký tài khoản thành công', [
          { text: 'OK', onPress: () => {
              setUser(result.user); // Lưu thông tin người dùng
              navigation.navigate('LoginScreen'); // Chuyển hướng đến trang đăng nhập
            }
          }
        ]);
      } else {
        Alert.alert('Thông báo', result.message);
      }
    } catch (error) {
      setMessage('Lỗi khi lấy dữ liệu: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Đăng Ký Tài Khoản</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên đăng nhập"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TextInput
        style={styles.input}
        placeholder="Xác nhận mật khẩu"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Button title="Đăng Ký" onPress={handleRegister} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  message: {
    marginTop: 20,
    color: 'red',
  },
});

export default SignupScreen;
