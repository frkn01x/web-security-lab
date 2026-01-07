import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // VULNERABILITY: API Security - No rate limiting
      const response = await axios.get('/api/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      try {
        // VULNERABILITY: CSRF + Broken Access Control
        await axios.delete(`/api/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const fetchDebugInfo = async () => {
    try {
      // VULNERABILITY: Security Misconfiguration - Debug endpoint exposed
      const response = await axios.get('/api/debug');
      setDebugInfo(response.data);
    } catch (error) {
      console.error('Failed to fetch debug info:', error);
    }
  };

  return (
    <div className="card">
      <h2>Admin Panel <span className="vulnerability-tag">API Security</span></h2>
      
      <h3>Tüm Kullanıcılar</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Kullanıcı Adı</th>
            <th>Email</th>
            <th>Şifre</th>
            <th>Rol</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.password}</td>
              <td>{user.role}</td>
              <td>
                <button 
                  onClick={() => deleteUser(user.id)} 
                  className="btn btn-danger"
                  style={{padding: '5px 10px', fontSize: '12px'}}
                >
                  Sil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{marginTop: '30px'}}>
        <h3>Debug Bilgileri <span className="vulnerability-tag">Security Misconfiguration</span></h3>
        <button onClick={fetchDebugInfo} className="btn btn-primary">
          Debug Bilgilerini Göster
        </button>
        
        {debugInfo && (
          <pre style={{
            marginTop: '15px',
            background: '#f5f5f5',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '400px'
          }}>
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
