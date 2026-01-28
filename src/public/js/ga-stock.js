// src/public/js/ga-stock.js
async function loadStock() {
    try {
      const { stock } = await api('/ga/stock');
      const tbody = document.getElementById('stockTable');
      tbody.innerHTML = '';
  
      stock.forEach(s => {
        tbody.innerHTML += `
          <tr>
            <td>${s.item_id}</td>
            <td>${s.item_name}</td>
            <td>${s.available_qty}</td>
            <td>${s.uo_m}</td>
          </tr>`;
      });
    } catch (err) {
      console.error('Load stock error:', err);
      toast(err.message, 'danger');
      if (/Unauthorized/i.test(err.message)) {
        redirect('/html/login.html');
      }
    }
  }
  
  document.getElementById('logoutBtn').addEventListener('click', performLogout);
  loadStock();