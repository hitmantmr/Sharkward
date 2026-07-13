try {
  const WebSocket = require('ws');
  console.log('WS is available in bot dir!');
} catch (err) {
  console.log('WS is NOT available in bot dir:', err.message);
}
