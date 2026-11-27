// NestLedger charts — hand-rolled SVG, no library. Every chart is drawn from
// the same figures in data.js, so a chart can never disagree with the ledger.

export function donut(cats, total, size = 140) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 14, inner = r - 30;
  let a0 = -Math.PI / 2, paths = '';
  for (const c of cats) {
    if (c.actual <= 0) continue;
    const a1 = a0 + (c.actual / total) * Math.PI * 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1), yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0), yi0 = cy + inner * Math.sin(a0);
    paths += `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${xi1.toFixed(1)} ${yi1.toFixed(1)} A ${inner} ${inner} 0 ${large} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z" fill="${c.color}"><title>${c.name}: $${c.actual.toFixed(2)}</title></path>`;
    a0 = a1;
  }
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Donut chart of November spending by category">${paths}<text x="${cx}" y="${cy - 4}" text-anchor="middle" class="donut-total">$${total.toLocaleString('en-US')}</text><text x="${cx}" y="${cy + 16}" text-anchor="middle" class="donut-label">spent in Nov</text></svg>`;
}

export function monthBars(months, width = 560, height = 100) {
  const max = Math.max(...months.map((m) => m.spent));
  const bw = Math.floor(width / months.length) - 10;
  let bars = '', labels = '', values = '';
  months.forEach((m, i) => {
    const h = Math.max(4, Math.round((m.spent / max) * (height - 42)));
    const x = i * (bw + 10) + 5, y = height - 22 - h;
    const cur = i === months.length - 1;
    bars += `<rect x="${x}" y="${y}" width="${bw}" height="${h}" rx="3" fill="${cur ? '#d97706' : '#1f4e79'}"><title>${m.m}: spent $${m.spent.toLocaleString('en-US')}, saved $${(m.income - m.spent).toLocaleString('en-US')}</title></rect>`;
    values += `<text x="${x + bw / 2}" y="${y - 5}" text-anchor="middle" class="bar-value">$${m.spent.toLocaleString('en-US')}</text>`;
    labels += `<text x="${x + bw / 2}" y="${height - 6}" text-anchor="middle" class="bar-label">${m.m}</text>`;
  });
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" height="${height}" role="img" aria-label="Bar chart of monthly spending, January to November 2026">${bars}${values}${labels}</svg>`;
}

export function savingsLine(months, width = 560, height = 80) {
  const rates = months.map((m) => ((m.income - m.spent) / m.income) * 100);
  const min = Math.floor(Math.min(...rates) / 5) * 5, max = Math.ceil(Math.max(...rates) / 5) * 5;
  const px = (i) => 8 + (i * (width - 16)) / (months.length - 1);
  const py = (v) => 12 + ((max - v) / (max - min)) * (height - 34);
  const pts = rates.map((v, i) => `${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(' ');
  const area = `8,${height - 22} ${pts} ${px(months.length - 1).toFixed(1)},${height - 22}`;
  let dots = '', labs = '';
  rates.forEach((v, i) => {
    dots += `<circle cx="${px(i).toFixed(1)}" cy="${py(v).toFixed(1)}" r="3.5" fill="#0e7490"><title>${months[i].m}: ${v.toFixed(1)}% saved</title></circle>`;
    labs += `<text x="${px(i).toFixed(1)}" y="${height - 6}" text-anchor="middle" class="bar-label">${months[i].m}</text>`;
  });
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" height="${height}" role="img" aria-label="Line chart of the monthly savings rate, January to November 2026"><polygon points="${area}" fill="#0e7490" opacity="0.12"/><polyline points="${pts}" fill="none" stroke="#0e7490" stroke-width="2.5" stroke-linejoin="round"/><text x="8" y="10" class="bar-value" text-anchor="start">${max}%</text>${dots}${labs}</svg>`;
}

export function netWorthBars(trend, width = 560, height = 140) {
  const max = Math.max(...trend.map((t) => t.value));
  const bw = Math.floor(width / trend.length) - 14;
  let bars = '', values = '', labels = '';
  trend.forEach((t, i) => {
    const h = Math.max(4, Math.round((t.value / max) * (height - 44)));
    const x = i * (bw + 14) + 7, y = height - 22 - h;
    bars += `<rect x="${x}" y="${y}" width="${bw}" height="${h}" rx="3" fill="#1f4e79"><title>${t.m}: net worth $${t.value.toLocaleString('en-US')}</title></rect>`;
    values += `<text x="${x + bw / 2}" y="${y - 5}" text-anchor="middle" class="bar-value">$${(t.value / 1000).toFixed(1)}k</text>`;
    labels += `<text x="${x + bw / 2}" y="${height - 6}" text-anchor="middle" class="bar-label">${t.m}</text>`;
  });
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" height="${height}" role="img" aria-label="Bar chart of net worth, June to November 2026">${bars}${values}${labels}</svg>`;
}

// November 2026 cashflow calendar. Nov 1 2026 is a Sunday. Daily totals come
// from the ledger (expenses only); days 27–30 are still ahead and stay blank.
export function cashCalendar(daily, width = 560) {
  const cell = Math.floor((width - 6 * 4) / 7);
  const h = 6 * (cell + 4) + 24;
  const max = Math.max(...Object.values(daily), 1);
  const names = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  let head = '', cells = '';
  names.forEach((n, i) => { head += `<text x="${i * (cell + 4) + cell / 2}" y="14" text-anchor="middle" class="cal-head">${n}</text>`; });
  for (let d = 1; d <= 30; d++) {
    const col = (d - 1) % 7, row = Math.floor((d - 1) / 7);
    const x = col * (cell + 4), y = 22 + row * (cell + 4);
    const v = daily[d];
    const future = d > 26;
    const fill = future ? '#eef1f4' : v == null ? '#f7f5f0' : v >= 1000 ? '#7f1d1d' : v >= 150 ? '#c05621' : v >= 50 ? '#d97706' : '#dbe7dd';
    const ink = future ? '#9aa5b1' : v != null && v >= 150 ? '#ffffff' : '#1f2937';
    const amt = v == null ? '' : v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${Math.round(v)}`;
    cells += `<g><rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="4" fill="${fill}"><title>Nov ${d}: ${v == null ? (future ? 'not yet' : 'no spending') : '$' + v.toFixed(2) + ' spent'}</title></rect><text x="${x + 5}" y="${y + 13}" class="cal-day" fill="${ink}">${d}</text>${amt ? `<text x="${x + cell - 4}" y="${y + cell - 5}" text-anchor="end" class="cal-amt" fill="${ink}">${amt}</text>` : ''}</g>`;
  }
  return `<svg viewBox="0 0 ${width} ${h}" width="100%" height="${h}" role="img" aria-label="November 2026 calendar with daily spending">${head}${cells}</svg>`;
}

export function progressBar(pct, color = '#1f4e79') {
  const p = Math.max(0, Math.min(100, pct));
  return `<span class="pbar"><span class="pfill" style="width:${p.toFixed(1)}%;background:${color}"></span></span>`;
}
