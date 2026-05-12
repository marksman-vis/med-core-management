const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const DB_FILE = path.join(__dirname, 'database.json');

// Initialize database if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({
        patients: [], doctors: [], staff: [], users: [], 
        labResults: [], prescriptions: [], bills: [], 
        appointments: [], notes: [], counters: { patient: 10, doctor: 8, staff: 8, rx: 5, lab: 8, bill: 4 }
    }, null, 2));
}

const server = http.createServer((req, res) => {
    // CORS Headers to allow login from different links
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // API Route to Load Data
    if (req.url === '/api/data' && req.method === 'GET') {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
        return;
    }

    // API Route to Save Data
    if (req.url === '/api/save' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (e) {
                res.writeHead(400);
                res.end('Invalid JSON');
            }
        });
        return;
    }

    // Serve Static Files (HTML, CSS, JS)
    let filePath = '.' + req.url;
    if (filePath === './') filePath = './index.html';
    // Remove query params like ?v=5
    filePath = filePath.split('?')[0];

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code == 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`HMS Server running at http://localhost:${PORT}`);
});
