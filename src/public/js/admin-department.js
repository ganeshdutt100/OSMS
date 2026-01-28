// src/public/js/admin-departments.js
async function loadDepartments() {
    try {
      const { departments } = await api('/admin/departments'); // expose this route in backend
      const tbody = document.getElementById('departmentsTable');
      tbody.innerHTML = '';
  
      departments.forEach(d => {
        tbody.innerHTML += `
          <tr>
            <td>${d.dept_id}</td>
            <td>${d.dept_name}</td>
            <td>${d.location || ''}</td>
            <td>${d.phone || ''}</td>
            <td>${d.email || ''}</td>
            <td>
              <button class="btn btn-danger btn-sm" onclick="deleteDepartment('${d.dept_id}')">Delete</button>
            </td>
          </tr>`;
      });
    } catch (err) {
      console.error('Load departments error:', err);
      toast(err.message, 'danger');
      if (/Unauthorized/i.test(err.message)) {
        redirect('/html/login.html');
      }
    }
  }
  
  async function deleteDepartment(dept_id) {
    try {
      await api('/admin/departments/delete', 'POST', { dept_id });
      toast(`Department ${dept_id} deleted`, 'success');
      loadDepartments();
    } catch (err) {
      console.error('Delete department error:', err);
      toast(err.message, 'danger');
    }
  }
  
  document.getElementById('logoutBtn').addEventListener('click', performLogout);
  loadDepartments();