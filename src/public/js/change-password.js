// src/public/js/change-password.js
document.getElementById('changePasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
  
    try {
      const res = await api('/auth/change-password', 'POST', { currentPassword, newPassword });
  
      if (res.error) {
        toast(res.error, 'danger');
        return;
      }
  
      toast(res.message || 'Password changed successfully', 'success');
  
      // Redirect back to dashboard based on role
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
      } else {
        // Fallback redirect
        redirect('/html/dept-dashboard.html');
      }
    } catch (err) {
      console.error('Change password error:', err);
      toast('Password change failed. Please try again.', 'danger');
    }
  });