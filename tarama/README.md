# 🔒 Güvenlik Açığı Tarama Aracı

Vulnerable Web Application için otomatik güvenlik taraması yapar ve detaylı raporlar oluşturur.

## 🎯 Özellikler

✅ **12 farklı güvenlik açığı testi**  
✅ **Renkli konsol çıktısı** - Kolay takip için  
✅ **HTML rapor** - Tarayıcıda görüntülenebilir, profesyonel  
✅ **JSON rapor** - Programatik kullanım ve CI/CD entegrasyonu  
✅ **Severity seviyeleri** - CRITICAL, HIGH, MEDIUM, LOW, INFO  
✅ **Çözüm önerileri** - Her açık için detaylı düzeltme önerileri  
✅ **Otomatik test** - Tek komutla tüm testler  
✅ **Zaman damgası** - Her tarama için benzersiz rapor  

## 📋 Gereksinimler

- Python 3.7+
- pip (Python paket yöneticisi)
- İnternet bağlantısı (hedef uygulamaya erişim için)

## 🚀 Kurulum

### 1. Bağımlılıkları Yükle

```bash
cd tarama
pip install -r requirements.txt
```

### 2. Hedef Uygulamayı Başlat

Önce vulnerable web uygulamasının çalıştığından emin ol:

```bash
# Ana dizinde
docker-compose up -d

# Veya .env dosyası oluştur
cp .env.example .env
# .env dosyasını düzenle ve şifreni ayarla
```

## 💻 Kullanım

### Temel Kullanım

```bash
# Varsayılan hedef (http://localhost:3002)
python scanner.py

# Özel hedef belirt
python scanner.py http://localhost:3002

# Farklı bir sunucu
python scanner.py http://192.168.1.100:3002
```

### Komut Satırı Parametreleri

```bash
python scanner.py [HEDEF_URL]
```

- `HEDEF_URL` (opsiyonel): Taranacak hedef URL. Varsayılan: `http://localhost:3002`

## 📊 Çıktılar

Tarama tamamlandığında otomatik olarak **2 farklı formatta rapor** oluşturulur:

### 1. HTML Rapor 📄
**Dosya Adı:** `tarama_raporu_YYYYMMDD_HHMMSS.html`

**Özellikler:**
- ✨ Profesyonel ve modern tasarım
- 📊 Özet dashboard (toplam test, bulunan açık, risk skoru)
- 🎨 Renkli severity göstergeleri
- 💡 Her açık için detaylı çözüm önerileri
- 📱 Responsive tasarım (mobil uyumlu)
- 🖨️ Print-friendly (yazdırma için optimize)
- 🌐 Tarayıcıda çift tıklayarak açılabilir

**Kullanım:**
```bash
# Windows
start tarama_raporu_20260107_143519.html

# Linux/Mac
open tarama_raporu_20260107_143519.html
```

### 2. JSON Rapor 📋
**Dosya Adı:** `tarama_raporu_YYYYMMDD_HHMMSS.json`

**Özellikler:**
- 🤖 Programatik kullanım için ideal
- 🔄 CI/CD pipeline entegrasyonu
- 📈 Otomatik analiz ve raporlama
- 💾 Veritabanına kaydetme
- 📊 Trend analizi için uygun

**JSON Yapısı:**
```json
{
  "scan_info": {
    "target": "http://localhost:3002",
    "start_time": "2026-01-07T14:35:19",
    "end_time": "2026-01-07T14:35:25",
    "duration_seconds": 6.23
  },
  "summary": {
    "total_tests": 12,
    "vulnerabilities_found": 9,
    "safe_tests": 3,
    "risk_score": 75
  },
  "results": [...],
  "vulnerable_items": [...]
}
```

## 🔍 Tarama Yapılan Güvenlik Açıkları

| # | Açık | Severity | OWASP Top 10 | Açıklama |
|---|------|----------|--------------|----------|
| 1 | **SQL Injection** | 🔴 CRITICAL | A03:2021 | Veritabanı sorgularına zararlı SQL kodu enjekte etme |
| 2 | **Cross-Site Scripting (XSS)** | 🟠 HIGH | A03:2021 | Zararlı JavaScript kodu çalıştırma |
| 3 | **CSRF** | 🟠 HIGH | A01:2021 | Kullanıcı adına istenmeyen işlem yaptırma |
| 4 | **Broken Access Control** | 🟠 HIGH | A01:2021 | Yetkisiz veri erişimi |
| 5 | **Weak Authentication** | 🟡 MEDIUM | A07:2021 | Zayıf şifre politikası |
| 6 | **Sensitive Data Exposure** | 🔴 CRITICAL | A02:2021 | Hassas verilerin açıkta kalması |
| 7 | **IDOR** | 🟠 HIGH | A01:2021 | Direkt nesne referansı güvenlik açığı |
| 8 | **Security Misconfiguration** | 🟡 MEDIUM | A05:2021 | Yanlış güvenlik yapılandırması |
| 9 | **Directory Traversal** | 🟠 HIGH | A01:2021 | Dosya sistemi erişim kontrolü |
| 10 | **Clickjacking** | 🟡 MEDIUM | A04:2021 | Görünmez iframe ile tıklama hırsızlığı |
| 11 | **API Security** | 🟡 MEDIUM | A04:2021 | Rate limiting eksikliği |
| 12 | **File Upload Vulnerability** | 🟠 HIGH | A04:2021 | Zararlı dosya yükleme |

### Severity Seviyeleri

- 🔴 **CRITICAL**: Acil müdahale gerektirir, sistem güvenliği ciddi risk altında
- 🟠 **HIGH**: Yüksek öncelikli, kısa sürede düzeltilmeli
- 🟡 **MEDIUM**: Orta öncelikli, planlı düzeltme yapılmalı
- 🔵 **LOW**: Düşük öncelikli, zaman içinde düzeltilebilir
- ⚪ **INFO**: Bilgilendirme amaçlı, güvenlik açığı değil

## 📺 Örnek Çıktı

### Konsol Çıktısı

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

[3] CSRF (Cross-Site Request Forgery) Testi...
[✗] CSRF Protection: AÇIK BULUNDU!
    → Transfer işlemi CSRF token olmadan başarılı

[4] Broken Access Control Testi...
[✗] Broken Access Control: AÇIK BULUNDU!
    → Başka kullanıcının verilerine erişildi: admin

[5] Weak Authentication Testi...
[✗] Weak Password Policy: AÇIK BULUNDU!
    → Zayıf şifre ('123') kabul edildi

[6] Sensitive Data Exposure Testi...
[✗] Sensitive Data Exposure: AÇIK BULUNDU!
    → Şifre plaintext olarak döndürüldü: password123

[7] IDOR Testi...
[✗] IDOR (Insecure Direct Object Reference): AÇIK BULUNDU!
    → Başka kullanıcının siparişine erişildi: Order #1

[8] Security Misconfiguration Testi...
[✗] Security Misconfiguration: AÇIK BULUNDU!
    → Debug endpoint açık - hassas bilgiler ifşa ediliyor

[9] Directory Traversal Testi...
[✓] Directory Traversal: Güvenli

[10] Clickjacking Testi...
[✓] Clickjacking Protection: Güvenli

[11] API Security Testi...
[✗] API Rate Limiting: AÇIK BULUNDU!
    → Rate limiting yok - 10/10 istek başarılı

[12] File Upload Vulnerability Testi...
[✗] File Upload Vulnerability: AÇIK BULUNDU!
    → PHP dosyası yüklendi - dosya tipi validasyonu yok

============================================================
  TARAMA SONUÇLARI
============================================================

Bulunan Açıklar: 9/12

Açık Listesi:
  1. SQL Injection
  2. CSRF Protection
  3. Broken Access Control
  4. Weak Password Policy
  5. Sensitive Data Exposure
  6. IDOR (Insecure Direct Object Reference)
  7. Security Misconfiguration
  8. API Rate Limiting
  9. File Upload Vulnerability

============================================================

✓ HTML rapor oluşturuldu: tarama_raporu_20260107_143519.html
✓ JSON rapor oluşturuldu: tarama_raporu_20260107_143519.json
```

### HTML Rapor Görünümü

HTML raporu tarayıcıda açtığınızda şunları göreceksiniz:

**📊 Özet Dashboard:**
- Toplam Test Sayısı
- Bulunan Açık Sayısı
- Güvenli Test Sayısı
- Risk Skoru (%)

**📋 Detaylı Sonuçlar:**
- Her test için durum (✅ Güvenli / ❌ Açık)
- Severity seviyesi (renkli etiket)
- Detaylı açıklama
- 💡 Çözüm önerileri (sadece açık bulunanlar için)

## 🛠️ Gelişmiş Kullanım

### CI/CD Entegrasyonu

JSON raporunu CI/CD pipeline'ınıza entegre edebilirsiniz:

```bash
# Tarama yap
python scanner.py http://staging.example.com

# JSON'dan risk skorunu al
RISK_SCORE=$(python -c "import json; print(json.load(open('tarama_raporu_*.json'))['summary']['risk_score'])")

# Eğer risk skoru %50'den yüksekse build'i fail et
if [ $RISK_SCORE -gt 50 ]; then
    echo "Risk skoru çok yüksek: $RISK_SCORE%"
    exit 1
fi
```

### Otomatik Tarama (Cron Job)

Düzenli tarama için cron job ekleyin:

```bash
# Her gün saat 02:00'de tarama yap
0 2 * * * cd /path/to/tarama && python scanner.py http://localhost:3002
```

## 🐛 Sorun Giderme

### Bağlantı Hatası

```
Error: Connection refused
```

**Çözüm:** Hedef uygulamanın çalıştığından emin olun:
```bash
curl http://localhost:3002/api/debug
```

### Import Hatası

```
ModuleNotFoundError: No module named 'requests'
```

**Çözüm:** Bağımlılıkları yükleyin:
```bash
pip install -r requirements.txt
```

### Rapor Oluşturulamıyor

```
PermissionError: [Errno 13] Permission denied
```

**Çözüm:** Yazma izniniz olduğundan emin olun:
```bash
chmod +w .
```

## 📁 Dosya Yapısı

```
tarama/
├── scanner.py              # Ana tarama scripti
├── report_generator.py     # Rapor oluşturma modülü
├── requirements.txt        # Python bağımlılıkları
├── README.md              # Bu dosya
├── tarama_raporu_*.html   # Oluşturulan HTML raporlar
└── tarama_raporu_*.json   # Oluşturulan JSON raporlar
```

## 🤝 Katkıda Bulunma

Bu proje eğitim amaçlıdır. Geliştirme önerileri:

1. Yeni güvenlik testleri ekleyin
2. Rapor formatlarını iyileştirin
3. Performans optimizasyonları yapın
4. Dokümantasyonu geliştirin

## 📚 Kaynaklar

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [CWE - Common Weakness Enumeration](https://cwe.mitre.org/)
- [CVSS - Common Vulnerability Scoring System](https://www.first.org/cvss/)

## ⚠️ Yasal Uyarı

**ÖNEMLİ:** Bu araç sadece eğitim ve test amaçlıdır.

- ✅ Kendi uygulamalarınızı test edebilirsiniz
- ✅ İzin aldığınız sistemleri tarayabilirsiniz
- ✅ Eğitim ortamlarında kullanabilirsiniz
- ❌ İzinsiz sistemleri taramayın
- ❌ Yasal olmayan amaçlarla kullanmayın
- ❌ Başkalarının sistemlerine zarar vermeyin

**Sorumluluk Reddi:** Bu aracın kötüye kullanımından kaynaklanan yasal sorumluluk kullanıcıya aittir.

## 📞 İletişim

Sorularınız için:
- GitHub Issues
- Pull Request
- Dokümantasyon

## 📄 Lisans

MIT License - Eğitim amaçlıdır

```
Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

**🎓 Eğitim Amaçlı Proje** | **🔒 Güvenlik Testi** | **📊 Otomatik Raporlama**
