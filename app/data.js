// NestLedger — every figure on this site comes from this one file.
// The Bennett household, Columbus, Ohio. November 2026, seen on Thursday Nov 26
// (4 days left in the month). All totals below are computed from TX at run time;
// check-figures.mjs (build folder) asserts every sum independently in Node.

// Household: two earners, two kids. Take-home pay, November 2026.
export const HOUSEHOLD = {
  name: 'The Bennett family',
  members: 'Maya & Jordan Bennett · Noah (11) · Lily (7)',
  place: 'Columbus, Ohio',
  month: 'November 2026',
  today: 'Thursday, November 26, 2026',
  daysLeft: 4,
  daysIn: 26,
};

// 12 budget envelopes. `planned` is the November budget; `actual` is computed
// from TX (sum of that category's rows) — never typed by hand twice.
export const CATS = [
  { key: 'housing',   name: 'Housing',           color: '#1f4e79', planned: 1975 },
  { key: 'groceries', name: 'Groceries',         color: '#2e7d32', planned: 720 },
  { key: 'dining',    name: 'Dining out',        color: '#c05621', planned: 320 },
  { key: 'transport', name: 'Transport',         color: '#6b4fa1', planned: 560 },
  { key: 'utilities', name: 'Utilities',         color: '#0e7490', planned: 380 },
  { key: 'kids',      name: 'Kids & school',     color: '#b45309', planned: 420 },
  { key: 'health',    name: 'Health',            color: '#be185d', planned: 200 },
  { key: 'fun',       name: 'Fun & entertainment', color: '#4d7c0f', planned: 200 },
  { key: 'subs',      name: 'Subscriptions',     color: '#475569', planned: 110 },
  { key: 'household', name: 'Household & misc',  color: '#92400e', planned: 180 },
  { key: 'clothing',  name: 'Clothing',          color: '#7c3aed', planned: 120 },
  { key: 'giving',    name: 'Giving',            color: '#0f766e', planned: 120 },
];

// November ledger, Nov 1–26: 64 expenses + 2 paychecks = 66 transactions.
// [day, payee, category key ('income' for pay), amount in dollars]
// Category sums (verified by check-figures.mjs):
//   housing 1975.00 · groceries 646.60 · dining 286.00 · transport 512.00
//   utilities 341.00 · kids 389.00 · health 164.00 · fun 178.00 · subs 78.40
//   household 143.00 · clothing 87.00 · giving 120.00  → spent $4,920.00
//   income 3480.00 + 3940.00 = $7,420.00 → saved $2,500.00 (33.7%)
export const TX = [
  [1, 'Mortgage — First Columbus Bank', 'housing', 1685.00],
  [1, 'Home insurance — State Farm', 'housing', 96.00],
  [1, 'Property tax escrow', 'housing', 194.00],
  [1, 'Tithe — Grace Church', 'giving', 100.00],
  [2, 'Kroger — weekly shop', 'groceries', 142.60],
  [2, 'Shell — fuel, Jordan', 'transport', 48.20],
  [2, 'Netflix', 'subs', 15.49],
  [3, 'Costco — bulk shop', 'groceries', 187.30],
  [3, 'AEP Ohio — electric', 'utilities', 128.40],
  [3, 'Target — home goods', 'household', 52.30],
  [4, 'Chipotle — lunch, Maya', 'dining', 24.60],
  [4, 'Noah — soccer fees, fall season', 'kids', 85.00],
  [5, 'BP — fuel, Maya', 'transport', 52.75],
  [5, 'CVS — pharmacy', 'health', 28.40],
  [5, 'Spotify', 'subs', 11.99],
  [6, 'Pizza Friday — Donatos', 'dining', 31.40],
  [6, 'Columbus water — bill', 'utilities', 46.20],
  [6, 'Lily — dance class', 'kids', 65.00],
  [7, 'Kroger — weekly shop', 'groceries', 96.40],
  [7, 'Sushi date night — Japan Marketplace', 'dining', 72.10],
  [7, 'Movie night — AMC Easton', 'fun', 42.00],
  [7, 'Old Navy — kids winter coats', 'clothing', 42.00],
  [8, 'Car insurance — Geico', 'transport', 142.00],
  [8, 'Lowe\u2019s — hardware', 'household', 28.75],
  [8, 'iCloud — 200 GB', 'subs', 2.99],
  [9, 'Aldi — weekly shop', 'groceries', 58.25],
  [9, 'School lunches — Noah & Lily', 'kids', 48.50],
  [9, 'Spectrum — internet', 'utilities', 79.99],
  [10, 'Chick-fil-A — lunch', 'dining', 18.90],
  [10, 'Dentist copay — Lily', 'health', 45.00],
  [11, 'T-Mobile — 2 lines', 'utilities', 62.00],
  [11, 'Board game — Settlers of Catan', 'fun', 28.95],
  [12, 'Kroger — weekly shop', 'groceries', 71.80],
  [12, 'Shell — fuel, Maya', 'transport', 46.90],
  [12, 'Tutoring block — Noah, math', 'kids', 120.00],
  [12, 'Amazon Prime', 'subs', 14.99],
  [13, 'Paycheck — Maya, Columbus Schools', 'income', 3480.00],
  [13, 'Panera — lunch, Jordan', 'dining', 26.75],
  [13, 'Amazon — household', 'household', 31.20],
  [14, 'Columbia Gas — bill', 'utilities', 24.41],
  [14, 'Kohl\u2019s — Maya, work shirts', 'clothing', 28.50],
  [14, 'Streaming rental — movie night', 'fun', 6.99],
  [15, 'Paycheck — Jordan, Miller Electric', 'income', 3940.00],
  [15, 'Target — groceries', 'groceries', 34.15],
  [15, 'Urgent care copay — Noah', 'health', 51.60],
  [15, 'New York Times — digital', 'subs', 4.00],
  [15, 'Food bank — Mid-Ohio', 'giving', 20.00],
  [16, 'Parking — downtown Columbus', 'transport', 18.00],
  [17, 'Taco truck — dinner', 'dining', 14.50],
  [18, 'Aldi — weekly shop', 'groceries', 28.90],
  [18, 'Kids haircuts — Great Clips', 'kids', 32.00],
  [18, 'Disney+', 'subs', 13.99],
  [19, 'Oil change — Valvoline', 'transport', 89.00],
  [19, 'Dry cleaning — Maya', 'household', 18.50],
  [20, 'Olive Garden — family dinner', 'dining', 58.20],
  [21, 'Kroger — weekly shop', 'groceries', 18.75],
  [21, 'COSI museum — family tickets', 'fun', 54.00],
  [21, 'Vitamins & supplements', 'health', 39.00],
  [21, 'Audible', 'subs', 14.95],
  [22, 'Field trip — Noah, science museum', 'kids', 38.50],
  [22, 'Thrift — Lily, jeans', 'clothing', 16.50],
  [23, 'BP — fuel, Jordan', 'transport', 115.15],
  [23, 'Misc — school fundraiser', 'household', 12.25],
  [24, 'Farmers market — North Market', 'groceries', 8.45],
  [24, 'Books — Half Price Books', 'fun', 46.06],
  [25, 'Coffee shop — Kittie\u2019s', 'dining', 39.55],
];

// 11 months, January–November 2026. Year to date: $81,000 in, $55,372 out,
// $25,628 saved (31.6%). Average month: $5,034 spent. Best month: October
// ($4,612). Highest: July ($5,490 — summer camp + AC).
export const MONTHS = [
  { m: 'Jan', income: 7380, spent: 5210 },
  { m: 'Feb', income: 7210, spent: 4980 },
  { m: 'Mar', income: 7490, spent: 5340 },
  { m: 'Apr', income: 7300, spent: 4860 },
  { m: 'May', income: 7440, spent: 5120 },
  { m: 'Jun', income: 7180, spent: 4760 },
  { m: 'Jul', income: 7520, spent: 5490 },
  { m: 'Aug', income: 7360, spent: 4900 },
  { m: 'Sep', income: 7410, spent: 5180 },
  { m: 'Oct', income: 7290, spent: 4612 },
  { m: 'Nov', income: 7420, spent: 4920 },
];

// October 2026 actuals per category, for the "vs Oct" deltas on the dashboard.
// They sum to October's $4,612 exactly, and the five forecast rows in FORECAST
// match them (groceries 622, dining 268, transport 502, utilities 341,
// kids 402; housing + the rest = $2,477).
export const OCT_CATS = {
  housing: 1875.00, groceries: 622.00, dining: 268.00, transport: 502.00,
  utilities: 341.00, kids: 402.00, health: 148.00, fun: 132.00,
  subs: 81.20, household: 118.80, clothing: 62.00, giving: 60.00,
};

// 14 recurring bills. 11 of 14 paid: $2,215.00 out. Still to go: $366.60
// (Hulu $15.60 OVERDUE since Nov 24 — autopay card expired; gym $39.00 due
// Nov 28; auto loan $312.00 due Nov 30).
export const BILLS = [
  { name: 'Mortgage — First Columbus Bank', amount: 1685.00, due: 1, status: 'paid', note: 'autopay' },
  { name: 'AEP Ohio — electric', amount: 128.40, due: 5, status: 'paid', note: 'autopay' },
  { name: 'Columbus water', amount: 46.20, due: 8, status: 'paid', note: 'autopay' },
  { name: 'Spectrum — internet', amount: 79.99, due: 10, status: 'paid', note: 'autopay' },
  { name: 'T-Mobile — 2 lines', amount: 62.00, due: 12, status: 'paid', note: 'autopay' },
  { name: 'Car insurance — Geico', amount: 142.00, due: 14, status: 'paid', note: 'autopay' },
  { name: 'Netflix', amount: 15.49, due: 15, status: 'paid', note: 'auto-charge' },
  { name: 'Spotify', amount: 11.99, due: 15, status: 'paid', note: 'auto-charge' },
  { name: 'Amazon Prime', amount: 14.99, due: 17, status: 'paid', note: 'auto-charge' },
  { name: 'Disney+', amount: 13.99, due: 19, status: 'paid', note: 'auto-charge' },
  { name: 'Audible', amount: 14.95, due: 21, status: 'paid', note: 'auto-charge' },
  { name: 'Hulu', amount: 15.60, due: 24, status: 'overdue', note: 'autopay failed — card expired' },
  { name: 'Gym — Planet Fitness, 2 memberships', amount: 39.00, due: 28, status: 'due', note: 'due in 2 days' },
  { name: 'Auto loan — Honda CR-V', amount: 312.00, due: 30, status: 'due', note: 'due in 4 days' },
];

// 5 savings goals. $18,650 saved toward $54,200.
export const GOALS = [
  { name: 'Emergency fund', current: 9200, target: 12000, note: '6 months of essentials is the goal; 4.6 months covered' },
  { name: 'Family vacation — Lake Erie, June', current: 2150, target: 3200, note: '$300/mo · on track for June 2027' },
  { name: 'New car down payment', current: 2800, target: 6000, note: '$250/mo · on track for late 2027' },
  { name: 'Kitchen remodel', current: 1400, target: 8000, note: 'paused while the car fund fills first' },
  { name: 'Kids\u2019 college fund — 529', current: 3100, target: 25000, note: '$150/mo · started March 2025' },
];

// Net worth, excluding the house itself. Assets $32,690; debts $9,386;
// net $23,304 — up $3,464 since June.
export const NETWORTH = {
  accounts: [
    { name: 'Checking — First Columbus', amount: 3240 },
    { name: 'Savings — emergency fund', amount: 9200 },
    { name: '401(k) — Maya', amount: 18400 },
    { name: 'HSA', amount: 1850 },
  ],
  debts: [
    { name: 'Credit cards — Visa', amount: 486 },
    { name: 'Auto loan — Honda CR-V', amount: 8900 },
  ],
  trend: [
    { m: 'Jun', value: 19840 },
    { m: 'Jul', value: 20610 },
    { m: 'Aug', value: 21205 },
    { m: 'Sep', value: 21980 },
    { m: 'Oct', value: 22540 },
    { m: 'Nov', value: 23304 },
  ],
};

// Held-out validation, shown on the site itself (Year Review page).
// Forecast made Sep 30, 2026 from Jan–Sep actuals (3-month moving average per
// category). October closed at $4,612 actual vs $4,590 forecast: $22 off,
// 0.5% error, 99.5% accurate. Category rows sum exactly to both totals.
export const FORECAST = {
  made: 'September 30, 2026',
  method: '3-month moving average of Jan–Sep actuals, per category',
  month: 'October 2026',
  rows: [
    { cat: 'Groceries', forecast: 610, actual: 622 },
    { cat: 'Dining out', forecast: 240, actual: 268 },
    { cat: 'Transport', forecast: 480, actual: 502 },
    { cat: 'Utilities', forecast: 350, actual: 341 },
    { cat: 'Kids & school', forecast: 380, actual: 402 },
    { cat: 'Housing & everything else', forecast: 2530, actual: 2477 },
  ],
  totalForecast: 4590,
  totalActual: 4612,
};

// Money-leak audit: 5 leaks found in November's own ledger.
// $1,146.60 a year — stated on the site as $1,147/yr.
export const LEAKS = [
  { name: 'Hulu', monthly: 15.60, yearly: 187.20, action: 'Cancel', detail: 'Last watched Sep 12. Nobody opened it in 10 weeks — the $15.60 on Nov 24 even failed to charge (card expired).' },
  { name: 'Audible', monthly: 14.95, yearly: 179.40, action: 'Cancel', detail: '0 books finished in November; 2 credits sit unused. Rejoin when the next road trip comes.' },
  { name: 'Disney+', monthly: 6.00, yearly: 72.00, action: 'Downgrade', detail: 'Kids watched twice in November. The $7.99 ad tier shows the same shows — saves $6.00 a month.' },
  { name: 'Takeout nights', monthly: 35.00, yearly: 420.00, action: 'Cook one more night', detail: '8 meals out in November. One planned cook-at-home Friday a month covers it — the Nov 6 pizza ($31.40) was unplanned.' },
  { name: 'Car insurance', monthly: 24.00, yearly: 288.00, action: 'Requote', detail: 'Geico charges $142/mo. A same-cover quote from Progressive came in at $118/mo — same coverage, $24 less.' },
];
