// src/public/js/login.js
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    const res = await api('/auth/login', 'POST', { email, password });

    if (res.error) {
      toast(res.error, 'danger');
      return;
    }

    toast(res.message || 'Login successful', 'success');

    // Redirect based on role (consistent with User.js schema)
    if (res.user) {
      switch (res.user.role) {
        case 'GA':
          redirect('/html/ga-dashboard.html');
          break;
        case 'ADMIN':
          redirect('/html/admin-dashboard.html'); // you can create this page
          break;
        case 'STAFF':
        default:
          redirect('/html/dept-dashboard.html');
          break;
      }
    }
  } catch (err) {
    console.error('Login JS error:', err);
    toast('Login failed. Please try again.', 'danger');
  }
});