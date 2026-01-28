// src/public/js/register.js
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const user_id = document.getElementById('user_id').value.trim();
  const name = document.getElementById('name').value.trim();
  const dept_id = document.getElementById('dept_id').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value; // 'STAFF', 'GA', or 'ADMIN'

  try {
    const res = await api('/auth/register', 'POST', {
      user_id,
      name,
      dept_id,
      email,
      password,
      role
    });

    if (res.error) {
      toast(res.error, 'danger');
      return;
    }

    toast(res.message || 'Registration successful', 'success');

    // Redirect based on role (consistent with User.js schema)
    if (res.user) {
      switch (res.user.role) {
        case 'GA':
          redirect('/html/ga-dashboard.html');
          break;
        case 'ADMIN':
          redirect('/html/admin-dashboard.html'); // create this page for admin
          break;
        case 'STAFF':
        default:
          redirect('/html/dept-dashboard.html');
          break;
      }
    }
  } catch (err) {
    console.error('Register JS error:', err);
    toast('Registration failed. Please try again.', 'danger');
  }
});