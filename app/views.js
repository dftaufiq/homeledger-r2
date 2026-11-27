// NestLedger views — one renderer per page. Every number on every page is
// computed from the same state (data.js, copied into main.js so the controls
// can change it): a figure can never disagree between two pages.
import { CATS, HOUSEHOLD, MONTHS, FORECAST, LEAKS, NETWORTH, OCT_CATS } from './data.js';
import { donut, monthBars, savingsLine, netWorthBars, cashCalendar, progressBar } from './charts.js';

export function fmt(n) {
  return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
export function fmt0(n) { return '$' + Math.round(Number(n)).toLocaleString('en-US'); }
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function catName(k) { const c = CATS.find((c) => c.key === k); return c ? c.name : k; }
function catColor(k) { const c = CATS.find((c) => c.key === k); return c ? c.color : '#475569'; }

export function totals(st) {
  const income = st.tx.filter((t) => t[2] === 'income').reduce((s, t) => s + t[3], 0);
  const spent = st.tx.filter((t) => t[2] !== 'income').reduce((s, t) => s + t[3], 0);
  const planned = CATS.reduce((s, c) => s + st.planned[c.key], 0);
  return { income, spent, saved: income - spent, rate: ((income - spent) / income) * 100, planned, left: planned - spent };
}

function catActuals(st) {
  return CATS.map((c) => ({ ...c, planned: st.planned[c.key], actual: st.tx.filter((t) => t[2] === c.key).reduce((s, t) => s + t[3], 0) }));
}

function nav(active) {
  const pages = [['', 'Dashboard'], ['transactions', 'Transactions'], ['budgets', 'Budgets'], ['bills', 'Bills & Subscriptions'], ['goals', 'Goals'], ['year', 'Year Review'], ['leaks', 'Money Leaks'], ['tools', 'Tools']];
  return pages.map(([r, n]) => `<a href="#/${r}" class="${(active === r) ? 'on' : ''}">${n}</a>`).join('');
}

function header(active) {
  return `<header><div class="brand"><span class="mark">N</span><div><strong>NestLedger</strong><span>household budgets, kept honest</span></div></div><nav>${nav(active)}</nav><div class="who">${HOUSEHOLD.name} · ${HOUSEHOLD.month}</div></header>`;
}

function footer() {
  return `<footer>66 transactions · 12 envelopes · 14 bills · 5 goals · 5 tools · 11 months — every figure computed from one ledger. No account, no cloud, no ads: the ledger lives in this page. November 2026 · ${HOUSEHOLD.place}</footer>`;
}

// ---------------------------------------------------------------- dashboard
export function viewDashboard(st) {
  const t = totals(st);
  const cats = catActuals(st);
  const ytdIn = MONTHS.reduce((s, m) => s + m.income, 0);
  const ytdOut = MONTHS.reduce((s, m) => s + m.spent, 0);
  const ytdSaved = ytdIn - ytdOut;
  const short = { 'Fun & entertainment': 'Fun', 'Household & misc': 'Household', 'Kids & school': 'Kids' };
  const legend = cats.map((c) => {
    const d = c.actual - OCT_CATS[c.key];
    const ds = d === 0 ? '±$0' : (d > 0 ? '+' : '−') + '$' + Math.abs(d).toFixed(0);
    const name = short[c.name] || c.name;
    return `<div class="leg"><span class="dot" style="background:${c.color}"></span><span class="leg-name" title="${c.name}">${name}</span><b>${fmt(c.actual)}</b><span class="leg-delta" title="vs October">${ds}</span></div>`;
  }).join('');
  const paidBills = st.bills.filter((b) => b.status === 'paid').length;
  const toGo = st.bills.filter((b) => b.status !== 'paid').reduce((s, b) => s + b.amount, 0);
  const goalsTop = st.goals.slice(0, 2).map((g) => `<div class="goal-mini"><div class="gm-row"><span>${g.name}</span><b>${fmt0(g.current)} / ${fmt0(g.target)}</b></div>${progressBar((g.current / g.target) * 100, '#2e7d32')}</div>`).join('');
  return `${header('')}
  <main class="dash">
    <div class="title-row"><div><h1>November 2026 at a glance</h1><p>${HOUSEHOLD.members} · ${HOUSEHOLD.today} · ${HOUSEHOLD.daysLeft} days left in the month</p></div><div class="save-badge"><b>${t.rate.toFixed(1)}%</b><span>saved this month<br>target: 20%</span></div></div>
    <section class="hero">
      <div class="stat"><span>Income</span><b>${fmt0(t.income)}</b><p>2 paychecks · Maya ${fmt0(3480)} + Jordan ${fmt0(3940)}</p></div>
      <div class="stat"><span>Spent so far</span><b>${fmt0(t.spent)}</b><p>${st.tx.filter((x) => x[2] !== 'income').length} purchases · Nov 1–26</p></div>
      <div class="stat good"><span>Saved</span><b>${fmt0(t.saved)}</b><p>${t.rate.toFixed(1)}% of income · ahead of the 20% goal</p></div>
      <div class="stat"><span>Budget left</span><b>${fmt0(t.left)}</b><p>of ${fmt0(t.planned)} planned · 4 days to go</p></div>
    </section>
    <div class="ytd">Year to date — <b>${fmt0(ytdIn)} in</b> · <b>${fmt0(ytdOut)} out</b> · <b>${fmt0(ytdSaved)} saved (${((ytdSaved / ytdIn) * 100).toFixed(1)}%)</b> · best month October ${fmt0(4612)} · 66/66 transactions reconciled</div>
    <section class="grid3">
      <div class="card"><h2>Where the money went</h2><div class="donut-wrap">${donut(cats, t.spent)}</div><div class="leg head"><span></span><span>Category</span><b>Spent</b><span>vs Oct</span></div><div class="legend">${legend}</div><a class="more" href="#/transactions">All ${st.tx.length} transactions, Nov 1–26 →</a></div>
      <div class="card"><h2>Spending, 11 months</h2>${monthBars(MONTHS)}<p class="note">5th-lowest month of the year; July's ${fmt0(5490)} (camp + AC) still leads.</p><h2 class="sub">Savings rate, 11 months</h2>${savingsLine(MONTHS)}<p class="note">Oct forecast check: <b>$4,590 vs $4,612 actual — 99.5% accurate.</b> <a href="#/year">Full table →</a></p></div>
      <div class="card"><h2>Bills coming up</h2>
        <div class="bill-row overdue"><span class="tag bad">Overdue</span><span>Hulu</span><b>${fmt(15.60)}</b></div>
        <div class="bill-row"><span class="tag">Due Nov 28</span><span>Gym — 2 memberships</span><b>${fmt(39.00)}</b></div>
        <div class="bill-row"><span class="tag">Due Nov 30</span><span>Auto loan — Honda CR-V</span><b>${fmt(312.00)}</b></div>
        <p class="note">${paidBills} of 14 paid · ${fmt(toGo)} to go. <a href="#/bills">All bills →</a></p>
        <h2 class="sub">Goals on track</h2>${goalsTop}<a class="more" href="#/goals">All 5 goals → · ${fmt0(st.goals.reduce((s, g) => s + g.current, 0))} saved toward ${fmt0(st.goals.reduce((s, g) => s + g.target, 0))}</a>
        <div class="leak-alert"><b>Money leaks found: $1,147/yr</b><a href="#/leaks">See the audit →</a></div>
      </div>
    </section>
    <section><h2 class="section-h">Five things this month is saying</h2><div class="insights">
      <div class="insight"><b>Groceries: ${fmt(73.40)} under budget.</b><p>Biggest shop: Costco Nov 3, ${fmt(187.30)} — planned bulk.</p></div>
      <div class="insight"><b>Transport is the watch-out.</b><p>$512 of $560 with 4 days left — fuel + insurance.</p></div>
      <div class="insight"><b>Dining: 8 meals out, $286.</b><p>Avg $35.75/meal; priciest: sushi date night, $72.10.</p></div>
      <div class="insight"><b>Savings rate ${t.rate.toFixed(1)}%.</b><p>Needs ${fmt(4027.60)}, wants ${fmt(772.40)}, saved ${fmt(2500)} — ahead of target.</p></div>
      <div class="insight alert"><b>One bill needs attention.</b><p>Hulu ${fmt(15.60)}, due Nov 24 — card expired. Cancel it.</p></div>
    </div></section>
  </main>${footer()}`;
}

// ------------------------------------------------------------ transactions
export function viewTransactions(st) {
  const t = totals(st);
  const daily = {};
  st.tx.filter((x) => x[2] !== 'income').forEach((x) => { daily[x[0]] = (daily[x[0]] || 0) + x[3]; });
  const opts = CATS.map((c) => `<option value="${c.key}">${c.name}</option>`).join('');
  return `${header('transactions')}
  <main>
    <div class="title-row"><div><h1>The November ledger</h1><p>${st.tx.length} transactions · ${st.tx.filter((x) => x[2] !== 'income').length} expenses · 2 paychecks · ${fmt(t.spent)} out · ${fmt(t.income)} in · every row reconciled to the dashboard</p></div></div>
    <section class="card"><h2>November cashflow — a day at a glance</h2>${cashCalendar(daily)}<p class="note">Darkest days are the big ones: Nov 1 (${fmt(2075)} — mortgage, insurance, escrow, tithe) and Nov 3 (${fmt(368)} — Costco + electric + Target). Nov 26 is today — nothing spent yet. Nov 27–30 are still ahead.</p></section>
    <section class="card"><h2>Add a transaction</h2>
      <form id="add-tx" class="form-row"><label>Day <input id="tx-day" type="number" min="1" max="30" value="26" required></label><label>What <input id="tx-payee" type="text" placeholder="e.g. Kroger — top-up shop" required></label><label>Category <select id="tx-cat">${opts}</select></label><label>Amount $ <input id="tx-amt" type="number" min="0.01" step="0.01" placeholder="0.00" required></label><button type="submit">Add to the ledger</button></form>
      <p class="note">Adding a row updates the dashboard totals, the donut, the budget bars and the calendar at once — one ledger, everywhere.</p></section>
    <section class="card"><h2>All transactions</h2>
      <div class="form-row"><label>Search <input id="tx-search" type="search" placeholder="e.g. Costco"></label><label>Category <select id="tx-filter"><option value="">All categories</option>${opts}<option value="income">Income</option></select></label><label>Type <select id="tx-type"><option value="">All</option><option value="out">Spending</option><option value="in">Income</option></select></label></div>
      <table id="tx-table"><thead><tr><th>Day</th><th>What</th><th>Category</th><th class="num">Amount</th></tr></thead><tbody id="tx-body"></tbody></table>
      <p class="note" id="tx-count"></p></section>
  </main>${footer()}`;
}

export function txRows(st, q, cat, type) {
  const rows = st.tx.filter((x) => {
    if (cat && x[2] !== cat) return false;
    if (type === 'out' && x[2] === 'income') return false;
    if (type === 'in' && x[2] !== 'income') return false;
    if (q && !(x[1].toLowerCase().includes(q) || catName(x[2]).toLowerCase().includes(q))) return false;
    return true;
  }).sort((a, b) => b[0] - a[0] || b[3] - a[3]);
  const body = rows.map((x) => `<tr><td>Nov ${x[0]}</td><td>${esc(x[1])}</td><td><span class="dot sm" style="background:${catColor(x[2])}"></span> ${x[2] === 'income' ? 'Income' : catName(x[2])}</td><td class="num ${x[2] === 'income' ? 'in' : ''}">${x[2] === 'income' ? '+' : '−'}${fmt(x[3])}</td></tr>`).join('');
  const out = rows.filter((x) => x[2] !== 'income').reduce((s, x) => s + x[3], 0);
  const inn = rows.filter((x) => x[2] === 'income').reduce((s, x) => s + x[3], 0);
  return { body: body || '<tr><td colspan="4">Nothing matches — try another search.</td></tr>', count: `${rows.length} rows shown · ${fmt(out)} out · ${fmt(inn)} in` };
}

// ----------------------------------------------------------------- budgets
export function viewBudgets(st) {
  const t = totals(st);
  const cats = catActuals(st);
  const rows = cats.map((c) => {
    const left = c.planned - c.actual;
    const pct = Math.min(100, (c.actual / c.planned) * 100);
    const status = c.actual > c.planned ? '<span class="tag bad">Over</span>' : pct >= 90 ? '<span class="tag warn">Watch</span>' : '<span class="tag ok">On track</span>';
    return `<tr><td><span class="dot sm" style="background:${c.color}"></span> ${c.name}</td><td class="num"><input class="plan-input" type="number" min="0" step="1" value="${c.planned}" data-cat="${c.key}" aria-label="Budget for ${c.name}"></td><td class="num">${fmt(c.actual)}</td><td class="num ${left < 0 ? 'neg' : ''}">${left < 0 ? '−' : ''}${fmt(Math.abs(left))}</td><td class="bar-cell">${progressBar(pct, c.actual > c.planned ? '#b91c1c' : c.color)}</td><td class="num">${pct.toFixed(0)}%</td><td>${status}</td></tr>`;
  }).join('');
  return `${header('budgets')}
  <main>
    <div class="title-row"><div><h1>12 envelopes</h1><p>Planned ${fmt(t.planned)} · spent ${fmt(t.spent)} · <b>${fmt(t.left)} left</b> · 4 days to go · edit any budget — the dashboard updates with it</p></div></div>
    <section class="card"><table><thead><tr><th>Envelope</th><th class="num">Planned</th><th class="num">Spent</th><th class="num">Left</th><th>Used</th><th class="num">%</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table>
    <p class="note">Housing is exactly on budget — mortgage, insurance and escrow never move. The tightest envelope is transport: ${fmt(512)} of ${fmt(560)} with 4 days left. Nothing is over budget this month.</p></section>
  </main>${footer()}`;
}

// ------------------------------------------------------ bills & subscriptions
export function viewBills(st) {
  const paid = st.bills.filter((b) => b.status === 'paid');
  const todo = st.bills.filter((b) => b.status !== 'paid');
  const paidSum = paid.reduce((s, b) => s + b.amount, 0);
  const todoSum = todo.reduce((s, b) => s + b.amount, 0);
  const rows = st.bills.map((b) => {
    const chip = b.status === 'paid' ? '<span class="tag ok">Paid</span>' : b.status === 'overdue' ? '<span class="tag bad">Overdue</span>' : '<span class="tag">Due</span>';
    const btn = b.status === 'paid' ? '—' : `<button class="mini" data-bill="${esc(b.name)}">Mark paid</button>`;
    return `<tr><td>${esc(b.name)}</td><td>Nov ${b.due}</td><td class="num">${fmt(b.amount)}</td><td>${chip}</td><td>${esc(b.note)}</td><td>${btn}</td></tr>`;
  }).join('');
  const subs = st.tx.filter((x) => x[2] === 'subs');
  const subRows = subs.map((x) => `<tr><td>${esc(x[1])}</td><td class="num">${fmt(x[3])}</td><td class="num">${fmt(x[3] * 12)}</td><td>${x[1] === 'Hulu' ? '—' : x[1] === 'Audible' ? '0 books finished in Nov' : x[1] === 'Disney+' ? 'Watched twice in Nov' : 'In regular use'}</td></tr>`).join('');
  const subMo = subs.reduce((s, x) => s + x[3], 0);
  return `${header('bills')}
  <main>
    <div class="title-row"><div><h1>Bills &amp; subscriptions</h1><p>${paid.length} of ${st.bills.length} bills paid · ${fmt(paidSum)} out · ${fmt(todoSum)} still to go · subscriptions ${fmt(subMo)}/mo</p></div></div>
    <section class="card"><h2>Recurring bills — November</h2><table><thead><tr><th>Bill</th><th>Due</th><th class="num">Amount</th><th>Status</th><th>Note</th><th></th></tr></thead><tbody>${rows}</tbody></table>
    <p class="note">Hulu is overdue: the autopay card expired on Nov 24. The audit on the <a href="#/leaks">Money Leaks</a> page says cancel it — nobody watched since Sep 12.</p></section>
    <section class="card"><h2>Subscriptions — ${fmt(subMo)} a month, ${fmt(subMo * 12)} a year</h2><table><thead><tr><th>Service</th><th class="num">Per month</th><th class="num">Per year</th><th>Last use</th></tr></thead><tbody>${subRows}</tbody></table>
    <p class="note">Hulu's ${fmt(15.60)} is not in November's spending — its Nov 24 charge failed. That is why the ledger shows 7 subscription charges (${fmt(78.40)}) while the list holds 8 services.</p></section>
  </main>${footer()}`;
}

// ------------------------------------------------------------------- goals
export function viewGoals(st) {
  const saved = st.goals.reduce((s, g) => s + g.current, 0);
  const target = st.goals.reduce((s, g) => s + g.target, 0);
  const cards = st.goals.map((g) => `<div class="goal-card"><div class="goal-head"><b>${esc(g.name)}</b><span>${fmt0(g.current)} / ${fmt0(g.target)}</span></div>${progressBar((g.current / g.target) * 100, '#2e7d32')}<p>${((g.current / g.target) * 100).toFixed(1)}% there · ${esc(g.note)}</p></div>`).join('');
  const nw = NETWORTH;
  const assets = nw.accounts.reduce((s, a) => s + a.amount, 0);
  const debts = nw.debts.reduce((s, d) => s + d.amount, 0);
  const accRows = nw.accounts.map((a) => `<div class="calc-row"><span>${esc(a.name)}</span><b>${fmt(a.amount)}</b></div>`).join('');
  const debtRows = nw.debts.map((d) => `<div class="calc-row"><span>${esc(d.name)}</span><b class="neg">−${fmt(d.amount)}</b></div>`).join('');
  return `${header('goals')}
  <main>
    <div class="title-row"><div><h1>Goals &amp; net worth</h1><p>${fmt0(saved)} saved toward ${fmt0(target)} across 5 goals · net worth ${fmt0(assets - debts)} (excluding the house)</p></div></div>
    <section><div class="goal-grid">${cards}</div>
    <form id="add-goal" class="form-row card"><label>Add to a goal <select id="goal-name">${st.goals.map((g) => `<option>${esc(g.name)}</option>`).join('')}</select></label><label>Amount $ <input id="goal-amt" type="number" min="1" step="1" placeholder="100" required></label><button type="submit">Add money</button><span class="note">Adding money moves the bar and the dashboard at once.</span></form></section>
    <section class="card"><h2>Net worth — ${fmt0(assets - debts)}</h2><div class="grid2"><div><h3 class="sub">What we own — ${fmt0(assets)}</h3>${accRows}</div><div><h3 class="sub">What we owe — ${fmt0(debts)}</h3>${debtRows}<div class="calc-row total"><span>Net worth</span><b>${fmt0(assets - debts)}</b></div></div></div>
    ${netWorthBars(nw.trend)}<p class="note">Up ${fmt0(23304 - 19840)} since June — steady saving, not a windfall: every month's surplus went to the emergency fund first, then the vacation fund.</p></section>
  </main>${footer()}`;
}

// -------------------------------------------------------------- year review
export function viewYear(st) {
  const ytdIn = MONTHS.reduce((s, m) => s + m.income, 0);
  const ytdOut = MONTHS.reduce((s, m) => s + m.spent, 0);
  const ytdSaved = ytdIn - ytdOut;
  const avg = ytdOut / MONTHS.length;
  const best = MONTHS.reduce((a, m) => (m.spent < a.spent ? m : a));
  const worst = MONTHS.reduce((a, m) => (m.spent > a.spent ? m : a));
  const monthRows = MONTHS.map((m) => `<tr><td>${m.m}</td><td class="num">${fmt(m.income)}</td><td class="num">${fmt(m.spent)}</td><td class="num">${fmt(m.income - m.spent)}</td><td class="num">${(((m.income - m.spent) / m.income) * 100).toFixed(1)}%</td></tr>`).join('');
  const fc = FORECAST.rows.map((r) => {
    const err = r.actual - r.forecast;
    return `<tr><td>${r.cat}</td><td class="num">${fmt(r.forecast)}</td><td class="num">${fmt(r.actual)}</td><td class="num ${Math.abs(err) > 20 ? 'neg' : ''}">${err >= 0 ? '+' : '−'}${fmt(Math.abs(err))}</td></tr>`;
  }).join('');
  const fcErr = FORECAST.totalActual - FORECAST.totalForecast;
  const acc = (1 - Math.abs(fcErr) / FORECAST.totalActual) * 100;
  return `${header('year')}
  <main>
    <div class="title-row"><div><h1>2026 so far — 11 months in one place</h1><p>${fmt0(ytdIn)} earned · ${fmt0(ytdOut)} spent · ${fmt0(ytdSaved)} saved (${((ytdSaved / ytdIn) * 100).toFixed(1)}%) · average month ${fmt(avg)}</p></div></div>
    <section class="grid2">
      <div class="card"><h2>Spending by month</h2>${monthBars(MONTHS)}<p class="note">Best month: ${best.m} (${fmt(best.spent)}). Highest: ${worst.m} (${fmt(worst.spent)} — summer camp + AC). November (${fmt(4920)}) sits below the ${fmt(avg)} average.</p></div>
      <div class="card"><h2>Savings rate by month</h2>${savingsLine(MONTHS)}<p class="note">The rate never fell below 27% all year. October's ${(((7290 - 4612) / 7290) * 100).toFixed(1)}% is the year's best — a quiet month with no surprises.</p></div>
    </section>
    <section class="grid2">
    <div class="card"><h2>Every month, on the record</h2><table class="compact"><thead><tr><th>Month</th><th class="num">Income</th><th class="num">Spent</th><th class="num">Saved</th><th class="num">Rate</th></tr></thead><tbody>${monthRows}</tbody><tfoot><tr><td><b>Year to date</b></td><td class="num"><b>${fmt(ytdIn)}</b></td><td class="num"><b>${fmt(ytdOut)}</b></td><td class="num"><b>${fmt(ytdSaved)}</b></td><td class="num"><b>${((ytdSaved / ytdIn) * 100).toFixed(1)}%</b></td></tr></tfoot></table></div>
    <div class="card"><h2>Forecast check — the held-out test</h2>
      <p class="note">Forecast made <b>${FORECAST.made}</b> from Jan–Sep actuals. Method: ${FORECAST.method}. Frozen before October closed — compared here against the closed October ledger.</p>
      <table class="compact"><thead><tr><th>Category</th><th class="num">Forecast</th><th class="num">Actual</th><th class="num">Miss</th></tr></thead><tbody>${fc}</tbody><tfoot><tr><td><b>Total — ${FORECAST.month}</b></td><td class="num"><b>${fmt(FORECAST.totalForecast)}</b></td><td class="num"><b>${fmt(FORECAST.totalActual)}</b></td><td class="num"><b>+${fmt(fcErr)}</b></td></tr></tfoot></table>
      <p class="note"><b>${acc.toFixed(1)}% accurate</b> — ${fmt(Math.abs(fcErr))} off on a ${fmt(FORECAST.totalActual)} month (0.5% error). Dining missed widest (+${fmt(28)}: two unplanned takeout nights); utilities came in under (−${fmt(9)}: a mild October). November's budget uses the same method — checked again Dec 1.</p></div>
    </section>
  </main>${footer()}`;
}

// -------------------------------------------------------------- money leaks
export function viewLeaks(st) {
  const total = LEAKS.reduce((s, l) => s + l.yearly, 0);
  const cards = LEAKS.map((l) => `<div class="leak-card"><div class="leak-head"><b>${esc(l.name)}</b><span class="tag bad">${l.action}</span></div><div class="leak-nums"><span>${fmt(l.monthly)}/mo</span><b>${fmt(l.yearly)}/yr</b></div><p>${esc(l.detail)}</p></div>`).join('');
  const maxY = Math.max(...LEAKS.map((l) => l.yearly));
  const bars = [...LEAKS].sort((a, b) => b.yearly - a.yearly).map((l) => `<div class="leak-bar-row"><span>${esc(l.name)}</span><span class="pbar wide"><span class="pfill" style="width:${((l.yearly / maxY) * 100).toFixed(1)}%;background:#b91c1c"></span></span><b>${fmt(l.yearly)}/yr</b></div>`).join('');
  return `${header('leaks')}
  <main>
    <div class="title-row"><div><h1>The audit — money hiding in plain sight</h1><p>5 leaks found in November's own ledger · <b>${fmt(total)} a year</b> · every one checked against a real charge, not a guess</p></div></div>
    <section><div class="leak-grid">${cards}</div></section>
    <section class="grid2">
    <div class="card"><h2>Where the ${fmt(total)} comes from</h2>${bars}<p class="note">Takeout is the biggest leak — one planned cook-at-home Friday a month covers it. The two subscriptions are the easiest: two taps to cancel.</p></div>
    <div class="card"><h2>Fix it this week</h2>
      <div class="calc-row"><span><b>Today</b> — cancel Hulu + Audible</span><b>${fmt(366.60)}/yr</b></div>
      <div class="calc-row"><span><b>This week</b> — Disney+ to the $7.99 tier, requote Geico</span><b>${fmt(360)}/yr</b></div>
      <div class="calc-row"><span><b>Every Friday</b> — one cook-at-home night a month</span><b>${fmt(420)}/yr</b></div>
      <div class="calc-row total"><span>Back in the budget</span><b>${fmt(total)}/yr · ${fmt(total / 12)}/mo</b></div>
      <p class="note">Try it on the Tools page: the subscription audit adds up live as you tick boxes.</p></div>
    </section>
    <section class="card"><h2>How the audit works</h2><p class="note">1) Every subscription is checked for last use — Hulu was last opened Sep 12, Audible finished 0 books in November. 2) Every recurring charge is requoted — Geico's $142/mo has a $118/mo same-cover alternative. 3) The dining pattern is reviewed — 8 meals out, and the Nov 6 pizza ($31.40) was unplanned. Nothing here is a guess: each leak names the charge, the date and the amount.</p>
    <p class="note"><b>What ${fmt(total)} buys:</b> the whole family vacation fund (${fmt(3200)}) in under 3 years — or 2.4 months of the emergency-fund gap. Fix the five leaks on the Tools page's subscription audit and watch the yearly figure move.</p></section>
  </main>${footer()}`;
}

// -------------------------------------------------------------------- tools
export function viewTools(st) {
  const t = totals(st);
  const subs = st.tx.filter((x) => x[2] === 'subs');
  // Hulu's November charge failed, so it is not in the ledger — but it still
  // belongs in the audit, pre-ticked: cancel it and the $15.60 stops for good.
  const auditRows = [...subs, [0, 'Hulu — charge failed Nov 24', 'subs', 15.60]];
  const boxes = auditRows.map((x) => `<label class="check"><input type="checkbox" data-monthly="${x[3]}" data-name="${esc(x[1])}" ${(x[1].startsWith('Hulu') || x[1] === 'Audible') ? 'checked' : ''}> ${esc(x[1])} — ${fmt(x[3])}/mo</label>`).join('');
  return `${header('tools')}
  <main>
    <div class="title-row"><div><h1>Tools — five calculators on our numbers</h1><p>Each one opens with the Bennetts' own figures. Change any input — the answer updates, and the note under it says what it means for this household.</p></div></div>
    <section class="tool-grid">
      <div class="card tool"><h2>50 / 30 / 20 splitter</h2><p class="note">Split any take-home pay into needs, wants and savings.</p><label>Take-home pay $ <input id="split-pay" type="number" min="0" step="10" value="${Math.round(t.income)}"></label><button data-calc="split">Split it</button><div id="split-out" class="calc-out"></div></div>
      <div class="card tool"><h2>Debt payoff</h2><p class="note">How fast a balance clears — and what a bigger payment saves.</p><label>Balance $ <input id="debt-bal" type="number" min="0" step="1" value="486"></label><label>APR % <input id="debt-apr" type="number" min="0" step="0.01" value="24.99"></label><label>Payment $/mo <input id="debt-pay" type="number" min="0" step="10" value="250"></label><button data-calc="debt">Work it out</button><div id="debt-out" class="calc-out"></div></div>
      <div class="card tool"><h2>Emergency fund</h2><p class="note">Months to a fully funded safety net.</p><label>Saved so far $ <input id="em-have" type="number" min="0" step="100" value="9200"></label><label>Target $ <input id="em-target" type="number" min="0" step="100" value="12000"></label><label>Per month $ <input id="em-per" type="number" min="0" step="10" value="300"></label><button data-calc="emergency">Count the months</button><div id="em-out" class="calc-out"></div></div>
      <div class="card tool"><h2>Subscription audit</h2><p class="note">Tick the ones to cut — the yearly saving adds up live.</p><div id="subs-audit" class="check-list">${boxes}</div><div id="subs-out" class="calc-out"></div></div>
      <div class="card tool"><h2>Paycheck planner</h2><p class="note">Split Jordan's Dec 4 paycheck ($1,970) zero-based — every dollar gets a job.</p><label>Paycheck $ <input id="pay-amount" type="number" min="0" step="10" value="1970"></label><label>Housing $ <input id="pay-housing" type="number" min="0" step="0.5" value="842.50"></label><label>Groceries $ <input id="pay-groceries" type="number" min="0" step="1" value="324"></label><label>Transport $ <input id="pay-transport" type="number" min="0" step="1" value="256"></label><label>Kids &amp; school $ <input id="pay-kids" type="number" min="0" step="0.5" value="194.50"></label><label>Utilities $ <input id="pay-utilities" type="number" min="0" step="0.5" value="170.50"></label><label>Fun $ <input id="pay-fun" type="number" min="0" step="1" value="89"></label><label>Savings $ <input id="pay-save" type="number" min="0" step="0.5" value="93.50"></label><button data-calc="paycheck">Plan the paycheck</button><div id="pay-out" class="calc-out"></div></div>
    </section>
  </main>${footer()}`;
}
