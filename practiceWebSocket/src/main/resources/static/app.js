const statusEl = document.getElementById('status');
const connectBtn = document.getElementById('connectBtn');
const disconnectBtn = document.getElementById('disconnectBtn');
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const messagesEl = document.getElementById('messages');

let ws = null;
let username = '';

function setConnected(connected) {
  statusEl.textContent = connected ? 'Connected' : 'Disconnected';
  disconnectBtn.disabled = !connected;
  messageInput.disabled = !connected;
  sendBtn.disabled = !connected;
  connectBtn.disabled = connected;
  usernameInput.disabled = connected;
}

function appendMessage({ sender, content, timestamp, type }) {
  const li = document.createElement('li');
  li.className = 'msg';
  const when = new Date(timestamp || Date.now()).toLocaleTimeString();
  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.textContent = type === 'JOIN'
    ? `🟢 ${sender} joined at ${when}`
    : `${sender} • ${when}`;
  const text = document.createElement('div');
  text.textContent = content || '';
  li.appendChild(meta);
  if (content) li.appendChild(text);
  messagesEl.appendChild(li);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function buildWsUrl() {
  // If the page is served by Spring Boot (8080), use that host.
  // If not (e.g., file:// or Live Server on :5500), point to :8080 automatically.
  const pageProto = location.protocol === 'https:' ? 'wss' : 'ws';
  const pageHost = location.host; // includes port if any

  // Served by Spring (same origin)? Use it directly.
  if (pageHost && (pageHost.endsWith(':8080') || pageHost.indexOf(':') === -1)) {
    return `${pageProto}://${pageHost}/ws`;
  }

  // Otherwise, aim at localhost:8080 where Spring is running.
  const host = location.hostname || 'localhost';
  return `${pageProto}://${host}:8080/ws`;
}

connectBtn.addEventListener('click', () => {
  username = (usernameInput.value || '').trim() || 'Anonymous';
  const url = buildWsUrl();
  ws = new WebSocket(url);

  ws.addEventListener('open', () => {
    setConnected(true);
    ws.send(JSON.stringify({ type: 'JOIN', sender: username, content: `${username} joined` }));
  });

  ws.addEventListener('message', (evt) => {
    try {
      const data = JSON.parse(evt.data);
      appendMessage(data);
    } catch {}
  });

  ws.addEventListener('close', () => setConnected(false));
  ws.addEventListener('error', () => setConnected(false));
});

disconnectBtn.addEventListener('click', () => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.close(1000, 'Client disconnect');
  }
  setConnected(false);
});

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const content = messageInput.value.trim();
  if (!content || !ws || ws.readyState !== WebSocket.OPEN) return;
  ws.send(JSON.stringify({ type: 'CHAT', sender: username, content }));
  messageInput.value = '';
}
