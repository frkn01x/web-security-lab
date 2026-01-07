import React, { useState } from 'react';
import axios from 'axios';

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [displayTerm, setDisplayTerm] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    
    try {
      // VULNERABILITY: XSS - Search term is not sanitized
      const response = await axios.get(`/api/search?q=${searchTerm}`);
      setResults(response.data.results);
      setDisplayTerm(response.data.searchTerm);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <div className="card">
      <h2>Ürün Ara <span className="vulnerability-tag">XSS</span></h2>
      <form onSubmit={handleSearch}>
        <div className="form-group">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Dene: <script>alert('XSS')</script>"
            style={{width: '80%', display: 'inline-block'}}
          />
          <button type="submit" className="btn btn-primary" style={{marginLeft: '10px'}}>
            Ara
          </button>
        </div>
      </form>

      {displayTerm && (
        <div style={{marginTop: '20px'}}>
          {/* VULNERABILITY: Rendering unsanitized HTML */}
          <p>Arama sonuçları: <span dangerouslySetInnerHTML={{__html: displayTerm}} /></p>
          
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Ürün Adı</th>
                <th>Açıklama</th>
                <th>Fiyat</th>
              </tr>
            </thead>
            <tbody>
              {results.map(product => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>${product.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Search;
