# 🔒 Vulnerable Web Application - Eğitim Platformu



## 📖 İçindekiler

- [Güvenlik Açıkları](#içindeki-güvenlik-açıkları)
- [Kurulum](#kurulum)
- [Kullanım](#kullanım)
- [Güvenlik Tarama Aracı](#-güvenlik-tarama-aracı)
- [Proje Yapısı](#-proje-yapısı)
- [Eğitim Senaryoları](#-eğitim-senaryoları)
- [Sorun Giderme](#-sorun-giderme)
- [Kaynaklar](#-kaynaklar-ve-referanslar)

## 🎯 Proje Hakkında

Bu proje, web güvenliği öğrenmek isteyenler için **kasıtlı olarak güvenlik açıkları içeren** bir eğitim platformudur. 

**Özellikler:**
- ✅ 12 farklı OWASP Top 10 güvenlik açığı
- ✅ Otomatik güvenlik tarama aracı (Python)
- ✅ HTML ve JSON rapor çıktısı
- ✅ Docker ile kolay kurulum
- ✅ Detaylı dokümantasyon ve örnekler
- ✅ Gerçek dünya senaryoları

## İçindeki Güvenlik Açıkları

Bu uygulama aşağıdaki 12 güvenlik açığını içerir:

1. **SQL Injection (SQLi)** - Login ve search endpoint'lerinde
2. **Cross-Site Scripting (XSS)** - Search sonuçlarında unsanitized HTML
3. **Cross-Site Request Forgery (CSRF)** - Transfer ve delete işlemlerinde token yok
4. **Broken Access Control** - Kullanıcılar başkalarının verilerine erişebilir
5. **Authentication & Session Management Issues** - Zayıf session config, plaintext passwords
6. **File Upload Vulnerabilities** - Dosya tipi validasyonu yok
7. **Directory Traversal** - Path sanitization yok
8. **Security Misconfiguration** - Debug endpoint exposed, CORS misconfigured
9. **Insecure Direct Object Reference (IDOR)** - Order endpoint'inde authorization yok
10. **Sensitive Data Exposure** - Passwords plaintext, API sensitive data döndürüyor
11. **Clickjacking** - X-Frame-Options header yok
12. **API Security Vulnerabilities** - Rate limiting yok, weak authentication

## Kurulum

### Docker ile (Önerilen)

```bash
# Docker Compose ile tüm servisleri başlat
docker-compose up -d

# Veritabanı hazır olana kadar bekle (yaklaşık 30 saniye)
# Ardından tarayıcıda aç: http://localhost:3000
```

### Manuel Kurulum

```bash
# Backend bağımlılıklarını yükle
npm install

# .env dosyası oluştur
cp .env.example .env
# .env dosyasını düzenle ve veritabanı bilgilerini gir

# MySQL veritabanını oluştur
mysql -u root -p < database.sql

# Backend'i başlat
npm start

# Yeni bir terminal aç ve client'ı başlat
cd client
npm install
npm start
```

## Kullanım

### Test Kullanıcıları

- **Admin:** username: `admin`, password: `admin123`
- **User1:** username: `user1`, password: `password123`
- **User2:** username: `user2`, password: `pass456`

### Güvenlik Açıklarını Test Etme

#### 1. SQL Injection
Login sayfasında username: `admin' OR '1'='1` ve herhangi bir password ile giriş yap.

#### 2. XSS
Search sayfasında: `<script>alert('XSS')</script>` ara.

#### 3. CSRF
Transfer sayfasında form CSRF token içermiyor. Harici bir siteden otomatik transfer yapılabilir.

#### 4. Broken Access Control
Profile sayfasında farklı user ID'leri dene (1, 2, 3, 4...).

#### 5. Weak Authentication
Register sayfasında "123" gibi zayıf bir şifre ile kayıt ol.

#### 6. File Upload
Upload sayfasında .php, .exe gibi tehlikeli dosyalar yükle.

#### 7. Directory Traversal
File access kısmında: `../../../package.json` dene.

#### 8. Security Misconfiguration
Admin panelinde "Debug Bilgilerini Göster" butonuna tıkla.

#### 9. IDOR
Orders sayfasında farklı order ID'leri dene.

#### 10. Sensitive Data Exposure
Profile sayfasında şifrelerin plaintext olarak göründüğünü gör.

#### 11. Clickjacking
Clickjacking Demo sayfasında iframe içinde yüklenen uygulamayı gör.

#### 12. API Security
Admin panelinde rate limiting olmadan sürekli istek at.

## Teknolojiler

- **Backend:** Node.js, Express
- **Frontend:** React
- **Database:** MySQL
- **Containerization:** Docker, Docker Compose
- **Security Scanner:** Python (requests, colorama)

## ⚙️ Yapılandırma

### Ortam Değişkenleri

Projeyi çalıştırmadan önce `.env` dosyası oluştur:

```bash
cp .env.example .env
```

`.env` dosyasını düzenle ve kendi bilgilerini gir:

```env
DB_HOST=mysql
DB_USER=root
DB_PASSWORD=your_secure_password_here
DB_NAME=vulnerable_db
PORT=3001
```

**⚠️ Önemli:** `.env` dosyası Git'e commit edilmez. Hassas bilgilerinizi güvende tutar.

### Port Ayarları

Varsayılan portlar:
- **Frontend:** http://localhost:3003
- **Backend API:** http://localhost:3002
- **MySQL:** localhost:3307

Port çakışması varsa `docker-compose.yml` dosyasını düzenle.

## 🔍 Güvenlik Tarama Aracı

Bu proje, güvenlik açıklarını otomatik olarak tespit eden bir **Python tarama aracı** içerir.

### Tarayıcı Özellikleri

✅ **12 farklı güvenlik açığı testi**  
✅ **Otomatik tarama** - Tek komutla tüm testler  
✅ **Renkli konsol çıktısı** - Kolay takip  
✅ **HTML rapor** - Profesyonel, tarayıcıda görüntülenebilir  
✅ **JSON rapor** - CI/CD entegrasyonu için  
✅ **Severity seviyeleri** - CRITICAL, HIGH, MEDIUM, LOW  
✅ **Çözüm önerileri** - Her açık için detaylı düzeltme önerileri  

### Hızlı Başlangıç

```bash
# Tarama klasörüne git
cd tarama

# Bağımlılıkları yükle
pip install -r requirements.txt

# Taramayı başlat
python scanner.py http://localhost:3002
```

### Tarama Sonuçları

Tarama tamamlandığında 2 rapor oluşturulur:

1. **HTML Rapor** - `tarama_raporu_YYYYMMDD_HHMMSS.html`
   - Tarayıcıda çift tıklayarak aç
   - Özet dashboard ve detaylı sonuçlar
   - Renkli severity göstergeleri
   - Her açık için çözüm önerileri

2. **JSON Rapor** - `tarama_raporu_YYYYMMDD_HHMMSS.json`
   - Programatik kullanım
   - CI/CD pipeline entegrasyonu
   - Otomatik analiz

### Örnek Tarama Çıktısı

```bash
============================================================
  Güvenlik Açığı Tarama Aracı
  Hedef: http://localhost:3002
============================================================

[1] SQL Injection Testi...
[✗] SQL Injection: AÇIK BULUNDU!
    → Payload: admin' OR '1'='1

[2] Cross-Site Scripting (XSS) Testi...
[✓] Cross-Site Scripting (XSS): Güvenli

...

============================================================
  TARAMA SONUÇLARI
============================================================

Bulunan Açıklar: 9/12

✓ HTML rapor oluşturuldu: tarama_raporu_20260107_143519.html
✓ JSON rapor oluşturuldu: tarama_raporu_20260107_143519.json
```

### Tarama Yapılan Açıklar

| # | Açık | Severity | Test Edilen |
|---|------|----------|-------------|
| 1 | SQL Injection | 🔴 CRITICAL | ✅ |
| 2 | Cross-Site Scripting (XSS) | 🟠 HIGH | ✅ |
| 3 | CSRF | 🟠 HIGH | ✅ |
| 4 | Broken Access Control | 🟠 HIGH | ✅ |
| 5 | Weak Authentication | 🟡 MEDIUM | ✅ |
| 6 | Sensitive Data Exposure | 🔴 CRITICAL | ✅ |
| 7 | IDOR | 🟠 HIGH | ✅ |
| 8 | Security Misconfiguration | 🟡 MEDIUM | ✅ |
| 9 | Directory Traversal | 🟠 HIGH | ✅ |
| 10 | Clickjacking | 🟡 MEDIUM | ✅ |
| 11 | API Security | 🟡 MEDIUM | ✅ |
| 12 | File Upload Vulnerability | 🟠 HIGH | ✅ |

Detaylı kullanım için: [tarama/README.md](tarama/README.md)

## 📁 Proje Yapısı

```
vulnerable-web-app/
├── 📂 client/                    # React Frontend
│   ├── src/
│   │   ├── App.js
│   │   ├── components/          # React bileşenleri
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   └── Dockerfile
│
├── 📂 tarama/                    # Güvenlik Tarama Aracı
│   ├── scanner.py               # Ana tarama scripti
│   ├── report_generator.py      # Rapor oluşturma
│   ├── requirements.txt         # Python bağımlılıkları
│   ├── README.md               # Tarayıcı dokümantasyonu
│   ├── *.html                  # Oluşturulan HTML raporlar
│   └── *.json                  # Oluşturulan JSON raporlar
│
├── 📂 uploads/                   # Yüklenen dosyalar
├── server.js                    # Node.js Backend
├── database.sql                 # MySQL veritabanı
├── package.json                 # Backend bağımlılıkları
├── docker-compose.yml           # Docker yapılandırması
├── Dockerfile                   # Backend Docker image
└── README.md                    # Bu dosya
```

## 🚀 Hızlı Başlangıç Rehberi

### 1. Uygulamayı Başlat

```bash
# Docker ile (önerilen)
docker-compose up -d

# Veya manuel
npm install
mysql -u root -p < database.sql
npm start
```

### 2. Uygulamayı Test Et

Tarayıcıda aç: **http://localhost:3003**

Test kullanıcıları:
- Admin: `admin` / `admin123`
- User1: `user1` / `password123`

### 3. Güvenlik Taraması Yap

```bash
cd tarama
pip install -r requirements.txt
python scanner.py http://localhost:3002
```

### 4. Raporları İncele

```bash
# HTML raporunu aç
start tarama_raporu_*.html

# JSON raporunu oku
cat tarama_raporu_*.json
```

## 🎓 Eğitim Senaryoları

### Senaryo 1: SQL Injection Saldırısı
1. Login sayfasına git
2. Username: `admin' OR '1'='1`
3. Password: herhangi bir şey
4. Giriş başarılı! ✅

**Neden çalıştı?** SQL sorgusu: `SELECT * FROM users WHERE username = 'admin' OR '1'='1' AND password = '...'`

### Senaryo 2: XSS Saldırısı
1. Search sayfasına git
2. Ara: `<script>alert('XSS')</script>`
3. JavaScript çalıştı! ✅

**Neden çalıştı?** Input sanitize edilmedi, direkt HTML'e eklendi.

### Senaryo 3: CSRF Saldırısı
1. Transfer sayfasını aç
2. CSRF token yok
3. Harici siteden form gönder
4. Transfer başarılı! ✅

**Neden çalıştı?** CSRF token kontrolü yok.

### Senaryo 4: Otomatik Tarama
```bash
python tarama/scanner.py http://localhost:3002
```
Tüm açıkları otomatik tespit et! 🔍

Bu uygulama eğitim amaçlıdır. Gerçek uygulamalarda:

- Prepared statements kullan (SQL Injection'a karşı)
- Input sanitization ve output encoding yap (XSS'e karşı)
- CSRF token'ları kullan
- Proper authorization checks yap
- Güçlü şifre politikaları uygula
- Şifreleri hash'le (bcrypt, argon2)
- File upload validasyonu yap
- Path sanitization yap
- Debug endpoint'leri production'da kapat
- Security header'ları ekle (X-Frame-Options, CSP, etc.)
- Rate limiting uygula
- HTTPS kullan

