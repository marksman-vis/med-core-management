import http.server
import socketserver
import json
import os
import sys

PORT = 8080
DB_FILE = 'database.json'

# Initialize database if it doesn't exist
if not os.path.exists(DB_FILE):
    with open(DB_FILE, 'w') as f:
        json.dump({
            "patients": [], "doctors": [], "staff": [], "users": [], 
            "labResults": [], "prescriptions": [], "bills": [], 
            "appointments": [], "notes": [], 
            "counters": { "patient": 10, "doctor": 8, "staff": 8, "rx": 5, "lab": 8, "bill": 4 }
        }, f, indent=2)

class HMSHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        if self.path == '/api/data':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            with open(DB_FILE, 'r') as f:
                self.wfile.write(f.read().encode())
        else:
            # Serve static files but handle query params
            clean_path = self.path.split('?')[0]
            self.path = clean_path
            super().do_GET()

    def do_POST(self):
        if self.path == '/api/save':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                with open(DB_FILE, 'w') as f:
                    json.dump(data, f, indent=2)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True}).encode())
            except Exception as e:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(str(e).encode())

print(f"HMS Python Server running at http://localhost:{PORT}")
with socketserver.TCPServer(("", PORT), HMSHandler) as httpd:
    httpd.serve_forever()
