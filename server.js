const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT      = 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_FILE  = path.join(__dirname, 'data', 'products.json');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

const server = http.createServer(function (req, res) {
  // --- API: GET /api/products ---
  if (req.url === '/api/products' || req.url.startsWith('/api/products?')) {
    fs.readFile(DATA_FILE, 'utf8', function (err, data) {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Could not read products.json' }));
        return;
      }
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(data);
    });
    return;
  }

  // --- Static files from /public ---
  var urlPath = req.url.split('?')[0]; // strip query string
  if (urlPath === '/') urlPath = '/index.html';

  var filePath = path.join(PUBLIC_DIR, urlPath);

  fs.readFile(filePath, function (err, data) {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    var ext  = path.extname(filePath);
    var mime = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
});

server.listen(PORT, function () {
  console.log('Server running at http://localhost:' + PORT);
});
