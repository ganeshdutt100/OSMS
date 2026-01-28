// src/public/js/dept-requests.js
async function loadRequests() {
    try {
      const { requests } = await api('/department/requests');
      const tbody = document.getElementById('requestsTable');
      tbody.innerHTML = '';
  
      requests.forEach(r => {
        // Each item has item_id populated with StockItem document
        const items = r.items
          .map(i => `${i.item_id.item_name} (${i.quantity})`)
          .join(', ');
  
        tbody.innerHTML += `
          <tr>
            <td>${items}</td>
            <td>${r.status}</td>
            <td>${new Date(r.createdAt).toLocaleString()}</td>
          </tr>`;
      });
    } catch (err) {
      console.error('Load requests error:', err);
      toast(err.message, 'danger');
      if (/Unauthorized/i.test(err.message)) {
        redirect('/html/login.html');
      }
    }
  }
  
  document.getElementById('logoutBtn').addEventListener('click', performLogout);
  loadRequests();