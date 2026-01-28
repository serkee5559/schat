import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './components/LoginPage';
import { FindIdPage } from './components/FindIdPage';
import { SignupPage } from './components/SignupPage';
import { MainPage } from './components/MainPage';

const App: React.FC = () => {
  // localStorage에서 초기 상태 읽어오기
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('userName') || '';
  });

  const handleLogin = (name: string) => {
    // localStorage에 저장
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', name);
    setIsLoggedIn(true);
    setUserName(name);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    localStorage.clear();
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/signup"
          element={<SignupPage />}
        />
        <Route
          path="/find-id"
          element={<FindIdPage />}
        />
        <Route
          path="/"
          element={isLoggedIn ? <MainPage onLogout={handleLogout} userName={userName} /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
