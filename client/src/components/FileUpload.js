import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [uploadedFile, setUploadedFile] = useState('');
  const [filename, setFilename] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setMessage('Lütfen bir dosya seçin');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      // VULNERABILITY: No file type validation on client
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage('Dosya başarıyla yüklendi!');
      setUploadedFile(response.data.path);
    } catch (error) {
      setMessage('Yükleme başarısız: ' + error.message);
    }
  };

  const handleFileAccess = async () => {
    try {
      // VULNERABILITY: Directory Traversal
      const response = await axios.get(`/api/file?name=${filename}`);
      setMessage('Dosya erişimi başarılı!');
    } catch (error) {
      setMessage('Dosya bulunamadı');
    }
  };

  return (
    <div className="card">
      <h2>Dosya Yükleme <span className="vulnerability-tag">File Upload + Directory Traversal</span></h2>
      
      <form onSubmit={handleUpload}>
        <div className="form-group">
          <label>Dosya Seç:</label>
          <input type="file" onChange={handleFileChange} />
          <small style={{color: '#666', display: 'block', marginTop: '5px'}}>
            Herhangi bir dosya türü kabul edilir - .php, .exe, .sh bile!
          </small>
        </div>
        <button type="submit" className="btn btn-primary">Yükle</button>
      </form>

      {message && <div className="success" style={{marginTop: '15px'}}>{message}</div>}
      {uploadedFile && (
        <div style={{marginTop: '15px'}}>
          <p>Yüklenen dosya: <a href={`http://localhost:3001${uploadedFile}`} target="_blank" rel="noopener noreferrer">{uploadedFile}</a></p>
        </div>
      )}

      <div style={{marginTop: '30px', padding: '15px', background: '#fff3cd', borderRadius: '4px'}}>
        <h3>Directory Traversal Test <span className="vulnerability-tag">Path Traversal</span></h3>
        <p>Dosya adı gir (örnek: ../../../package.json):</p>
        <div className="form-group">
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="../../../package.json"
          />
          <button onClick={handleFileAccess} className="btn btn-primary" style={{marginLeft: '10px'}}>
            Dosyaya Eriş
          </button>
        </div>
      </div>
    </div>
  );
}

export default FileUpload;
