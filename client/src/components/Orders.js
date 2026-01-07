import React, { useState } from 'react';
import axios from 'axios';

function Orders() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  const fetchOrder = async () => {
    setError('');
    setOrder(null);

    try {
      // VULNERABILITY: IDOR - No authorization check
      const response = await axios.get(`/api/orders/${orderId}`);
      setOrder(response.data);
    } catch (err) {
      setError('Sipariş bulunamadı');
    }
  };

  return (
    <div className="card">
      <h2>Siparişler <span className="vulnerability-tag">IDOR</span></h2>
      
      <div className="form-group">
        <label>Sipariş ID:</label>
        <input
          type="number"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Herhangi bir sipariş ID'si (1, 2, 3, 4...)"
        />
        <button onClick={fetchOrder} className="btn btn-primary" style={{marginLeft: '10px'}}>
          Görüntüle
        </button>
      </div>

      {order && (
        <div style={{marginTop: '20px', padding: '15px', background: '#e9ecef', borderRadius: '4px'}}>
          <h3>Sipariş Detayları</h3>
          <p><strong>Sipariş ID:</strong> {order.id}</p>
          <p><strong>Kullanıcı ID:</strong> {order.user_id}</p>
          <p><strong>Ürün ID:</strong> {order.product_id}</p>
          <p><strong>Miktar:</strong> {order.quantity}</p>
          <p><strong>Toplam:</strong> ${order.total}</p>
          <p><strong>Tarih:</strong> {order.created_at}</p>
        </div>
      )}

      {error && <div className="error">{error}</div>}

      <div style={{marginTop: '20px', padding: '15px', background: '#ffebee', borderRadius: '4px'}}>
        <h3>IDOR Açıklaması</h3>
        <p>Bu endpoint, kullanıcının siparişe sahip olup olmadığını kontrol etmiyor.</p>
        <p>Herhangi bir kullanıcı, başka kullanıcıların siparişlerini görüntüleyebilir.</p>
        <p>Farklı ID'ler deneyin: 1, 2, 3, 4...</p>
      </div>
    </div>
  );
}

export default Orders;
