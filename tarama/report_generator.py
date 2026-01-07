"""
HTML ve JSON rapor oluşturma modülü
"""

from datetime import datetime
import json

def generate_html_report(scanner):
    """HTML rapor oluştur"""
    
    duration = (scanner.end_time - scanner.start_time).total_seconds()
    
    html = f"""
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Güvenlik Tarama Raporu</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f5f5;
            padding: 20px;
        }}
        
        .container {{
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}
        
        .header {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
        }}
        
        .header h1 {{
            font-size: 32px;
            margin-bottom: 10px;
        }}
        
        .header p {{
            opacity: 0.9;
            font-size: 16px;
        }}
        
        .summary {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px;
            background: #f8f9fa;
        }}
        
        .summary-card {{
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            text-align: center;
        }}
        
        .summary-card h3 {{
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
            text-transform: uppercase;
        }}
        
        .summary-card .value {{
            font-size: 36px;
            font-weight: bold;
            color: #333;
        }}
        
        .summary-card.critical .value {{
            color: #dc3545;
        }}
        
        .summary-card.high .value {{
            color: #fd7e14;
        }}
        
        .summary-card.safe .value {{
            color: #28a745;
        }}
        
        .results {{
            padding: 30px;
        }}
        
        .results h2 {{
            font-size: 24px;
            margin-bottom: 20px;
            color: #333;
        }}
        
        .vulnerability {{
            background: white;
            border-left: 4px solid #ddd;
            padding: 20px;
            margin-bottom: 15px;
            border-radius: 4px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }}
        
        .vulnerability.vulnerable {{
            border-left-color: #dc3545;
            background: #fff5f5;
        }}
        
        .vulnerability.safe {{
            border-left-color: #28a745;
            background: #f0f9f4;
        }}
        
        .vulnerability-header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }}
        
        .vulnerability-name {{
            font-size: 18px;
            font-weight: 600;
            color: #333;
        }}
        
        .severity {{
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }}
        
        .severity.critical {{
            background: #dc3545;
            color: white;
        }}
        
        .severity.high {{
            background: #fd7e14;
            color: white;
        }}
        
        .severity.medium {{
            background: #ffc107;
            color: #333;
        }}
        
        .severity.low {{
            background: #17a2b8;
            color: white;
        }}
        
        .severity.info {{
            background: #6c757d;
            color: white;
        }}
        
        .vulnerability-details {{
            color: #666;
            margin-bottom: 10px;
            font-size: 14px;
        }}
        
        .recommendation {{
            background: #e7f3ff;
            padding: 12px;
            border-radius: 4px;
            margin-top: 10px;
            font-size: 14px;
            color: #004085;
        }}
        
        .recommendation strong {{
            display: block;
            margin-bottom: 5px;
            color: #003366;
        }}
        
        .footer {{
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
        }}
        
        .status-icon {{
            font-size: 24px;
            margin-right: 10px;
        }}
        
        @media print {{
            body {{
                background: white;
            }}
            .container {{
                box-shadow: none;
            }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔒 Güvenlik Tarama Raporu</h1>
            <p>Hedef: {scanner.base_url}</p>
            <p>Tarih: {scanner.start_time.strftime('%d.%m.%Y %H:%M:%S')}</p>
            <p>Süre: {duration:.2f} saniye</p>
        </div>
        
        <div class="summary">
            <div class="summary-card">
                <h3>Toplam Test</h3>
                <div class="value">{len(scanner.scan_results)}</div>
            </div>
            <div class="summary-card critical">
                <h3>Bulunan Açık</h3>
                <div class="value">{len(scanner.vulnerabilities)}</div>
            </div>
            <div class="summary-card safe">
                <h3>Güvenli</h3>
                <div class="value">{len(scanner.scan_results) - len(scanner.vulnerabilities)}</div>
            </div>
            <div class="summary-card high">
                <h3>Risk Skoru</h3>
                <div class="value">{int((len(scanner.vulnerabilities) / len(scanner.scan_results)) * 100)}%</div>
            </div>
        </div>
        
        <div class="results">
            <h2>📋 Detaylı Sonuçlar</h2>
"""
    
    for result in scanner.scan_results:
        status_class = "vulnerable" if result['vulnerable'] else "safe"
        status_icon = "❌" if result['vulnerable'] else "✅"
        severity_class = result['severity'].lower()
        
        html += f"""
            <div class="vulnerability {status_class}">
                <div class="vulnerability-header">
                    <div class="vulnerability-name">
                        <span class="status-icon">{status_icon}</span>
                        {result['name']}
                    </div>
                    <span class="severity {severity_class}">{result['severity']}</span>
                </div>
"""
        
        if result['details']:
            html += f"""
                <div class="vulnerability-details">
                    <strong>Detay:</strong> {result['details']}
                </div>
"""
        
        if result['recommendation'] and result['vulnerable']:
            html += f"""
                <div class="recommendation">
                    <strong>💡 Öneri:</strong>
                    {result['recommendation']}
                </div>
"""
        
        html += """
            </div>
"""
    
    html += f"""
        </div>
        
        <div class="footer">
            <p>Bu rapor otomatik olarak oluşturulmuştur.</p>
            <p>Güvenlik Açığı Tarama Aracı v1.0 - {datetime.now().year}</p>
        </div>
    </div>
</body>
</html>
"""
    
    filename = f"tarama_raporu_{datetime.now().strftime('%Y%m%d_%H%M%S')}.html"
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(html)
    
    return filename


def generate_json_report(scanner):
    """JSON rapor oluştur"""
    
    duration = (scanner.end_time - scanner.start_time).total_seconds()
    
    report = {
        "scan_info": {
            "target": scanner.base_url,
            "start_time": scanner.start_time.isoformat(),
            "end_time": scanner.end_time.isoformat(),
            "duration_seconds": duration
        },
        "summary": {
            "total_tests": len(scanner.scan_results),
            "vulnerabilities_found": len(scanner.vulnerabilities),
            "safe_tests": len(scanner.scan_results) - len(scanner.vulnerabilities),
            "risk_score": int((len(scanner.vulnerabilities) / len(scanner.scan_results)) * 100)
        },
        "results": scanner.scan_results,
        "vulnerable_items": scanner.vulnerabilities
    }
    
    filename = f"tarama_raporu_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    
    return filename
