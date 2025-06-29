// Financial calculators for the Financial Freedom Blueprint

export const calculateEmergencyFund = (monthlyExpenses, months = 6) => {
  return monthlyExpenses * months;
};

export const calculateDebtPayoff = (balance, interestRate, monthlyPayment) => {
  const monthlyRate = interestRate / 100 / 12;
  
  if (monthlyRate === 0) {
    return {
      months: Math.ceil(balance / monthlyPayment),
      totalPaid: balance,
      totalInterest: 0
    };
  }
  
  const months = Math.ceil(-Math.log(1 - (balance * monthlyRate) / monthlyPayment) / Math.log(1 + monthlyRate));
  const totalPaid = monthlyPayment * months;
  const totalInterest = totalPaid - balance;
  
  return {
    months,
    years: Math.floor(months / 12),
    remainingMonths: months % 12,
    totalPaid,
    totalInterest
  };
};

export const calculateMortgagePayment = (loanAmount, interestRate, loanTermYears) => {
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;
  
  const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  
  return {
    monthlyPayment,
    totalPaid: monthlyPayment * numberOfPayments,
    totalInterest: (monthlyPayment * numberOfPayments) - loanAmount
  };
};

export const calculateRetirementSavings = (currentAge, retirementAge, currentSavings, monthlyContribution, expectedReturn) => {
  const yearsToRetirement = retirementAge - currentAge;
  const monthsToRetirement = yearsToRetirement * 12;
  const monthlyReturn = expectedReturn / 100 / 12;
  
  // Future value of current savings
  const futureValueCurrent = currentSavings * Math.pow(1 + monthlyReturn, monthsToRetirement);
  
  // Future value of monthly contributions
  const futureValueContributions = monthlyContribution * ((Math.pow(1 + monthlyReturn, monthsToRetirement) - 1) / monthlyReturn);
  
  const totalFutureValue = futureValueCurrent + futureValueContributions;
  const totalContributions = monthlyContribution * monthsToRetirement;
  const totalGrowth = totalFutureValue - currentSavings - totalContributions;
  
  return {
    futureValue: totalFutureValue,
    totalContributions,
    totalGrowth,
    yearsToRetirement
  };
};

export const calculateInflationImpact = (currentAmount, inflationRate, years) => {
  const futureValue = currentAmount * Math.pow(1 + inflationRate / 100, years);
  const purchasingPowerLoss = currentAmount - (currentAmount / Math.pow(1 + inflationRate / 100, years));
  
  return {
    futureValue,
    currentPurchasingPower: currentAmount / Math.pow(1 + inflationRate / 100, years),
    purchasingPowerLoss
  };
};

export const compareBudgetMethods = (income) => {
  return {
    fiftyThirtyTwenty: {
      needs: income * 0.5,
      wants: income * 0.3,
      savings: income * 0.2
    },
    eightyTwenty: {
      expenses: income * 0.8,
      savings: income * 0.2
    },
    zeroBased: {
      description: 'Every dollar assigned a specific purpose',
      totalAllocated: income
    }
  };
};