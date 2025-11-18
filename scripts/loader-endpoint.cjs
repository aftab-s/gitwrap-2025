const http = require('http');

const port = process.env.PORT || 4000;

const server = http.createServer((req, res) => {
  // Basic CORS preflight handling
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  if (req.url === '/api/loader-test') {
    // simulate processing delay
    const delay = Number(process.env.LOADER_DELAY_MS) || 2500;
    setTimeout(() => {
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(JSON.stringify({ ok: true, message: `Processed in ${delay}ms`, timestamp: Date.now() }));
    }, delay);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Loader endpoint listening on http://localhost:${port}`);
});

module.exports = server;
