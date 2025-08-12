// ====== CONFIG ======
const baseUrlInput = document.getElementById('baseUrl');
const saveBaseUrlBtn = document.getElementById('saveBaseUrl');
let BASE_URL = localStorage.getItem('baseUrl') || baseUrlInput.value;

// ====== UI ELEMENTS ======
const signupForm = document.getElementById('signupForm');
const suUsername = document.getElementById('suUsername');
const suEmail = document.getElementById('suEmail');

const senderSelect = document.getElementById('senderSelect');
const recipientSelect = document.getElementById('recipientSelect');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const refreshBtn = document.getElementById('refreshBtn');

const conversationEl = document.getElementById('conversation');
const toastEl = document.getElementById('toast');

// ====== HELPERS ======
function toast(msg, type = '') {
  toastEl.textContent = msg;
  toastEl.className = `toast show ${type}`;
  setTimeout(() => toastEl.className = 'toast', 2000);
}
async function api(path, opts = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `${res.status} ${res.statusText}`);
  }
  const contentType = res.headers.get('content-type') || '';
  return contentType.includes('application/json') ? res.json() : res.text();
}
function option(v, t) {
  const o = document.createElement('option');
  o.value = v; o.textContent = t; return o;
}

// ====== USERS ======
async function loadUsers() {
  try {
    const users = await api('/users');
    senderSelect.innerHTML = '';
    recipientSelect.innerHTML = '';
    users.forEach(u => {
      senderSelect.appendChild(option(u.id, `${u.username} (${u.email})`));
      recipientSelect.appendChild(option(u.id, `${u.username} (${u.email})`));
    });
    if (users.length >= 2) {
      // default sender 0, recipient 1
      senderSelect.value = users[0].id;
      recipientSelect.value = users[1].id;
    }
  } catch (e) {
    toast('Failed to load users: ' + e.message, 'error');
  }
}

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const body = {
      username: suUsername.value.trim(),
      email: suEmail.value.trim(),
    };
    if (!body.username || !body.email) return;
    await api('/users', { method: 'POST', body: JSON.stringify(body) });
    toast('User created!', 'success');
    suUsername.value = '';
    suEmail.value = '';
    await loadUsers();
  } catch (e) {
    const msg = e.message.includes('already exists') ? e.message : 'Could not create user';
    toast(msg, 'error');
  }
});

// ====== MESSAGES ======
async function sendMessage() {
  const senderId = senderSelect.value;
  const recipientId = recipientSelect.value;
  const content = messageInput.value.trim();
  if (!senderId || !recipientId || !content) {
    toast('Pick both users and write a message.', 'error');
    return;
  }
  if (senderId === recipientId) {
    toast('Sender and recipient must be different.', 'error');
    return;
  }
  try {
    await api('/messages', {
      method: 'POST',
      body: JSON.stringify({ senderId, recipientId, content })
    });
    messageInput.value = '';
    toast('Message sent!', 'success');
    await loadConversation();
  } catch (e) {
    toast('Send failed: ' + e.message, 'error');
  }
}

async function loadConversation() {
  const a = senderSelect.value;
  const b = recipientSelect.value;
  if (!a || !b) return;
  try {
    const items = await api(`/messages/conversation?userAId=${encodeURIComponent(a)}&userBId=${encodeURIComponent(b)}`);
    renderConversation(items, a);
  } catch (e) {
    toast('Load conversation failed: ' + e.message, 'error');
  }
}

function renderConversation(items, currentSenderId) {
  conversationEl.innerHTML = '';
  if (!Array.isArray(items) || items.length === 0) {
    conversationEl.innerHTML = '<div class="hint">No messages yet. Say hi!</div>';
    return;
  }
  items.forEach(m => {
    const box = document.createElement('div');
    box.className = 'msg ' + (m.senderId === currentSenderId ? 'me' : 'them');
    const time = new Date(m.sentAt ?? Date.now()).toLocaleString();
    box.innerHTML = `
      <div>${escapeHtml(m.content)}</div>
      <span class="meta">${time}</span>
    `;
    conversationEl.appendChild(box);
  });
}
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// ====== EVENTS ======
sendBtn.addEventListener('click', sendMessage);
refreshBtn.addEventListener('click', loadConversation);

senderSelect.addEventListener('change', loadConversation);
recipientSelect.addEventListener('change', loadConversation);

saveBaseUrlBtn.addEventListener('click', () => {
  BASE_URL = baseUrlInput.value.trim().replace(/\/+$/, '');
  localStorage.setItem('baseUrl', BASE_URL);
  toast('Saved backend URL', 'success');
  loadUsers().then(loadConversation);
});

// ====== INIT ======
(function init() {
  baseUrlInput.value = BASE_URL;
  loadUsers().then(loadConversation);
})();
