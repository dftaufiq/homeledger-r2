// NestLedger tools — five calculators that run on the household's own
// numbers. Each reads its inputs from the page, computes live, and shows its
// working so a reader can check it by hand.

export function money(n) {
  return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function val(id, fallback) {
  const el = document.getElementById(id);
  const n = el ? parseFloat(el.value) : NaN;
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

// 50/30/20 on any take-home pay. Defaults to the Bennetts' $7,420.
export function calcSplit() {
  const pay = val('split-pay', 7420);
  const needs = pay * 0.5, wants = pay * 0.3, save = pay * 0.2;
  const out = document.getElementById('split-out');
  if (!out) return;
  out.innerHTML = `<div class="calc-row"><span>Needs — 50%</span><b>${money(needs)}</b></div>`
    + `<div class="calc-row"><span>Wants — 30%</span><b>${money(wants)}</b></div>`
    + `<div class="calc-row"><span>Savings — 20%</span><b>${money(save)}</b></div>`
    + `<p class="calc-note">The Bennetts actually save 33.7% ($2,500 of $7,420) — 13.7 points above the 20% rule. Their November needs ran $4,027.60, wants $772.40 — and they gave $120 on top.</p>`;
}

// Debt payoff: months + interest on a balance at an APR and a monthly payment.
// Defaults to the household's Visa: $486 at 24.99% APR.
export function calcDebt() {
  const bal = val('debt-bal', 486), apr = val('debt-apr', 24.99), pay = val('debt-pay', 250);
  const out = document.getElementById('debt-out');
  if (!out) return;
  const r = apr / 100 / 12;
  if (pay <= bal * r) {
    out.innerHTML = `<p class="calc-note warn">That payment never covers the interest — raise it above ${money(bal * r)} a month.</p>`;
    return;
  }
  let b = bal, months = 0, interest = 0;
  while (b > 0 && months < 600) {
    const i = b * r; interest += i; b += i - Math.min(pay, b + i); months++;
  }
  const altPay = 400;
  let b2 = bal, m2 = 0, i2 = 0;
  while (b2 > 0 && m2 < 600) { const x = b2 * r; i2 += x; b2 += x - Math.min(altPay, b2 + x); m2++; }
  out.innerHTML = `<div class="calc-row"><span>Debt-free in</span><b>${months} months</b></div>`
    + `<div class="calc-row"><span>Interest paid</span><b>${money(interest)}</b></div>`
    + `<div class="calc-row"><span>Total paid</span><b>${money(bal + interest)}</b></div>`
    + `<p class="calc-note">At $400 a month instead: ${m2} months and ${money(i2)} interest — ${money(interest - i2)} less interest. The Bennetts pay $250/mo and clear the Visa in ${months} months.</p>`;
}

// Emergency fund: months to reach a target at a monthly contribution.
export function calcEmergency() {
  const have = val('em-have', 9200), target = val('em-target', 12000), per = val('em-per', 300);
  const out = document.getElementById('em-out');
  if (!out) return;
  if (target <= have) { out.innerHTML = `<p class="calc-note">Already there — ${money(have)} covers the ${money(target)} target.</p>`; return; }
  if (per <= 0) { out.innerHTML = `<p class="calc-note warn">Set a monthly amount above $0.</p>`; return; }
  const months = Math.ceil((target - have) / per);
  const done = new Date(2026, 10 + months, 1);
  const name = done.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  out.innerHTML = `<div class="calc-row"><span>Gap to close</span><b>${money(target - have)}</b></div>`
    + `<div class="calc-row"><span>Months at ${money(per)}/mo</span><b>${months} months</b></div>`
    + `<div class="calc-row"><span>Fully funded</span><b>${name}</b></div>`
    + `<p class="calc-note">The Bennetts hold $9,200 of a $12,000 goal — 4.6 months of essentials. At $300/mo they close the gap in ${Math.ceil((12000 - 9200) / 300)} months.</p>`;
}

// Subscription audit: tick the ones to cut and see the yearly saving.
// Defaults match the November ledger: Hulu, Audible, Disney+ and the rest.
export function calcSubs() {
  const boxes = document.querySelectorAll('#subs-audit input[type="checkbox"]');
  let mo = 0, yr = 0, picked = [];
  boxes.forEach((b) => {
    if (b.checked) { mo += parseFloat(b.dataset.monthly); picked.push(b.dataset.name); }
  });
  yr = mo * 12;
  const out = document.getElementById('subs-out');
  if (!out) return;
  out.innerHTML = `<div class="calc-row"><span>Cutting ${picked.length ? picked.join(', ') : 'nothing'}</span><b>${money(mo)}/mo</b></div>`
    + `<div class="calc-row"><span>Saved per year</span><b>${money(yr)}</b></div>`
    + `<p class="calc-note">The audit on the Money Leaks page found $1,147/yr: Hulu $187.20, Audible $179.40, Disney+ downgrade $72, one takeout night $420, requoted car insurance $288.</p>`;
}

// Paycheck planner: split the next paycheck zero-based across envelopes.
// Defaults: Jordan's Dec 4 paycheck, $1,970.
export function calcPaycheck() {
  const pay = val('pay-amount', 1970);
  const rent = val('pay-housing', 842.50), food = val('pay-groceries', 324), trans = val('pay-transport', 256);
  const kids = val('pay-kids', 194.50), util = val('pay-utilities', 170.50), fun = val('pay-fun', 89), save = val('pay-save', 93.50);
  const total = rent + food + trans + kids + util + fun + save;
  const left = pay - total;
  const out = document.getElementById('pay-out');
  if (!out) return;
  const rows = [
    ['Housing', rent], ['Groceries', food], ['Transport', trans], ['Kids & school', kids],
    ['Utilities', util], ['Fun', fun], ['Savings', save],
  ].map(([n, v]) => `<div class="calc-row"><span>${n}</span><b>${money(v)}</b></div>`).join('');
  out.innerHTML = rows
    + `<div class="calc-row total"><span>Assigned</span><b>${money(total)}</b></div>`
    + `<div class="calc-row total"><span>Left to assign</span><b class="${left === 0 ? 'ok' : 'warn'}">${money(left)}</b></div>`
    + `<p class="calc-note">${left === 0 ? 'Zero-based: every dollar has a job before payday.' : left > 0 ? `Give the remaining ${money(left)} a job — send it to the vacation fund.` : `Over by ${money(-left)} — trim groceries or fun first.`}</p>`;
}

export function bindTools() {
  document.querySelectorAll('[data-calc]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const fn = { split: calcSplit, debt: calcDebt, emergency: calcEmergency, subs: calcSubs, paycheck: calcPaycheck }[btn.dataset.calc];
      if (fn) fn();
    });
  });
  document.querySelectorAll('#subs-audit input[type="checkbox"]').forEach((b) => b.addEventListener('change', calcSubs));
  calcSubs();
}
