import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const MOCK_USERS = [
  { email: "observer1@sharjah.com", password: "123456", role: "level1", name: "أحمد مصطفى (راصد - الربع الأول)" },
  { email: "coordinator1@sharjah.com", password: "123456", role: "level2", name: "د. عبد الله (منسق - الربع الأول)" },
  { email: "review@sharjah.com", password: "123456", role: "review_committee", name: "عضو لجنة المراجعة" },
  { email: "correction@sharjah.com", password: "123456", role: "correction_committee", name: "عضو لجنة الاستدراك" },
  { email: "main@sharjah.com", password: "123456", role: "level3", name: "أ. محمود (المنسق الرئيس لجان المراجعة والاستدراك)" },
  { email: "auditor@sharjah.com", password: "123456", role: "level4", name: "د. عصام (رئيس لجنة التدقيق والتحرير)" },
  { email: "scientific@sharjah.com", password: "123456", role: "scientific_committee", name: "عضو اللجنة العلمية" },
  { email: "approval@sharjah.com", password: "123456", role: "approval_committee", name: "عضو لجنة الاعتماد النهائي" },
  { email: "assistant@sharjah.com", password: "123456", role: "level5", name: "د. سلطان (المشرف المساعد - لجان الاعتماد والعلمية)" },
  { email: "admin@sharjah.com", password: "123456", role: "level6", name: "فضيلة المشرف العام" }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mock_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('mock_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('mock_user');
    }
  }, [user]);

  const login = (email, password) => {
    const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, role: user?.role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
