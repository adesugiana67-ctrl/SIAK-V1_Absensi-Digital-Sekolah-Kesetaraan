/* SVG charts for the Beranda dashboard */

function renderAkreditasiChart(data) {
  const entries = Object.entries(data);
  const max = Math.max(1, ...entries.map(([, v]) => v));
  const colors = { A: '#10b981', B: '#3b82f6', C: '#f59e0b', TT: '#ef4444', Belum: '#94a3b8' };
  const W = 480, H = 240, padL = 36, padB = 32, padT = 12, padR = 12;
  const chartW = W - padL - padR, chartH = H - padT - padB;
  const barW = chartW / entries.length - 16;

  let svg = `<svg viewBox="0 0 ${W} ${H}" class="w-full h-auto">`;
  [0, 0.25, 0.5, 0.75, 1].forEach(t => {
    const y = padT + chartH - chartH * t;
    svg += `<line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" stroke="#e2e8f0"/>`;
    svg += `<text x="${padL - 6}" y="${y + 4}" font-size="10" text-anchor="end" fill="#64748b">${Math.round(max * t)}</text>`;
  });
  entries.forEach(([k, v], i) => {
    const x = padL + (chartW / entries.length) * i + 8;
    const h = (v / max) * chartH;
    const y = padT + chartH - h;
    const color = colors[k] || '#3b82f6';
    svg += `<rect x="${x}" y="${y}" width="${barW}" height="${h}" fill="${color}" rx="4"/>`;
    svg += `<text x="${x + barW / 2}" y="${y - 4}" font-size="11" text-anchor="middle" fill="#334155" font-weight="bold">${v}</text>`;
    svg += `<text x="${x + barW / 2}" y="${H - padB + 16}" font-size="11" text-anchor="middle" fill="#475569">${k}</text>`;
  });
  svg += `</svg>`;

  const legend = entries.map(([k]) =>
    `<div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded" style="background-color:${colors[k] || '#3b82f6'}"></span><span class="text-slate-600">Akreditasi ${k}</span></div>`
  ).join('');
  return `<div class="w-full">${svg}<div class="flex flex-wrap gap-3 mt-3 text-xs">${legend}</div></div>`;
}

function renderPesertaChart({ laki, perempuan, sudah, belum }) {
  const total = laki + perempuan;
  const totalV = sudah + belum;
  return `
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      ${donut('Komposisi Gender', [
        { label: 'Laki-laki', value: laki, color: '#3b82f6' },
        { label: 'Perempuan', value: perempuan, color: '#ec4899' },
      ], total)}
      ${donut('Status Verval', [
        { label: 'Sudah', value: sudah, color: '#10b981' },
        { label: 'Belum', value: belum, color: '#f59e0b' },
      ], totalV)}
    </div>
  `;
}

function donut(title, slices, total) {
  const R = 60, r = 38;
  const C = 2 * Math.PI * R;
  let acc = 0;
  const safe = total === 0 ? 1 : total;
  let svg = `<svg viewBox="0 0 160 160" class="w-40 h-40" style="transform:rotate(-90deg)">`;
  svg += `<circle cx="80" cy="80" r="${R}" fill="none" stroke="#f1f5f9" stroke-width="${R - r}"/>`;
  slices.forEach(s => {
    const len = (s.value / safe) * C;
    const offset = -acc;
    acc += len;
    svg += `<circle cx="80" cy="80" r="${R}" fill="none" stroke="${s.color}" stroke-width="${R - r}" stroke-dasharray="${len} ${C - len}" stroke-dashoffset="${offset}"/>`;
  });
  svg += `<text x="80" y="84" text-anchor="middle" font-size="20" font-weight="bold" fill="#1e293b" transform="rotate(90 80 80)">${total}</text>`;
  svg += `</svg>`;

  const legend = slices.map(s =>
    `<div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded" style="background-color:${s.color}"></span><span class="text-slate-600">${s.label} <strong>${s.value}</strong></span></div>`
  ).join('');

  return `
    <div class="flex flex-col items-center">
      <h4 class="text-sm font-medium text-slate-700 mb-2">${title}</h4>
      ${svg}
      <div class="flex flex-wrap gap-3 mt-2 justify-center text-xs">${legend}</div>
    </div>
  `;
}

function renderERaporChart(data) {
  const entries = Object.entries(data);
  const W = 720, H = 280, padL = 44, padB = 50, padT = 16, padR = 16;
  const chartW = W - padL - padR, chartH = H - padT - padB;
  const barW = chartW / entries.length - 14;
  const colorFor = v => v >= 80 ? '#10b981' : v >= 60 ? '#f59e0b' : v >= 40 ? '#fbbf24' : '#ef4444';

  let svg = `<svg viewBox="0 0 ${W} ${H}" class="w-full h-auto">`;
  [0, 25, 50, 75, 100].forEach(t => {
    const y = padT + chartH - (chartH * t) / 100;
    svg += `<line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" stroke="#e2e8f0"/>`;
    svg += `<text x="${padL - 6}" y="${y + 4}" font-size="10" text-anchor="end" fill="#64748b">${t}%</text>`;
  });
  entries.forEach(([k, v], i) => {
    const x = padL + (chartW / entries.length) * i + 7;
    const h = (v / 100) * chartH;
    const y = padT + chartH - h;
    svg += `<rect x="${x}" y="${y}" width="${barW}" height="${h}" fill="${colorFor(v)}" rx="3"/>`;
    svg += `<text x="${x + barW / 2}" y="${y - 4}" font-size="10" text-anchor="middle" fill="#334155" font-weight="bold">${v}%</text>`;
    svg += `<text x="${x + barW / 2}" y="${H - padB + 14}" font-size="10" text-anchor="middle" fill="#475569">${k}</text>`;
  });
  svg += `</svg>`;

  const legendItem = (color, label) =>
    `<div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded" style="background-color:${color}"></span><span class="text-slate-600">${label}</span></div>`;
  return `<div class="w-full">${svg}<div class="flex flex-wrap gap-3 mt-3 text-xs">${legendItem('#10b981', 'Baik (≥80%)')}${legendItem('#f59e0b', 'Cukup (60-79%)')}${legendItem('#fbbf24', 'Sedang (40-59%)')}${legendItem('#ef4444', 'Kurang (<40%)')}</div></div>`;
}
