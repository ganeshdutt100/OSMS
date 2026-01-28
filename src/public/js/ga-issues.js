// public/js/ga-issues.js

async function loadIssues() {
  const tbody = document.getElementById("issuesTable");

  try {
    // Standard fetch call use kar rahe hain
    const res = await fetch("/ga/issues");
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to fetch issues");
    }

    const issues = data.issues;
    tbody.innerHTML = "";

    if (issues.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="6" class="text-center">No issues found.</td></tr>';
      return;
    }

    issues.forEach((i) => {
      // Check karein ki populate hua ya nahi
      // Agar i.request_id object hai to uske andar se .request_id nikalo
      const requestLabel =
        i.request_id && i.request_id.request_id
          ? i.request_id.request_id
          : "N/A";

      // Agar i.issued_by object hai to uske andar se .name nikalo
      const issuedByLabel =
        i.issued_by && i.issued_by.name ? i.issued_by.name : "Unknown";

      tbody.innerHTML += `
                <tr>
                    <td>${i.issue_id || ""}</td>
                    <td>${requestLabel}</td>
                    <td>${i.title}</td>
                    <td>${i.description}</td>
                    <td>${i.status || "OPEN"}</td>
                    <td>${issuedByLabel}</td>
                </tr>`;
    });
  } catch (err) {
    console.error("Load issues error:", err);
    tbody.innerHTML = `<tr><td colspan="6" class="text-danger text-center">Error: ${err.message}</td></tr>`;

    // Agar Unauthorized hai to login pe bhejo
    if (err.message.includes("Unauthorized") || err.message.includes("login")) {
      window.location.href = "/html/login.html";
    }
  }
}

// Ensure logout script is loaded or handle manually
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await fetch("/auth/logout", { method: "POST" });
    window.location.href = "/html/login.html";
  });
}

// Page Load hote hi chalao
loadIssues();
