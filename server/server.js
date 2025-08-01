const express = require('express');
const cors = require('cors');
const app = express();

const PORT = 5000;
app.use(cors());
app.use(express.json());

let clients = [];

app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  clients.push(res);

  console.log(`Client connected (${clients.length} total)`);

  req.on('close', () => {
    clients = clients.filter(c => c !== res);
    console.log(`Client disconnected (${clients.length} total)`);
  });
});

app.post('/trigger-notification', (req, res) => {
  const message = req.body.message || "Triggered from backend!";

  clients.forEach(client => {
    client.write(`data: ${JSON.stringify({ message })}\n\n`);
  });

  res.status(200).json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
