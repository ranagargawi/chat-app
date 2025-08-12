// ====== CONFIG ======
const baseUrlInput = document.getElementById('baseUrl');
const saveBaseUrlBtn = document.getElementById('saveBaseUrl');
let BASE_URL = localStorage.getItem('baseUrl') || baseUrlInput.value;

// ====== UI ELEMENTS ======
const meInput = document.getElementById('me');
const toInput = document.getElementById('to');
const msgInput = document.getElementById('msg');

const connectBtn = document.getElementById('connectBtn');
const disconnectBtn = document.getElementById('disconnectBtn');
const sendBtn = document.getElementById('sendBtn');
const clearBtn = document.getElementById('clearBtn');

const chatEl = document.getElementById('chat');
const statusEl = document.getElementById('status');
const subsInfoEl = document.getElementById('subsInfo');

// ====== STATE ======
let stompClient = null;
let subs = {
  room: null,
  inbox: null,
};

// ====== HELPERS ======
function setStatus(txt) {
  statusEl.textContent = txt;
}
function appendMsg(text) {
  const li = document.createElement('li');
  li.textContent = text;
  chatEl.appendChild(li);
  chatEl.scrollTop = chatEl.scrollHeight;
}
function clearChat() {
  chatEl.innerHTML = '';
}
function updateSubsInfo() {
  const list = [];
  if (subs.room) list.push('/topic/messages');
  if (subs.inbox) list.push('/user/queue/messages');
  subsInfoEl.textContent = list.length ? list.join(' , ') : '—';
}

// ====== BASE URL PERSISTENCE ======
baseUrlInput.value = BASE_URL;
saveBaseUrlBtn.addEventListener('click', () => {
  BASE_URL = baseUrlInput.value.trim().replace(/\/+$/, '');
  localStorage.setItem('baseUrl', BASE_URL);
  appendMsg(`Base URL set to: ${BASE_URL}`);
});

// ====== WEBSOCKET CONNECTION ======
function connectWS() {
  const me = meInput.value.trim();
  if (!me) {
    appendMsg('Please enter your username first.');
    meInput.focus();
    return;
  }

  // SockJS endpoint at /ws
  const socket = new SockJS(`${BASE_URL}/ws`);

  stompClient = new StompJs.Client({
    webSocketFactory: () => socket,
    reconnectDelay: 3000,
    onConnect: () => {
      setStatus('✅ Connected');
      appendMsg('✅ Connected to broker');

      // Subscribe to room (broadcast)
      subs.room = stompClient.subscribe('/topic/messages', (frame) => {
        try {
          const msg = JSON.parse(frame.body);
          appendMsg(`[ROOM] ${msg.from}: ${msg.text}`);
        } catch {
          appendMsg(`[ROOM] ${frame.body}`);
        }
        updateSubsInfo();
      });

      // Subscribe to personal queue
      subs.inbox = stompClient.subscribe('/user/queue/messages', (frame) => {
        try {
          const msg = JSON.parse(frame.body);
          appendMsg(`[DM to ${me}] ${msg.from}: ${msg.text}`);
        } catch {
          appendMsg(`[DM to ${me}] ${frame.body}`);
        }
        updateSubsInfo();
      });

      updateSubsInfo();
    },
    onStompError: (frame) => {
      setStatus('⚠️ STOMP error');
      appendMsg(`Broker error: ${frame.headers['message'] || 'unknown'}`);
    },
    onWebSocketClose: () => {
      setStatus('❌ Disconnected');
      appendMsg('❌ Disconnected');
      cleanupSubs();
    }
  });

  stompClient.activate();
}

function disconnectWS() {
  if (stompClient) {
    try { cleanupSubs(); } catch {}
    stompClient.deactivate(); // async close
  }
}

function cleanupSubs() {
  if (subs.room) { try { subs.room.unsubscribe(); } catch {} subs.room = null; }
  if (subs.inbox) { try { subs.inbox.unsubscribe(); } catch {} subs.inbox = null; }
  updateSubsInfo();
}

// ====== SEND MESSAGE ======
function sendMessage() {
  if (!stompClient || !stompClient.active) {
    appendMsg('Not connected.');
    return;
  }
  const from = meInput.value.trim();
  const to = toInput.value.trim();
  const text = msgInput.value.trim();

  if (!text) return;

  const payload = JSON.stringify({
    from,
    to: to || null,
    text,
    timestamp: Date.now()
  });

  if (to) {
    // Direct message -> handled by @MessageMapping("/chat.direct")
    stompClient.publish({ destination: '/app/chat.direct', body: payload });
  } else {
    // Broadcast -> handled by @MessageMapping("/chat.send") + @SendTo("/topic/messages")
    stompClient.publish({ destination: '/app/chat.send', body: payload });
  }

  msgInput.value = '';
  msgInput.focus();
}

// ====== WIRE EVENTS ======
connectBtn.addEventListener('click', connectWS);
disconnectBtn.addEventListener('click', disconnectWS);
sendBtn.addEventListener('click', sendMessage);
clearBtn.addEventListener('click', clearChat);

// Allow Enter to send (Shift+Enter for newline)
msgInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Optional: auto-connect if username is present and you want that behavior
// window.addEve
