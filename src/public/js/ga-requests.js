document.addEventListener("DOMContentLoaded", () => {
  console.log("GA Requests Script Loaded");

  // Logout Logic
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await fetch("/auth/logout", { method: "POST" });
        window.location.href = "/html/login.html";
      } catch (err) {
        console.error("Logout failed", err);
      }
    });
  }

  // Load Data
  loadRequests();
});

async function loadRequests() {
  const tbody = document.getElementById("requestsTable");

  // Clear previous content and remove old listeners
  if (tbody) {
    tbody.innerHTML =
      '<tr><td colspan="4" class="text-center">Loading...</td></tr>';
  }

  try {
    const res = await fetch("/ga/requests");
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Failed to fetch");

    const requests = data.requests;

    if (!requests || requests.length === 0) {
      if (tbody)
        tbody.innerHTML =
          '<tr><td colspan="4" class="text-center">No pending requests found.</td></tr>';
      return;
    }

    if (tbody) {
      // HTML banate waqt hum 'onclick' use NAHI karenge
      // Hum data-id aur data-action attributes use karenge
      tbody.innerHTML = requests
        .map((req) => {
          const itemsList = req.items
            .map((i) => {
              const itemName = i.item_id ? i.item_id.item_name : "Unknown Item";
              return `<div class="text-muted small">• ${itemName} (Qty: ${i.quantity})</div>`;
            })
            .join("");

          return `
                <tr>
                    <td>${req.dept_id}</td>
                    <td>${itemsList}</td>
                    <td>
                        <span class="badge ${
                          req.status === "PENDING"
                            ? "bg-warning text-dark"
                            : "bg-secondary"
                        }">
                            ${req.status}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-success btn-sm me-1 action-btn" 
                                data-id="${req._id}" 
                                data-action="approve">
                            Approve
                        </button>
                        <button class="btn btn-danger btn-sm action-btn" 
                                data-id="${req._id}" 
                                data-action="reject">
                            Reject
                        </button>
                    </td>
                </tr>
                `;
        })
        .join("");

      // --- EVENT LISTENERS ADD KARNA ---
      // Ab hum buttons par click listener lagayenge
      addClickListeners();
    }
  } catch (err) {
    console.error("Error loading requests:", err);
    if (tbody)
      tbody.innerHTML =
        '<tr><td colspan="4" class="text-danger text-center">Error loading data. Check Console.</td></tr>';
  }
}

function addClickListeners() {
  // Saare buttons jin par 'action-btn' class hai unhe select karo
  const buttons = document.querySelectorAll(".action-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      // Button se ID aur Action nikalo
      const id = e.target.getAttribute("data-id");
      const action = e.target.getAttribute("data-action");

      await handleUpdate(id, action);
    });
  });
}

// Update Logic
async function handleUpdate(id, action) {
  const actionText = action === "approve" ? "Approve" : "Reject";

  if (!confirm(`Are you sure you want to ${actionText} this request?`)) return;

  try {
    const url = `/ga/requests/${id}/${action}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (res.ok) {
      alert(`Success: Request ${actionText}d!`);
      loadRequests(); // Reload table
    } else {
      alert("Error: " + (data.error || "Operation failed"));
    }
  } catch (err) {
    console.error("Fetch Error:", err);
    alert("Server connection failed.");
  }
}
