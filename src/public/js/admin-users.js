// src/public/js/admin-users.js
async function loadUsers() {
    try {
      const { users } = await api('/admin/users'); // you’ll expose this route in backend
      const tbody = document.getElementById('usersTable');
      tbody.innerHTML = '';
  
      users.forEach(u => {
        tbody.innerHTML += `
          <tr>
            <td>${u.user_id}</td>
            <td>${u.name}</td>
            <td>${u.email}</td>
            <td>${u.role}</td>
            <td>${u.dept_id || ''}</td>
            <td>${u.status}</td>
            <td>
              <button class="btn btn-danger btn-sm" onclick="deleteUser('${u.email}')">Delete</button>
            </td>
          </tr>`;
      });
    } catch (err) {
      console.error('Load users error:', err);
      toast(err.message, 'danger');
      if (/Unauthorized/i.test(err.message)) {
        redirect('/html/login.html');
      }
    }
  }
  
  async function deleteUser(email) {
    try {
      await api('/auth/delete', 'POST', { email });
      toast(`User ${email} deleted`, 'success');
      loadUsers();
    } catch (err) {
      console.error('Delete user error:', err);
      toast(err.message, 'danger');
    }
  }
  
  document.getElementById('logoutBtn').addEventListener('click', performLogout);
  loadUsers();