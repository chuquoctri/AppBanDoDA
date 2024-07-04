import React, { createContext, useState } from 'react';
// AuthContext: Đối tượng context để lưu trữ và chia sẻ trạng thái đăng nhập.
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // lưu trữ trạng thái đăng nhập

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Tạo Context để Quản lý Trạng thái Đăng nhập