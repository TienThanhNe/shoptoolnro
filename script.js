// Biến toàn cục để lưu dữ liệu gốc của bảng hiện tại
let currentTableData = [];
let currentTableElement = null;

function toggleSidebar() {
    let s = document.getElementById("sidebar");
    s.classList.toggle("hide");
}

function loadHome() {
    let html = `
        <div class="home">
            <div class="title">Click vào ảnh để mua tool!</div>
            <div class="cloud-frame">
                <a href="https://shoptoolnro.com.vn" target="_blank">
                    <img src="images/cloud.jpg">
                </a>
            </div>
        </div>
    `;
    document.getElementById("content").innerHTML = html;
}

async function loadTable(name) {
    let res = await fetch("tables/" + name + ".json");
    let data = await res.json();

    // Lưu dữ liệu gốc
    currentTableData = data;

    let html = `
        <h2>Bảng ID</h2>
        <input class="search" placeholder="Tìm ID hoặc tên..." onkeyup="searchTableOptimized(this)">
        <table id="idtable">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tên</th>
                </tr>
            </thead>
            <tbody id="table-body"></tbody>
        </table>
    `;

    document.getElementById("content").innerHTML = html;
    currentTableElement = document.getElementById("table-body");

    // Render toàn bộ lần đầu
    renderTableRows(data);
}

function renderTableRows(rows) {
    if (!currentTableElement) return;

    let html = "";
    rows.forEach(row => {
        html += `
            <tr>
                <td>${row.id}</td>
                <td>${row.name}</td>
            </tr>
        `;
    });

    currentTableElement.innerHTML = html;
}

function searchTableOptimized(input) {
    let filter = input.value.toLowerCase().trim();

    if (!filter) {
        // Nếu ô tìm kiếm rỗng → hiện toàn bộ
        renderTableRows(currentTableData);
        return;
    }

    // Lọc dữ liệu (rất nhanh vì làm trên array JS)
    let filtered = currentTableData.filter(row => {
        return (
            String(row.id).toLowerCase().includes(filter) ||
            row.name.toLowerCase().includes(filter)
        );
    });

    renderTableRows(filtered);
}

async function loadGuide(name) {
    let res = await fetch("guides/" + name + ".json");
    let data = await res.json();
    let html = "";
    data.forEach(item => {
        if (item.type === "text") html += `<p>${item.value}</p>`;
        if (item.type === "image") html += `<img src="${item.value}">`;
    });
    document.getElementById("content").innerHTML = html;
}

// Load trang mặc định
loadHome();