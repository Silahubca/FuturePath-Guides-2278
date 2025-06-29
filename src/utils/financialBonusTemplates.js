import * as XLSX from 'xlsx';

// Money Map Budgeting Tracker Generator
export const generateMoneyMapTracker = () => {
  const workbook = XLSX.utils.book_new();
  
  // Monthly Budget Sheet
  const budgetData = [
    ['MONEY MAP - MONTHLY BUDGET TRACKER'],
    [''],
    ['INCOME'],
    ['Source', 'Amount'],
    ['Primary Income', ''],
    ['Secondary Income', ''],
    ['Side Hustle', ''],
    ['Investment Income', ''],
    ['Other Income', ''],
    ['TOTAL INCOME', '=SUM(B4:B8)'],
    [''],
    ['FIXED EXPENSES'],
    ['Expense', 'Amount'],
    ['Rent/Mortgage', ''],
    ['Insurance', ''],
    ['Phone', ''],
    ['Internet', ''],
    ['Loan Payments', ''],
    ['Subscriptions', ''],
    ['TOTAL FIXED', '=SUM(B13:B18)'],
    [''],
    ['VARIABLE EXPENSES'],
    ['Expense', 'Budgeted', 'Actual', 'Difference'],
    ['Groceries', '', '', '=C22-B22'],
    ['Utilities', '', '', '=C23-B23'],
    ['Gas/Transportation', '', '', '=C24-B24'],
    ['Dining Out', '', '', '=C25-B25'],
    ['Entertainment', '', '', '=C26-B26'],
    ['Shopping', '', '', '=C27-B27'],
    ['Personal Care', '', '', '=C28-B28'],
    ['Miscellaneous', '', '', '=C29-B29'],
    ['TOTAL VARIABLE', '=SUM(B22:B29)', '=SUM(C22:C29)', '=C30-B30'],
    [''],
    ['SAVINGS & INVESTMENTS'],
    ['Goal', 'Amount'],
    ['Emergency Fund', ''],
    ['Retirement (401k/IRA)', ''],
    ['Investment Account', ''],
    ['Short-term Savings', ''],
    ['TOTAL SAVINGS', '=SUM(B34:B37)'],
    [''],
    ['SUMMARY'],
    ['Total Income', '=B9'],
    ['Total Expenses', '=B19+B30'],
    ['Total Savings', '=B38'],
    ['Remaining', '=B41-B42-B43'],
    [''],
    ['BUDGET ANALYSIS'],
    ['Savings Rate', '=B43/B41'],
    ['Fixed Expense Ratio', '=B19/B41'],
    ['Variable Expense Ratio', '=B30/B41']
  ];
  
  const budgetSheet = XLSX.utils.aoa_to_sheet(budgetData);
  XLSX.utils.book_append_sheet(workbook, budgetSheet, 'Monthly Budget');
  
  // Expense Tracking Sheet
  const trackingData = [
    ['EXPENSE TRACKING LOG'],
    [''],
    ['Date', 'Category', 'Description', 'Amount', 'Payment Method'],
    // Add 50 empty rows for tracking
    ...Array(50).fill(['', '', '', '', ''])
  ];
  
  const trackingSheet = XLSX.utils.aoa_to_sheet(trackingData);
  XLSX.utils.book_append_sheet(workbook, trackingSheet, 'Expense Tracking');
  
  return workbook;
};

// Debt Demolisher Worksheet Generator
export const generateDebtDemolisher = () => {
  const template = `
DEBT DEMOLISHER WORKSHEET
Your Complete Guide to Becoming Debt-Free

=== DEBT INVENTORY ===

List all your debts below:

Debt #1:
Creditor: _________________________
Current Balance: $__________
Interest Rate: _______%
Minimum Payment: $__________
Due Date: __________

Debt #2:
Creditor: _________________________
Current Balance: $__________
Interest Rate: _______%
Minimum Payment: $__________
Due Date: __________

Debt #3:
Creditor: _________________________
Current Balance: $__________
Interest Rate: _______%
Minimum Payment: $__________
Due Date: __________

Debt #4:
Creditor: _________________________
Current Balance: $__________
Interest Rate: _______%
Minimum Payment: $__________
Due Date: __________

=== STRATEGY SELECTION ===

□ DEBT SNOWBALL METHOD
  - Pay minimums on all debts
  - Put extra money toward SMALLEST balance
  - Best for: Motivation and quick wins

□ DEBT AVALANCHE METHOD
  - Pay minimums on all debts
  - Put extra money toward HIGHEST interest rate
  - Best for: Saving money on interest

=== DEBT SNOWBALL PLAN ===

Order your debts from smallest to largest balance:

1. _________________ Balance: $_______ Payment: $_______
2. _________________ Balance: $_______ Payment: $_______
3. _________________ Balance: $_______ Payment: $_______
4. _________________ Balance: $_______ Payment: $_______

Extra payment amount available: $__________

=== DEBT AVALANCHE PLAN ===

Order your debts from highest to lowest interest rate:

1. _________________ Rate: ____% Payment: $_______
2. _________________ Rate: ____% Payment: $_______
3. _________________ Rate: ____% Payment: $_______
4. _________________ Rate: ____% Payment: $_______

Extra payment amount available: $__________

=== MONTHLY PAYMENT TRACKER ===

Month 1:
Debt 1: $_______ (Balance remaining: $______)
Debt 2: $_______ (Balance remaining: $______)
Debt 3: $_______ (Balance remaining: $______)
Debt 4: $_______ (Balance remaining: $______)

Month 2:
Debt 1: $_______ (Balance remaining: $______)
Debt 2: $_______ (Balance remaining: $______)
Debt 3: $_______ (Balance remaining: $______)
Debt 4: $_______ (Balance remaining: $______)

[Continue for 12 months]

=== EXTRA PAYMENT STRATEGIES ===

Ways to find extra money for debt payments:

□ Cancel unused subscriptions: $______/month
□ Reduce dining out: $______/month
□ Sell unused items: $______ (one-time)
□ Side hustle income: $______/month
□ Tax refund: $______ (annual)
□ Bonus/overtime: $______ (when available)
□ Cashback rewards: $______/month

Total extra available: $______/month

=== MOTIVATION TRACKER ===

Starting total debt: $__________
Current total debt: $__________
Total paid off: $__________
Percentage complete: _______%

DEBT-FREE DATE GOAL: ___________

=== CELEBRATION MILESTONES ===

□ First $1,000 paid off
□ First debt completely eliminated
□ 25% of total debt paid off
□ 50% of total debt paid off
□ 75% of total debt paid off
□ 100% DEBT FREE! 🎉

=== BNPL SPECIFIC STRATEGIES ===

If you have Buy Now, Pay Later debts:

□ Set up autopay for all BNPL accounts
□ Request payment extensions if needed
□ Contact lender about hardship if applicable
□ Consider personal loan for consolidation
□ Implement spending freezes on problem categories

BNPL Accounts:
1. _________________ Due: _______ Amount: $_______
2. _________________ Due: _______ Amount: $_______
3. _________________ Due: _______ Amount: $_______

=== STUDENT LOAN STRATEGIES ===

□ Enroll in autopay for interest rate reduction
□ Apply for Income-Driven Repayment plan
□ Research loan forgiveness programs
□ Consider refinancing (weigh pros/cons)
□ Make extra principal payments

Current Student Loan Info:
Servicer: _________________________
Total Balance: $__________
Monthly Payment: $__________
Interest Rate: _______%
Repayment Plan: _________________________

=== SUCCESS TIPS ===

1. Pay more than the minimum whenever possible
2. Use windfalls (tax refunds, bonuses) for debt
3. Automate payments to avoid late fees
4. Track progress weekly to stay motivated
5. Celebrate small wins along the way
6. Don't take on new debt while paying off old debt
7. Build a small emergency fund ($500-$1000) first

Remember: Every payment brings you closer to freedom!
`;

  const blob = new Blob([template], { type: 'text/plain' });
  return blob;
};

// Investment Portfolio Guide Generator
export const generatePortfolioGuide = () => {
  const guide = `
INFLATION-PROOF PORTFOLIO GUIDE
Build Wealth That Beats Inflation

=== UNDERSTANDING INFLATION IMPACT ===

Current Annual Inflation Rate: _______%
Your Investment Goal: Beat inflation by _____%

If inflation is 3% annually:
$1,000 today = $970 purchasing power in 1 year
$1,000 today = $885 purchasing power in 4 years
$1,000 today = $744 purchasing power in 10 years

=== INFLATION-HEDGED ASSET ALLOCATION ===

Recommended Portfolio Mix:

□ 40-60% Stocks (Equity Investments)
  - Broad market index funds
  - Dividend-paying stocks
  - International stocks

□ 10-20% Treasury Inflation-Protected Securities (TIPS)
  - Principal adjusts with inflation
  - Government-backed security

□ 10-15% Real Estate (REITs)
  - Real Estate Investment Trusts
  - Tends to appreciate with inflation

□ 5-10% Commodities
  - Gold, oil, agricultural products
  - Often rise during inflationary periods

□ 5-15% Cash/Money Market
  - High-yield savings accounts
  - Emergency fund (3-6 months expenses)

=== YOUR CURRENT PORTFOLIO ANALYSIS ===

Current Investments:
Asset Type: _________________ Amount: $_______ Percentage: ____%
Asset Type: _________________ Amount: $_______ Percentage: ____%
Asset Type: _________________ Amount: $_______ Percentage: ____%
Asset Type: _________________ Amount: $_______ Percentage: ____%

Total Portfolio Value: $__________

=== REBALANCING PLAN ===

Target Allocation:
Stocks: ____% (Target $______)
TIPS: ____% (Target $______)
REITs: ____% (Target $______)
Commodities: ____% (Target $______)
Cash: ____% (Target $______)

Actions Needed:
□ Buy more: _________________ Amount: $_______
□ Sell some: _________________ Amount: $_______
□ Rebalance: _________________ From: _______ To: _______

=== INVESTMENT ACCOUNT SETUP ===

□ 401(k) - Maximize employer match
  Current contribution: ____% of salary
  Employer match: ____% (up to ____%)
  Annual contribution limit: $23,000 (2024)

□ Traditional IRA
  Annual contribution limit: $7,000 (2024)
  Tax-deductible contributions
  Taxed on withdrawal

□ Roth IRA
  Annual contribution limit: $7,000 (2024)
  After-tax contributions
  Tax-free withdrawals in retirement

□ Taxable Brokerage Account
  No contribution limits
  More flexibility
  Subject to capital gains tax

=== DIVIDEND STOCK SCREENING ===

Look for companies with:
□ Consistent dividend payments (10+ years)
□ Dividend growth history
□ Strong financial fundamentals
□ Dividend yield: 2-6%

Sectors to consider:
□ Consumer staples (food, household products)
□ Utilities (electric, gas, water)
□ Healthcare (pharmaceuticals, medical devices)
□ Technology (established companies)

=== TIPS INVESTMENT GUIDE ===

Treasury Inflation-Protected Securities (TIPS):
□ Principal adjusts with Consumer Price Index (CPI)
□ Interest payments based on adjusted principal
□ Available in 5, 10, and 30-year terms
□ Can buy directly from Treasury or through funds

TIPS Fund Options:
□ Vanguard TIPS Index Fund (VIPSX)
□ iShares TIPS Bond ETF (SCHP)
□ Fidelity Inflation-Protected Bond Fund (FINPX)

=== REIT INVESTMENT OPTIONS ===

Real Estate Investment Trust types:
□ Residential REITs (apartments, homes)
□ Commercial REITs (office buildings, retail)
□ Industrial REITs (warehouses, distribution)
□ Healthcare REITs (hospitals, senior housing)

REIT Fund Options:
□ Vanguard Real Estate ETF (VNQ)
□ iShares Core Real Estate ETF (IRET)
□ Schwab US REIT ETF (SCHH)

=== COMMODITY INVESTMENT STRATEGIES ===

Ways to invest in commodities:
□ Commodity ETFs (DJP, DBA, GLD)
□ Commodity mutual funds
□ Individual commodity stocks
□ Physical commodities (gold, silver)

Popular Commodity ETFs:
□ SPDR Gold Trust (GLD) - Gold exposure
□ United States Oil Fund (USO) - Oil exposure
□ Invesco DB Agriculture Fund (DBA) - Agricultural commodities

=== REBALANCING SCHEDULE ===

□ Monthly review (check progress)
□ Quarterly rebalancing (if needed)
□ Annual comprehensive review

Rebalancing triggers:
□ Asset allocation off by more than 5%
□ Major life changes
□ Economic conditions change

=== COST MANAGEMENT ===

Keep investment costs low:
□ Choose low-cost index funds (expense ratios <0.20%)
□ Minimize trading fees
□ Avoid high-fee actively managed funds
□ Use tax-advantaged accounts when possible

=== DOLLAR-COST AVERAGING ===

Invest the same amount regularly:
□ Monthly investment: $______
□ Reduces impact of market volatility
□ Builds discipline
□ Takes emotion out of investing

=== TAX OPTIMIZATION ===

□ Max out tax-advantaged accounts first
□ Hold tax-inefficient investments in IRAs
□ Use tax-loss harvesting in taxable accounts
□ Consider municipal bonds if in high tax bracket

=== EMERGENCY FUND PROTECTION ===

Before investing, ensure you have:
□ 3-6 months expenses in high-yield savings
□ Amount needed: $__________
□ Current emergency fund: $__________
□ Still need to save: $__________

=== INFLATION PROTECTION CHECKLIST ===

□ Diversified across asset classes
□ Includes inflation-hedged investments
□ Regular rebalancing schedule
□ Low-cost investment options
□ Tax-efficient structure
□ Emergency fund established
□ Long-term perspective maintained

Remember: Investing is a marathon, not a sprint!
Stay disciplined and stick to your plan.
`;

  const blob = new Blob([guide], { type: 'text/plain' });
  return blob;
};

// Financial Goal Setter Generator
export const generateGoalSetter = () => {
  const goalSetter = `
PERSONAL FINANCIAL GOAL SETTER
Turn Your Dreams Into Actionable Plans

=== GOAL CATEGORIES ===

□ EMERGENCY FUND GOALS
□ DEBT ELIMINATION GOALS  
□ SAVINGS GOALS
□ INVESTMENT GOALS
□ MAJOR PURCHASE GOALS
□ RETIREMENT GOALS

=== SMART GOAL FRAMEWORK ===

Make your goals:
S - Specific
M - Measurable  
A - Achievable
R - Relevant
T - Time-bound

=== SHORT-TERM GOALS (1-3 Years) ===

Goal #1:
What: _________________________________
Why: _________________________________
Target Amount: $__________
Target Date: __________
Monthly Savings Needed: $__________
Current Progress: $__________

Action Steps:
1. _________________________________
2. _________________________________
3. _________________________________

Goal #2:
What: _________________________________
Why: _________________________________
Target Amount: $__________
Target Date: __________
Monthly Savings Needed: $__________
Current Progress: $__________

Action Steps:
1. _________________________________
2. _________________________________
3. _________________________________

Goal #3:
What: _________________________________
Why: _________________________________
Target Amount: $__________
Target Date: __________
Monthly Savings Needed: $__________
Current Progress: $__________

Action Steps:
1. _________________________________
2. _________________________________
3. _________________________________

=== LONG-TERM GOALS (3+ Years) ===

Goal #1:
What: _________________________________
Why: _________________________________
Target Amount: $__________
Target Date: __________
Monthly Savings Needed: $__________
Current Progress: $__________

Milestones:
Year 1: $__________
Year 2: $__________
Year 3: $__________
Year 5: $__________

Goal #2:
What: _________________________________
Why: _________________________________
Target Amount: $__________
Target Date: __________
Monthly Savings Needed: $__________
Current Progress: $__________

Milestones:
Year 1: $__________
Year 2: $__________
Year 3: $__________
Year 5: $__________

=== RETIREMENT PLANNING ===

Current Age: _____
Desired Retirement Age: _____
Years Until Retirement: _____

Current Retirement Savings: $__________
Estimated Annual Retirement Expenses: $__________
Retirement Income Goal: $__________

Required Retirement Savings: $__________
(Multiply annual expenses by 25)

Monthly Savings Needed: $__________

Retirement Account Strategy:
□ Maximize 401(k) employer match
□ Contribute to Roth IRA
□ Consider traditional IRA
□ Open taxable investment account

=== EMERGENCY FUND PLANNING ===

Monthly Essential Expenses: $__________
Target Emergency Fund (6 months): $__________
Current Emergency Fund: $__________
Amount Still Needed: $__________

Monthly Savings Target: $__________
Timeline to Complete: _____ months

Emergency Fund Location:
□ High-yield savings account
□ Money market account
□ Short-term CDs

=== DEBT ELIMINATION GOALS ===

Total Current Debt: $__________
Average Interest Rate: _______%

Debt-Free Goal Date: __________

Monthly Payment Plan:
Minimum Payments: $__________
Extra Payment Capacity: $__________
Total Monthly Debt Payment: $__________

Strategy:
□ Debt Snowball (smallest balance first)
□ Debt Avalanche (highest interest first)

=== MAJOR PURCHASE GOALS ===

Purchase #1:
Item: _________________________________
Cost: $__________
Target Purchase Date: __________
Down Payment Needed: $__________
Monthly Savings Required: $__________

Purchase #2:
Item: _________________________________
Cost: $__________
Target Purchase Date: __________
Down Payment Needed: $__________
Monthly Savings Required: $__________

=== HOME PURCHASE PLANNING ===

Target Home Price: $__________
Down Payment Goal (20%): $__________
Current Down Payment Savings: $__________
Still Need to Save: $__________

Additional Costs to Budget:
Closing Costs (2-5%): $__________
Moving Expenses: $__________
Initial Repairs/Furnishing: $__________
Total Additional: $__________

Timeline: _____ years to save

=== GOAL PRIORITIZATION ===

Rank your goals in order of importance:

1. _________________________________
2. _________________________________
3. _________________________________
4. _________________________________
5. _________________________________

=== MONTHLY SAVINGS ALLOCATION ===

Total Monthly Savings Capacity: $__________

Goal Allocation:
Emergency Fund: $________ (____%)
Debt Payment: $________ (____%)
Retirement: $________ (____%)
Short-term Goal #1: $________ (____%)
Short-term Goal #2: $________ (____%)
Long-term Goal #1: $________ (____%)

Total Allocated: $________

=== AUTOMATIC SAVINGS SETUP ===

□ Set up automatic transfers on payday
□ Use separate savings accounts for each goal
□ Name accounts for motivation
□ Set up direct deposit splits

Account Setup:
Emergency Fund Account: _________________
Retirement Account: _________________
Goal #1 Account: _________________
Goal #2 Account: _________________

=== PROGRESS TRACKING ===

Review Schedule:
□ Weekly: Check account balances
□ Monthly: Update progress worksheet  
□ Quarterly: Assess and adjust goals
□ Annually: Set new goals

Progress Milestones:
□ 25% complete
□ 50% complete
□ 75% complete
□ Goal achieved!

=== MOTIVATION STRATEGIES ===

□ Create visual progress charts
□ Share goals with accountability partner
□ Celebrate milestones
□ Review your "why" regularly
□ Adjust goals if life changes

Celebration Ideas:
25% complete: _________________________________
50% complete: _________________________________
75% complete: _________________________________
Goal achieved: _________________________________

=== OBSTACLE PLANNING ===

Potential Challenges:
1. _________________________________
   Solution: _________________________________

2. _________________________________
   Solution: _________________________________

3. _________________________________
   Solution: _________________________________

=== GOAL REVIEW CHECKLIST ===

□ Goals are specific and measurable
□ Timeline is realistic
□ Monthly savings amounts fit budget
□ Goals are prioritized appropriately
□ Automatic savings are set up
□ Progress tracking system in place
□ Celebration plan created

Remember: Small, consistent actions lead to big results!
Stay committed to your plan and adjust as needed.
`;

  const blob = new Blob([goalSetter], { type: 'text/plain' });
  return blob;
};

export const downloadFinancialBonusTemplate = (templateType) => {
  let blob, filename;
  
  switch (templateType) {
    case 'money-map':
      const moneyMapWorkbook = generateMoneyMapTracker();
      XLSX.writeFile(moneyMapWorkbook, 'Money-Map-Budgeting-Tracker.xlsx');
      return;
      
    case 'debt-demolisher':
      blob = generateDebtDemolisher();
      filename = 'Debt-Demolisher-Worksheet.txt';
      break;
      
    case 'portfolio-guide':
      blob = generatePortfolioGuide();
      filename = 'Inflation-Proof-Portfolio-Guide.txt';
      break;
      
    case 'goal-setter':
      blob = generateGoalSetter();
      filename = 'Personal-Financial-Goal-Setter.txt';
      break;
      
    default:
      return;
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};