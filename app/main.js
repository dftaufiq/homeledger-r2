// NestLedger — router, state and every control. One ledger in memory: the
// dashboard, the budgets, the bills, the goals and the calendar all read the
// same state, so a change in one place shows up everywhere at once.
import { TX, BILLS, GOALS, CATS } from './data.js';
import { viewDashboard, viewTransactions, viewBudgets, viewBills, viewGoals, viewYear, viewLeaks, viewTools, txRows } from './views.js';
import { bindTools } from './tools.js';

const state = {
  tx: TX.map((t) => [...t]),
  bills: BILLS.map((b) => ({ ...b })),
  goals: GOALS.map((g) => ({ ...g })),
  planned: Object.fromEntries(CATS.map((c) => [c.key, c.planned])),
};

const app = document.getElementById('app');

function route() {
  const hash = (location.hash || '#/').replace(/^#\//, '');
  const page = hash.split('/')[0];
  const renderers = {
    '': viewDashboard, transactions: viewTransactions, budgets: viewBudgets,
    bills: viewBills, goals: viewGoals, year: viewYear, leaks: viewLeaks, tools: viewTools,
  };
  app.innerHTML = (renderers[page] || viewDashboard)(state);
  window.scrollTo(0, 0);
  wire(page);
}

function wire(page) {
  if (page === 'transactions') wireTransactions();
  if (page === 'budgets') wireBudgets();
  if (page === 'bills') wireBills();
  if (page === 'goals') wireGoals();
  if (page === 'tools') bindTools();
}

function wireTransactions() {
  const form = document.getElementById('add-tx');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const day = parseInt(document.getElementById('tx-day').value, 10);
    const payee = document.getElementById('tx-payee').value.trim();
    const cat = document.getElementById('tx-cat').value;
    const amt = parseFloat(document.getElementById('tx-amt').value);
    if (!payee || !Number.isFinite(amt) || amt <= 0 || day < 1 || day > 30) return;
    state.tx.push([day, payee, cat, Math.round(amt * 100) / 100]);
    form.reset();
    document.getElementById('tx-day').value = day;
    refreshTxList();
  });
  const refresh = () => refreshTxList();
  document.getElementById('tx-search').addEventListener('input', refresh);
  document.getElementById('tx-filter').addEventListener('change', refresh);
  document.getElementById('tx-type').addEventListener('change', refresh);
  refreshTxList();
}

function refreshTxList() {
  const q = (document.getElementById('tx-search').value || '').toLowerCase();
  const cat = document.getElementById('tx-filter').value;
  const type = document.getElementById('tx-type').value;
  const r = txRows(state, q, cat, type);
  document.getElementById('tx-body').innerHTML = r.body;
  document.getElementById('tx-count').textContent = r.count;
}

function wireBudgets() {
  document.querySelectorAll('.plan-input').forEach((input) => {
    input.addEventListener('change', () => {
      const v = parseFloat(input.value);
      if (Number.isFinite(v) && v >= 0) state.planned[input.dataset.cat] = v;
      route();
    });
  });
}

function wireBills() {
  document.querySelectorAll('[data-bill]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const bill = state.bills.find((b) => b.name === btn.dataset.bill);
      if (bill) { bill.status = 'paid'; bill.note = 'paid just now'; }
      route();
    });
  });
}

function wireGoals() {
  document.getElementById('add-goal').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('goal-name').value;
    const amt = parseFloat(document.getElementById('goal-amt').value);
    const goal = state.goals.find((g) => g.name === name);
    if (goal && Number.isFinite(amt) && amt > 0) goal.current = Math.round((goal.current + amt) * 100) / 100;
    route();
  });
}

window.addEventListener('hashchange', route);
route();
