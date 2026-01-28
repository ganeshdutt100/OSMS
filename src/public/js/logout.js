// src/public/js/logout.js
async function performLogout() {
    try {
      const res = await api('/auth/logout', 'POST');
  
      if (res.error) {
        toast(res.error, 'danger');
        return;
      }
  
      toast(res.message || 'Logged out successfully', 'success');
      // Redirect back to login page (corrected path)
      redirect('/html/login.html');
    } catch (err) {
      console.error('Logout JS error:', err);
      toast('Logout failed. Please try again.', 'danger');
    }
  }
  
  // Attach automatically if logoutBtn exists
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('logoutBtn');
    if (btn) {
      btn.addEventListener('click', performLogout);
    }
  });