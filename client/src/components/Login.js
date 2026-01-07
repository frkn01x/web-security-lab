import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // VULNERABILITY: SQL Injection - Try: admin' OR '1'='1
      const response = await axios.post('/api/login', { username, password });
      
      if (response.data.success) {
        setUser(response.data.user);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Giriş başarısız');
    }
  };

  return (
    <div className="card">
      <h2>Giriş Yap <span className="vulnerability-tag">SQL Injection</span></h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Kullanıcı Adı:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Dene: admin' OR '1'='1"
          />
        </div>
        <div className="form-group">
          <label>Şifre:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Herhangi bir şey"
          />
        </div>
        <button type="submit" className="btn btn-primary">Giriş</button>
        {error && <div className="error">{error}</div>}
      </form>
      <div style={{marginTop: '20px', padding: '10px', background: '#fff3cd', borderRadius: '4px'}}>
        <strong>Test Kullanıcıları:</strong><br/>
        admin / admin123<br/>
        user1 / password123
      </div>
    </div>
  );
}

export default Login;
