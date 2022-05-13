import http from 'http';

const PORT = 5000;

const server = http.createServer();
server.on('request', async (req, res) => {
  const isPreflightRequest = req.method === 'OPTIONS';
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (isPreflightRequest) {
    res.end();
    return;
  }
  res.setHeader('Content-type', 'application/json');
  res.write(
    JSON.stringify({
      data: {
        foo: 'bar',
      },
    }),
  );
  res.end();
});
server.listen(PORT);
