let currentTableData = [];
let currentTableElement = null;
let currentSectionTitle = 'Trang chủ';

const contentEl = document.getElementById('content');
const breadcrumbEl = document.getElementById('breadcrumb');
const pageEyebrowEl = document.getElementById('pageEyebrow');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const menuSearch = document.getElementById('menuSearch');

function setPageMeta(section, title) {
  pageEyebrowEl.textContent = section;
  breadcrumbEl.textContent = title;
  document.title = `${title} | Shoptoolnro Docs`;
  currentSectionTitle = title;
}

function setActiveMenu(title) {
  document.querySelectorAll('.menu button').forEach((button) => {
    button.classList.toggle('active', button.dataset.title === title);
  });
}

function closeSidebarOnMobile() {
  if (window.innerWidth <= 860) {
    document.body.classList.remove('sidebar-open');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
  }
}

function toggleSidebar() {
  const isOpen = document.body.classList.toggle('sidebar-open');
  mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
}

mobileMenuBtn.addEventListener('click', toggleSidebar);
sidebarOverlay.addEventListener('click', closeSidebarOnMobile);
window.addEventListener('resize', () => {
  if (window.innerWidth > 860) {
    document.body.classList.remove('sidebar-open');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
  }
});

menuSearch.addEventListener('input', (event) => {
  const keyword = event.target.value.toLowerCase().trim();
  document.querySelectorAll('.menu-section').forEach((section) => {
    let hasMatch = false;
    section.querySelectorAll('button').forEach((button) => {
      const match = button.textContent.toLowerCase().includes(keyword);
      button.style.display = match ? 'flex' : 'none';
      if (match) hasMatch = true;
    });
    section.style.display = hasMatch ? 'block' : 'none';
  });
});

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function scrollContentTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderEmptyState(message) {
  contentEl.innerHTML = `
    <div class="empty-state">
      <p>${escapeHtml(message)}</p>
    </div>
  `;
}

function openCaptchaSite() {
  setActiveMenu('Web Captcha');
  window.open('https://api.shoptoolnro.click', '_blank', 'noopener,noreferrer');
  closeSidebarOnMobile();
}

function loadHome() {
  setPageMeta('Tài liệu', 'Trang chủ');
  setActiveMenu('Trang chủ');
  contentEl.innerHTML = `
    <section class="hero">
      <div class="hero-copy">
        <div class="hero-tag">Trung tâm tài liệu</div>
        <h2>Hướng dẫn sử dụng tool, captcha, xem ID Game</h2>
        <p class="doc-paragraph">Mua tool,vps,proxy tại shoptoolnro.com.vn.</p>
        <div class="hero-actions">
          <a class="primary-btn" href="https://shoptoolnro.com.vn" target="_blank" rel="noopener noreferrer">Mở web tool</a>
          <a class="secondary-btn" href="https://api.shoptoolnro.click" target="_blank" rel="noopener noreferrer">Mở web Captcha</a>
          <a class="secondary-btn" href="#" onclick="loadGuide('guide1', 'Cách đăng nhập VPS'); return false;">Xem hướng dẫn đầu tiên</a>
        </div>
      </div>
      <div class="hero-preview">
        <a href="https://shoptoolnro.com.vn" target="_blank" rel="noopener noreferrer">
          <img src="images/cloud.jpg" alt="Ảnh minh họa Shoptoolnro">
        </a>
      </div>
    </section>
  `;
  closeSidebarOnMobile();
  scrollContentTop();
}

async function loadTable(name, title = 'Bảng ID') {
  try {
    const res = await fetch(`tables/${name}.json`);
    if (!res.ok) throw new Error('Không thể tải dữ liệu bảng');
    const data = await res.json();

    currentTableData = Array.isArray(data) ? data : [];
    setPageMeta('Bảng ID', title);
    setActiveMenu(title);

    contentEl.innerHTML = `
      <div class="doc-header">
        <div class="doc-meta">
          <span class="doc-pill">Bảng dữ liệu</span>
          <span class="doc-pill">${currentTableData.length} dòng</span>
        </div>
        <h2>${escapeHtml(title)}</h2>
        <p>Tra cứu nhanh ID và tên. Bảng được giữ theo kiểu cuộn ngang trên màn hình nhỏ để không vỡ bố cục.</p>
        <input class="doc-search" placeholder="Tìm theo ID hoặc tên..." oninput="searchTableOptimized(this)" aria-label="Tìm theo ID hoặc tên">
      </div>
      <div class="table-wrap">
        <table class="data-table" aria-label="${escapeHtml(title)}">
          <thead>
            <tr>
              <th style="width: 140px;">ID</th>
              <th>Tên</th>
            </tr>
          </thead>
          <tbody id="table-body"></tbody>
        </table>
      </div>
      <div class="table-caption" id="tableCaption">Hiển thị ${currentTableData.length} kết quả.</div>
    `;

    currentTableElement = document.getElementById('table-body');
    renderTableRows(currentTableData);
    closeSidebarOnMobile();
    scrollContentTop();
  } catch (error) {
    renderEmptyState('Không tải được bảng dữ liệu. Vui lòng kiểm tra lại tệp JSON.');
  }
}

function renderTableRows(rows) {
  if (!currentTableElement) return;

  currentTableElement.innerHTML = rows.map((row) => `
    <tr>
      <td>${escapeHtml(row.id)}</td>
      <td>${escapeHtml(row.name)}</td>
    </tr>
  `).join('');

  const tableCaption = document.getElementById('tableCaption');
  if (tableCaption) {
    tableCaption.textContent = `Hiển thị ${rows.length} kết quả.`;
  }
}

function searchTableOptimized(input) {
  const filter = input.value.toLowerCase().trim();
  if (!filter) {
    renderTableRows(currentTableData);
    return;
  }

  const filtered = currentTableData.filter((row) => {
    const id = String(row.id).toLowerCase();
    const name = String(row.name).toLowerCase();
    return id.includes(filter) || name.includes(filter);
  });

  renderTableRows(filtered);
}

function buildGuideSteps(data) {
  const steps = [];
  let pendingText = null;
  let textOnlyCounter = 0;

  data.forEach((item) => {
    if (item.type === 'text') {
      pendingText = item.value;
      textOnlyCounter += 1;
      if (textOnlyCounter > 1) {
        steps.push({ text: pendingText, image: null });
        pendingText = null;
      }
      return;
    }

    if (item.type === 'image') {
      steps.push({ text: pendingText || `Hình minh họa cho bước ${steps.length + 1}`, image: item.value });
      pendingText = null;
      textOnlyCounter = 0;
    }
  });

  if (pendingText) {
    steps.push({ text: pendingText, image: null });
  }

  return steps;
}

async function loadGuide(name, title = 'Hướng dẫn') {
  try {
    const res = await fetch(`guides/${name}.json`);
    if (!res.ok) throw new Error('Không thể tải hướng dẫn');
    const data = await res.json();
    const steps = buildGuideSteps(Array.isArray(data) ? data : []);

    setPageMeta('Hướng dẫn', title);
    setActiveMenu(title);

    const html = `
      <article>
        <div class="doc-header">
          <div class="doc-meta">
            <span class="doc-pill">Tài liệu hướng dẫn</span>
            <span class="doc-pill">${steps.length} bước</span>
          </div>
          <h2>${escapeHtml(title)}</h2>
          <p>Nội dung được hiển thị theo từng bước, ưu tiên dễ đọc và dễ theo dõi trên màn hình dọc của điện thoại cũng như màn hình rộng trên máy tính.</p>
        </div>
        <div class="doc-body">
          ${steps.map((step, index) => `
            <section class="guide-step">
              <div class="guide-step-index">${index + 1}</div>
              <div class="guide-step-text">${escapeHtml(step.text || `Bước ${index + 1}`)}</div>
              ${step.image ? `
                <div class="guide-image-frame">
                  <img src="${escapeHtml(step.image)}" alt="${escapeHtml(step.text || `Hình ảnh bước ${index + 1}`)}" loading="lazy">
                </div>
              ` : ''}
            </section>
          `).join('')}
        </div>
      </article>
    `;

    contentEl.innerHTML = html;
    closeSidebarOnMobile();
    scrollContentTop();
  } catch (error) {
    renderEmptyState('Không tải được hướng dẫn. Vui lòng kiểm tra lại tệp JSON.');
  }
}

loadHome();
