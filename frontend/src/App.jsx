import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicChatPage from './pages/PublicChatPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminApp from './pages/AdminApp';

export default function App() {
  const [adminPassword, setAdminPassword] = useState(
    () => sessionStorage.getItem('admin_access_password') || ''
  );

  const handleLoginSuccess = (password) => {
    setAdminPassword(password);
    sessionStorage.setItem('admin_access_password', password);
  };

  const handleLogout = () => {
    setAdminPassword('');
    sessionStorage.removeItem('admin_access_password');
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Chat — no password needed */}
        <Route path="/" element={<PublicChatPage />} />

        {/* Admin — password gate */}
        <Route
          path="/admin"
          element={
            adminPassword ? (
              <AdminApp
                accessPassword={adminPassword}
                onLogout={handleLogout}
              />
            ) : (
              <AdminLoginPage onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

        {/* Catch-all redirects to public */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
