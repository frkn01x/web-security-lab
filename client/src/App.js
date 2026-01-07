import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import Register from './components/Register';
import Search from './components/Search';
import Profile from './components/Profile';
import Transfer from './components/Transfer';
import FileUpload from './components/FileUpload';
import Orders from './components/Orders';
import AdminPanel from './components/AdminPanel';
import ClickjackingDemo from './components/ClickjackingDemo';

axios.defaults.baseURL = 'http://localhost:3002';
axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get('/api/profile');
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <div className="warning-banner">
          ⚠️ UYARI: Bu uygulama kasıtlı güvenlik açıkları içerir - Sadece eğitim amaçlıdır!
        </div>
        
        <nav className="nav">
          <Link to="/">Ana Sayfa</Link>
          {!user ? (
            <>
              <Link to="/login">Giriş Yap</Link>
              <Link to="/register">Kayıt Ol</Link>
            </>
          ) : (
            <>
              <Link to="/search">Arama</Link>
              <Link to="/profile">Profil</Link>
              <Link to="/transfer">Para Transferi</Link>
              <Link to="/upload">Dosya Yükle</Link>
              <Link to="/orders">Siparişler</Link>
              {user.role === 'admin' && <Link to="/admin">Admin Panel</Link>}
              <Link to="/clickjacking">Clickjacking Demo</Link>
              <a href="#" onClick={handleLogout}>Çıkış Yap</a>
              <span style={{color: 'white', marginLeft: '20px'}}>
                Hoşgeldin, {user.username}
              </span>
            </>
          )}
        </nav>

        <div className="container">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={user ? <Search /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/login" />} />
            <Route path="/transfer" element={user ? <Transfer /> : <Navigate to="/login" />} />
            <Route path="/upload" element={user ? <FileUpload /> : <Navigate to="/login" />} />
            <Route path="/orders" element={user ? <Orders /> : <Navigate to="/login" />} />
            <Route path="/admin" element={user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
            <Route path="/clickjacking" element={<ClickjackingDemo />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function Home({ user }) {
  return (
    <div className="card">
      <h1>Vulnerable Web Application - Eğitim Platformu</h1>
      <p style={{marginTop: '15px', lineHeight: '1.6'}}>
        Bu uygulama aşağıdaki güvenlik açıklarını içerir:
      </p>
      <ul style={{marginTop: '15px', lineHeight: '2'}}>
        <li>✗ SQL Injection (SQLi)</li>
        <li>✗ Cross-Site Scripting (XSS)</li>
        <li>✗ Cross-Site Request Forgery (CSRF)</li>
        <li>✗ Broken Access Control</li>
        <li>✗ Authentication & Session Management Issues</li>
        <li>✗ File Upload Vulnerabilities</li>
        <li>✗ Directory Traversal</li>
        <li>✗ Security Misconfiguration</li>
        <li>✗ Insecure Direct Object Reference (IDOR)</li>
        <li>✗ Sensitive Data Exposure</li>
        <li>✗ Clickjacking</li>
        <li>✗ API Security Vulnerabilities</li>
      </ul>
      {!user && (
        <p style={{marginTop: '20px', color: '#666'}}>
          Başlamak için lütfen giriş yapın veya kayıt olun.
        </p>
      )}
    </div>
  );
}

export default App;
