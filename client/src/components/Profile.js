import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile({ user }) {
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(user?.id || '');

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/profile');
      setUserData(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const fetchOtherUser = async () => {
    try {
      // VULNERABILITY: Broken Access Control - Can view any user's data
      const response = await axios.get(`/api/users/${userId}`);
      setUserData(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  return (
    <div className="card">
      <h2>Profil <span className="vulnerability-tag">Sensitive Data Exposure</span></h2>
      
      {userData && (
        <div className="user-info">
          <p><strong>ID:</strong> {userData.id}</p>
          <p><strong>Kullanıcı Adı:</strong> {userData.username}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Rol:</strong> {userData.role}</p>
          {/* VULNERABILITY: Password exposed in response */}
          <p><strong>Şifre (Plaintext!):</strong> {userData.password}</p>
          <p><strong>Kayıt Tarihi:</strong> {userData.created_at}</p>
        </div>
      )}

      <div style={{marginTop: '20px', padding: '15px', background: '#fff3cd', borderRadius: '4px'}}>
        <h3>Başka Kullanıcı Verilerini Görüntüle <span className="vulnerability-tag">Broken Access Control</span></h3>
        <p>Herhangi bir kullanıcı ID'si gir:</p>
        <div className="form-group">
          <input
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="User ID (1, 2, 3, 4...)"
          />
          <button onClick={fetchOtherUser} className="btn btn-primary" style={{marginLeft: '10px'}}>
            Görüntüle
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
