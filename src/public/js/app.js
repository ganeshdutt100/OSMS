// src/public/js/app.js

// Generic API helper
async function api(url, method = 'GET', data = null) {
  const options = { method, headers: { 'Content-Type': 'application/json' } };
  if (data) options.body = JSON.stringify(data);

  const res = await fetch(url, options);
  if (!res.ok) {
    let msg = 'Request failed';
    try {
      const err = await res.json();
      msg = err.error || msg;
    } catch (_) {}
    throw new Error(msg);
  }
  return res.json();
}

// Toast helper (Bootstrap 5 alert style)
function toast(message, type = 'info') {
  const containerId = 'toast-container';
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    container.style.position = 'fixed';
    container.style.top = '1rem';
    container.style.right = '1rem';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
  }

  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  container.appendChild(alert);

  setTimeout(() => {
    alert.remove();
  }, 3000);
}

// Redirect helper
function redirect(path) {
  window.location.href = path;
}

// Logout helper
async function performLogout() {
  try {
    await api('/auth/logout', 'POST');
    toast('Logged out', 'success');
    redirect('/login.html');
  } catch (err) {
    toast(err.message, 'danger');
  }
}