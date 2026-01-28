// src/public/js/ga-reports.js
async function loadReports() {
  try {
    // System summary
    const { summary } = await api("/report/system-summary");
    const systemList = document.getElementById("systemReportList");
    systemList.innerHTML = `
        <li class="list-group-item">Total Requests: ${summary.totalRequests}</li>
        <li class="list-group-item">Pending: ${summary.pending}</li>
        <li class="list-group-item">Approved: ${summary.approved}</li>
        <li class="list-group-item">Rejected: ${summary.rejected}</li>
        <li class="list-group-item">Issued: ${summary.issued}</li>
        <li class="list-group-item">Stock Items: ${summary.stockCount}</li>
        <li class="list-group-item">Issues: ${summary.issuesCount}</li>
        <li class="list-group-item">Users: ${summary.usersCount}</li>
        <li class="list-group-item">Departments: ${summary.departmentsCount}</li>
      `;

    // Department summary
    const { summary: deptSummary } = await api("/report/department-summary");
    const tbody = document.getElementById("deptReportTable");
    tbody.innerHTML = "";

    deptSummary.forEach((d) => {
      tbody.innerHTML += `
          <tr>
            <td>${d.dept_id}</td>
            <td>${d.dept_name || ""}</td>
            <td>${d.total}</td>
            <td>${d.pending}</td>
            <td>${d.approved}</td>
            <td>${d.rejected}</td>
            <td>${d.issued}</td>
          </tr>`;
    });
  } catch (err) {
    console.error("Load reports error:", err);
    toast(err.message, "danger");
    if (/Unauthorized/i.test(err.message)) {
      redirect("/html/login.html");
    }
  }
}

document.getElementById("logoutBtn").addEventListener("click", performLogout);
loadReports();
