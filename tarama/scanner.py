#!/usr/bin/env python3
"""
Güvenlik Açığı Tarama Aracı
Vulnerable Web Application için otomatik güvenlik taraması yapar
"""

import requests
import json
import sys
from datetime import datetime
from colorama import Fore, Style, init
from report_generator import generate_html_report, generate_json_report

# Colorama başlat
init(autoreset=True)

class VulnerabilityScanner:
    def __init__(self, base_url):
        self.base_url = base_url
        self.session = requests.Session()
        self.vulnerabilities = []
        self.scan_results = []
        self.start_time = None
        self.end_time = None
        
    def print_header(self):
        print(f"{Fore.CYAN}{'='*60}")
        print(f"{Fore.CYAN}  Güvenlik Açığı Tarama Aracı")
        print(f"{Fore.CYAN}  Hedef: {self.base_url}")
        print(f"{Fore.CYAN}{'='*60}\n")
    
    def print_result(self, test_name, vulnerable, details="", severity="HIGH", recommendation=""):
        result = {
            "name": test_name,
            "vulnerable": vulnerable,
            "details": details,
            "severity": severity,
            "recommendation": recommendation
        }
        self.scan_results.append(result)
        
        if vulnerable:
            print(f"{Fore.RED}[✗] {test_name}: AÇIK BULUNDU!")
            if details:
                print(f"{Fore.YELLOW}    → {details}")
            self.vulnerabilities.append(test_name)
        else:
            print(f"{Fore.GREEN}[✓] {test_name}: Güvenli")
    
    def test_sql_injection(self):
        """SQL Injection testi"""
        print(f"\n{Fore.BLUE}[1] SQL Injection Testi...")
        
        payloads = [
            ("admin' OR '1'='1", "anything"),
            ("admin' --", ""),
            ("' OR 1=1 --", "")
        ]
        
        for username, password in payloads:
            try:
                response = self.session.post(
                    f"{self.base_url}/api/login",
                    json={"username": username, "password": password}
                )
                
                if response.status_code == 200 and "success" in response.json():
                    self.print_result(
                        "SQL Injection",
                        True,
                        f"Payload: {username}",
                        "CRITICAL",
                        "Prepared statements kullanın. Kullanıcı girdilerini asla direkt SQL sorgusuna eklemeyin."
                    )
                    return
            except Exception as e:
                pass
        
        self.print_result("SQL Injection", False, "", "INFO", "")
    
    def test_xss(self):
        """XSS testi"""
        print(f"\n{Fore.BLUE}[2] Cross-Site Scripting (XSS) Testi...")
        
        payloads = [
            "<script>alert('XSS')</script>",
            "<img src=x onerror=alert('XSS')>",
            "<svg onload=alert('XSS')>"
        ]
        
        for payload in payloads:
            try:
                response = self.session.get(
                    f"{self.base_url}/api/search",
                    params={"q": payload}
                )
                
                if payload in response.text:
                    self.print_result(
                        "Cross-Site Scripting (XSS)",
                        True,
                        f"Payload yansıtıldı: {payload[:30]}...",
                        "HIGH",
                        "Tüm kullanıcı girdilerini sanitize edin ve output encoding kullanın. Content-Security-Policy header'ı ekleyin."
                    )
                    return
            except Exception as e:
                pass
        
        self.print_result("Cross-Site Scripting (XSS)", False, "", "INFO", "")
    
    def test_csrf(self):
        """CSRF testi"""
        print(f"\n{Fore.BLUE}[3] CSRF (Cross-Site Request Forgery) Testi...")
        
        # Önce login ol
        self.session.post(
            f"{self.base_url}/api/login",
            json={"username": "user1", "password": "password123"}
        )
        
        try:
            # Transfer isteği gönder
            response = self.session.post(
                f"{self.base_url}/api/transfer",
                json={"to": 2, "amount": 100}
            )
            
            # CSRF token kontrolü yap
            if response.status_code == 200:
                self.print_result(
                    "CSRF Protection",
                    True,
                    "Transfer işlemi CSRF token olmadan başarılı",
                    "HIGH",
                    "CSRF token'ları kullanın. SameSite cookie attribute'u ekleyin."
                )
            else:
                self.print_result("CSRF Protection", False, "", "INFO", "")
        except Exception as e:
            self.print_result("CSRF Protection", False, "", "INFO", "")
    
    def test_broken_access_control(self):
        """Broken Access Control testi"""
        print(f"\n{Fore.BLUE}[4] Broken Access Control Testi...")
        
        # Normal kullanıcı olarak login
        self.session.post(
            f"{self.base_url}/api/login",
            json={"username": "user1", "password": "password123"}
        )
        
        try:
            # Başka kullanıcının verilerine eriş
            response = self.session.get(f"{self.base_url}/api/users/1")
            
            if response.status_code == 200:
                data = response.json()
                if data and 'username' in data:
                    self.print_result(
                        "Broken Access Control",
                        True,
                        f"Başka kullanıcının verilerine erişildi: {data['username']}",
                        "HIGH",
                        "Her endpoint'te authorization kontrolü yapın. Kullanıcı sadece kendi verilerine erişebilmeli."
                    )
                    return
        except Exception as e:
            pass
        
        self.print_result("Broken Access Control", False, "", "INFO", "")
    
    def test_weak_authentication(self):
        """Zayıf Authentication testi"""
        print(f"\n{Fore.BLUE}[5] Weak Authentication Testi...")
        
        try:
            # Zayıf şifre ile kayıt dene
            response = self.session.post(
                f"{self.base_url}/api/register",
                json={
                    "username": "testuser123",
                    "password": "123",
                    "email": "test@test.com"
                }
            )
            
            if response.status_code == 200:
                self.print_result(
                    "Weak Password Policy",
                    True,
                    "Zayıf şifre ('123') kabul edildi",
                    "MEDIUM",
                    "Güçlü şifre politikası uygulayın: minimum 8 karakter, büyük/küçük harf, rakam ve özel karakter."
                )
            else:
                self.print_result("Weak Password Policy", False, "", "INFO", "")
        except Exception as e:
            self.print_result("Weak Password Policy", False, "", "INFO", "")
    
    def test_sensitive_data_exposure(self):
        """Sensitive Data Exposure testi"""
        print(f"\n{Fore.BLUE}[6] Sensitive Data Exposure Testi...")
        
        # Login ol
        self.session.post(
            f"{self.base_url}/api/login",
            json={"username": "user1", "password": "password123"}
        )
        
        try:
            response = self.session.get(f"{self.base_url}/api/profile")
            
            if response.status_code == 200:
                data = response.json()
                if 'password' in data:
                    self.print_result(
                        "Sensitive Data Exposure",
                        True,
                        f"Şifre plaintext olarak döndürüldü: {data['password']}",
                        "CRITICAL",
                        "Şifreleri hash'leyin (bcrypt, argon2). API response'larında hassas verileri döndürmeyin."
                    )
                    return
        except Exception as e:
            pass
        
        self.print_result("Sensitive Data Exposure", False, "", "INFO", "")
    
    def test_idor(self):
        """IDOR (Insecure Direct Object Reference) testi"""
        print(f"\n{Fore.BLUE}[7] IDOR Testi...")
        
        # Login ol
        self.session.post(
            f"{self.base_url}/api/login",
            json={"username": "user1", "password": "password123"}
        )
        
        try:
            # Başka kullanıcının siparişine eriş
            response = self.session.get(f"{self.base_url}/api/orders/1")
            
            if response.status_code == 200:
                data = response.json()
                if data and 'id' in data:
                    self.print_result(
                        "IDOR (Insecure Direct Object Reference)",
                        True,
                        f"Başka kullanıcının siparişine erişildi: Order #{data['id']}",
                        "HIGH",
                        "Object reference'larda authorization kontrolü yapın. UUID kullanmayı düşünün."
                    )
                    return
        except Exception as e:
            pass
        
        self.print_result("IDOR", False, "", "INFO", "")
    
    def test_security_misconfiguration(self):
        """Security Misconfiguration testi"""
        print(f"\n{Fore.BLUE}[8] Security Misconfiguration Testi...")
        
        try:
            response = self.session.get(f"{self.base_url}/api/debug")
            
            if response.status_code == 200:
                data = response.json()
                if 'env' in data or 'session' in data:
                    self.print_result(
                        "Security Misconfiguration",
                        True,
                        "Debug endpoint açık - hassas bilgiler ifşa ediliyor",
                        "MEDIUM",
                        "Production'da debug endpoint'leri kapatın. Environment variable'ları ifşa etmeyin."
                    )
                    return
        except Exception as e:
            pass
        
        self.print_result("Security Misconfiguration", False, "", "INFO", "")
    
    def test_directory_traversal(self):
        """Directory Traversal testi"""
        print(f"\n{Fore.BLUE}[9] Directory Traversal Testi...")
        
        payloads = [
            "../../../package.json",
            "..\\..\\..\\package.json",
            "....//....//....//package.json"
        ]
        
        for payload in payloads:
            try:
                response = self.session.get(
                    f"{self.base_url}/api/file",
                    params={"name": payload}
                )
                
                if response.status_code == 200 and "name" in response.text:
                    self.print_result(
                        "Directory Traversal",
                        True,
                        f"Payload başarılı: {payload}",
                        "HIGH",
                        "Dosya yollarını sanitize edin. Whitelist kullanın. Path.resolve() ile normalize edin."
                    )
                    return
            except Exception as e:
                pass
        
        self.print_result("Directory Traversal", False, "", "INFO", "")
    
    def test_clickjacking(self):
        """Clickjacking testi"""
        print(f"\n{Fore.BLUE}[10] Clickjacking Testi...")
        
        try:
            response = self.session.get(self.base_url)
            headers = response.headers
            
            if 'X-Frame-Options' not in headers and 'Content-Security-Policy' not in headers:
                self.print_result(
                    "Clickjacking Protection",
                    True,
                    "X-Frame-Options ve CSP header'ları eksik",
                    "MEDIUM",
                    "X-Frame-Options: DENY veya SAMEORIGIN header'ı ekleyin. CSP frame-ancestors direktifi kullanın."
                )
            else:
                self.print_result("Clickjacking Protection", False, "", "INFO", "")
        except Exception as e:
            self.print_result("Clickjacking Protection", False, "", "INFO", "")
    
    def test_api_security(self):
        """API Security testi"""
        print(f"\n{Fore.BLUE}[11] API Security Testi...")
        
        # Admin login
        self.session.post(
            f"{self.base_url}/api/login",
            json={"username": "admin", "password": "admin123"}
        )
        
        try:
            # Rate limiting testi - 10 istek gönder
            success_count = 0
            for i in range(10):
                response = self.session.get(f"{self.base_url}/api/admin/users")
                if response.status_code == 200:
                    success_count += 1
            
            if success_count == 10:
                self.print_result(
                    "API Rate Limiting",
                    True,
                    "Rate limiting yok - 10/10 istek başarılı",
                    "MEDIUM",
                    "Rate limiting uygulayın (express-rate-limit). API key kullanın. Throttling ekleyin."
                )
            else:
                self.print_result("API Rate Limiting", False, "", "INFO", "")
        except Exception as e:
            self.print_result("API Rate Limiting", False, "", "INFO", "")
    
    def test_file_upload(self):
        """File Upload Vulnerability testi"""
        print(f"\n{Fore.BLUE}[12] File Upload Vulnerability Testi...")
        
        # Login ol
        self.session.post(
            f"{self.base_url}/api/login",
            json={"username": "user1", "password": "password123"}
        )
        
        try:
            # Tehlikeli dosya yüklemeyi dene
            files = {
                'file': ('test.php', '<?php echo "test"; ?>', 'application/x-php')
            }
            response = self.session.post(
                f"{self.base_url}/api/upload",
                files=files
            )
            
            if response.status_code == 200:
                self.print_result(
                    "File Upload Vulnerability",
                    True,
                    "PHP dosyası yüklendi - dosya tipi validasyonu yok",
                    "HIGH",
                    "Dosya tipi whitelist kullanın. Magic number kontrolü yapın. Dosyaları web root dışında saklayın."
                )
            else:
                self.print_result("File Upload Vulnerability", False, "", "INFO", "")
        except Exception as e:
            self.print_result("File Upload Vulnerability", False, "", "INFO", "")
    
    def run_all_tests(self):
        """Tüm testleri çalıştır"""
        self.start_time = datetime.now()
        self.print_header()
        
        self.test_sql_injection()
        self.test_xss()
        self.test_csrf()
        self.test_broken_access_control()
        self.test_weak_authentication()
        self.test_sensitive_data_exposure()
        self.test_idor()
        self.test_security_misconfiguration()
        self.test_directory_traversal()
        self.test_clickjacking()
        self.test_api_security()
        self.test_file_upload()
        
        self.end_time = datetime.now()
        self.print_summary()
        self.generate_html_report()
        self.generate_json_report()
    
    def print_summary(self):
        """Özet rapor"""
        print(f"\n{Fore.CYAN}{'='*60}")
        print(f"{Fore.CYAN}  TARAMA SONUÇLARI")
        print(f"{Fore.CYAN}{'='*60}")
        print(f"\n{Fore.RED}Bulunan Açıklar: {len(self.vulnerabilities)}/12")
        
        if self.vulnerabilities:
            print(f"\n{Fore.YELLOW}Açık Listesi:")
            for i, vuln in enumerate(self.vulnerabilities, 1):
                print(f"{Fore.YELLOW}  {i}. {vuln}")
        else:
            print(f"\n{Fore.GREEN}Hiç açık bulunamadı!")
        
        print(f"\n{Fore.CYAN}{'='*60}\n")
    
    def generate_html_report(self):
        """HTML rapor oluştur"""
        filename = generate_html_report(self)
        print(f"{Fore.GREEN}✓ HTML rapor oluşturuldu: {filename}")
    
    def generate_json_report(self):
        """JSON rapor oluştur"""
        filename = generate_json_report(self)
        print(f"{Fore.GREEN}✓ JSON rapor oluşturuldu: {filename}")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        target_url = sys.argv[1]
    else:
        target_url = "http://localhost:3002"
    
    scanner = VulnerabilityScanner(target_url)
    scanner.run_all_tests()
