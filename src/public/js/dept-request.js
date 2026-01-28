// src/public/js/dept-request.js
document.getElementById('logoutBtn').addEventListener('click', performLogout);

document.getElementById('addItemBtn').addEventListener('click', () => {
  const container = document.getElementById('itemsContainer');
  container.innerHTML += `
    <div class="row mb-3">
      <div class="col-md-5">
        <input type="text" class="form-control" placeholder="Item ID" name="item_id" required>
      </div>
      <div class="col-md-5">
        <input type="number" class="form-control" placeholder="Quantity" name="quantity" min="1" required>
      </div>
    </div>`;
});

document.getElementById('requestForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const itemIds = document.querySelectorAll('input[name="item_id"]');
  const quantities = document.querySelectorAll('input[name="quantity"]');
  const items = [];

  for (let i = 0; i < itemIds.length; i++) {
    items.push({ item_id: itemIds[i].value.trim(), quantity: Number(quantities[i].value) });
  }

  try {
    const res = await api('/department/request', 'POST', { items });

    if (res.error) {
      toast(res.error, 'danger');
      return;
    }

    toast(res.message || 'Request submitted successfully', 'success');
    redirect('/html/dept-requests.html');
  } catch (err) {
    console.error('Submit request error:', err);
    toast('Failed to submit request. Please try again.', 'danger');
  }
});