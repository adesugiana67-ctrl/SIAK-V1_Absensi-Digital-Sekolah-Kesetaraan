/* Shared UI components: Navbar, Footer, KPI card, Modal, PDF/Print toolbar */

function renderNavbar(active) {
  const item = (href, label, key) => {
    const isActive = key === active;
    const cls = isActive ? 'bg-slate-700 text-white' : 'text-white hover:bg-slate-700';
    return `<a href="${href}" class="px-4 py-2 rounded text-sm font-medium transition-colors ${cls}">${label}</a>`;
  };
  const subItem = (href, label) =>
    `<a href="${href}" class="block px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 border-b border-slate-100 last:border-b-0">${label}</a>`;

  const informasiActive = ['akreditasi', 'peserta-didik', 'e-rapor'].includes(active);
  const informasiCls = informasiActive ? 'bg-slate-700 text-white' : 'text-white hover:bg-slate-700';

  document.getElementById('navbar-root').innerHTML = `
    <nav class="bg-slate-900 border-b-4 border-blue-500 shadow no-print sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 flex items-center h-16">
        <a href="index.html" class="flex items-center gap-3 mr-6">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 via-green-500 to-green-700 flex items-center justify-center text-[10px] font-bold text-white shadow ring-2 ring-yellow-400">SMD</div>
        </a>
        <div class="hidden md:flex items-center gap-1">
          ${item('index.html', 'Beranda', 'beranda')}
          <div class="relative" id="dropdown-wrap">
            <button id="dropdown-btn" class="px-4 py-2 rounded text-sm font-medium transition-colors ${informasiCls}">
              Informasi <span class="ml-1 text-xs">▼</span>
            </button>
            <div id="dropdown-menu" class="hidden absolute left-0 mt-1 w-72 bg-white rounded-md shadow-lg ring-1 ring-black/5 z-50 overflow-hidden">
              ${subItem('akreditasi.html', 'Data Akreditasi')}
              ${subItem('peserta-didik.html', 'Data Peserta Didik SPMB ATS/APS')}
              ${subItem('e-rapor.html', 'Data E-Rapor 8 SNP SKB/PKBM')}
            </div>
          </div>
          ${item('keterangan.html', 'Keterangan', 'keterangan')}
        </div>
        <button id="mobile-toggle" class="md:hidden ml-auto text-white p-2" aria-label="Menu">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>
      <div id="mobile-menu" class="hidden md:hidden bg-slate-800 border-t border-slate-700">
        <div class="px-4 py-3 flex flex-col gap-1">
          <a href="index.html" class="px-3 py-2 rounded text-white hover:bg-slate-700 text-sm">Beranda</a>
          <div class="px-3 py-1 text-xs text-slate-400 uppercase mt-2">Informasi</div>
          <a href="akreditasi.html" class="px-3 py-2 rounded text-white hover:bg-slate-700 text-sm">Data Akreditasi</a>
          <a href="peserta-didik.html" class="px-3 py-2 rounded text-white hover:bg-slate-700 text-sm">Data Peserta Didik SPMB ATS/APS</a>
          <a href="e-rapor.html" class="px-3 py-2 rounded text-white hover:bg-slate-700 text-sm">Data E-Rapor 8 SNP SKB/PKBM</a>
          <a href="keterangan.html" class="px-3 py-2 rounded text-white hover:bg-slate-700 text-sm">Keterangan</a>
        </div>
      </div>
    </nav>
  `;

  // Dropdown behavior
  const btn = document.getElementById('dropdown-btn');
  const menu = document.getElementById('dropdown-menu');
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('hidden');
  });
  document.addEventListener('click', (e) => {
    if (!document.getElementById('dropdown-wrap').contains(e.target)) {
      menu.classList.add('hidden');
    }
  });
  document.getElementById('mobile-toggle').addEventListener('click', () => {
    document.getElementById('mobile-menu').classList.toggle('hidden');
  });
}

function renderFooter() {
  document.getElementById('footer-root').innerHTML = `
    <footer class="border-t border-slate-200 bg-white mt-12 py-6 text-center text-sm text-slate-500 no-print">
      © 2026 Dinas Pendidikan Kabupaten Sumedang
    </footer>
  `;
}

function kpiCard(label, value, color) {
  return `
    <div class="bg-white rounded-lg shadow p-5">
      <div class="w-10 h-1 ${color} rounded mb-3"></div>
      <div class="text-3xl font-bold text-slate-800">${value}</div>
      <div class="text-xs text-slate-500 mt-1">${label}</div>
    </div>
  `;
}

/* ===== MODAL ===== */
function openModal(title, bodyHtml, onMount) {
  closeModal();
  const wrap = document.createElement('div');
  wrap.className = 'modal-overlay';
  wrap.id = 'app-modal';
  wrap.innerHTML = `
    <div class="modal-box">
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
        <h3 class="text-lg font-semibold text-slate-800">${title}</h3>
        <button id="modal-close-x" class="text-slate-400 hover:text-slate-700 text-2xl leading-none" aria-label="Tutup">×</button>
      </div>
      <div class="p-6" id="modal-body">${bodyHtml}</div>
    </div>
  `;
  document.body.appendChild(wrap);
  document.body.style.overflow = 'hidden';
  document.getElementById('modal-close-x').addEventListener('click', closeModal);
  wrap.addEventListener('click', (e) => { if (e.target === wrap) closeModal(); });
  document.addEventListener('keydown', escClose);
  if (onMount) onMount(document.getElementById('modal-body'));
}
function closeModal() {
  const m = document.getElementById('app-modal');
  if (m) m.remove();
  document.body.style.overflow = '';
  document.removeEventListener('keydown', escClose);
}
function escClose(e) { if (e.key === 'Escape') closeModal(); }

/* ===== PRINT + PDF TOOLBAR ===== */
function renderToolbar(containerId, opts) {
  // opts: { onAdd, printTitle, pdf: { title, filename, columns, rows } }
  const root = document.getElementById(containerId);
  root.innerHTML = `
    <div class="flex flex-wrap items-center gap-2 no-print">
      <button id="btn-print" class="bg-slate-700 hover:bg-slate-800 text-white px-3 py-2 rounded text-sm font-medium shadow inline-flex items-center gap-1.5">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2m-12 0v4h12v-4M6 18h12"/></svg>
        Cetak
      </button>
      <button id="btn-pdf" class="bg-rose-600 hover:bg-rose-700 text-white px-3 py-2 rounded text-sm font-medium shadow inline-flex items-center gap-1.5">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"/></svg>
        Unduh PDF
      </button>
      <button id="btn-add" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium shadow inline-flex items-center gap-1.5">
        <span class="text-lg leading-none">+</span> Input Data
      </button>
    </div>
  `;
  document.getElementById('btn-add').addEventListener('click', opts.onAdd);
  document.getElementById('btn-print').addEventListener('click', () => {
    if (opts.printTitle) {
      const orig = document.title;
      document.title = opts.printTitle;
      window.print();
      setTimeout(() => { document.title = orig; }, 500);
    } else { window.print(); }
  });
  document.getElementById('btn-pdf').addEventListener('click', () => downloadPdf(opts.pdf));
}

function downloadPdf({ title, filename, columns, rows }) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('DINAS PENDIDIKAN KABUPATEN SUMEDANG', pageWidth / 2, 32, { align: 'center' });

  doc.setFontSize(11);
  doc.text(title, pageWidth / 2, 50, { align: 'center' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Dicetak: ' + new Date().toLocaleString('id-ID'), pageWidth - 40, 66, { align: 'right' });

  doc.autoTable({
    startY: 80,
    head: [columns.map(c => c.header)],
    body: rows.map(r => columns.map(c => String(r[c.dataKey] ?? ''))),
    styles: { fontSize: 8, cellPadding: 4, valign: 'middle' },
    headStyles: { fillColor: [30, 64, 175], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    margin: { left: 24, right: 24 },
  });

  doc.save(filename);
}

/* ===== ACTION BUTTONS HTML ===== */
function actionButtonsHtml(id, kindRef) {
  // kindRef: 'akreditasi' | 'peserta' | 'erapor' (used to attach click handlers via data-attribute)
  return `
    <div class="flex gap-1.5">
      <button data-action="edit" data-id="${id}" data-kind="${kindRef}" class="px-2 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium inline-flex items-center gap-1" title="Edit">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        Edit
      </button>
      <button data-action="delete" data-id="${id}" data-kind="${kindRef}" class="px-2 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium inline-flex items-center gap-1" title="Hapus">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/></svg>
        Hapus
      </button>
    </div>
  `;
}

/* helper: escape HTML */
function esc(v) {
  if (v === undefined || v === null) return '';
  return String(v).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}
