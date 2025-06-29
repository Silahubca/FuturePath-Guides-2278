import React,{useState} from 'react'
import {motion,AnimatePresence} from 'framer-motion'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const {FiCalculator,FiDollarSign,FiTrendingUp,FiCreditCard,FiHome}=FiIcons

const InteractiveCalculators=()=> {
  const [activeCalculator,setActiveCalculator]=useState('debt')

  const calculators=[
    {id: 'debt',label: 'Debt Payoff',icon: FiCreditCard},
    {id: 'savings',label: 'Savings Goal',icon: FiDollarSign},
    {id: 'investment',label: 'Investment ROI',icon: FiTrendingUp},
    {id: 'mortgage',label: 'Mortgage',icon: FiHome}
  ]

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
      initial={{opacity: 0,y: 20}}
      animate={{opacity: 1,y: 0}}
      transition={{duration: 0.6}}
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <SafeIcon icon={FiCalculator} className="mr-2 text-blue-600" />
        Financial Calculators
      </h3>

      {/* Calculator Tabs - Mobile Responsive */}
      <div className="flex flex-wrap sm:flex-nowrap gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
        {calculators.map(calc=> (
          <button
            key={calc.id}
            onClick={()=> setActiveCalculator(calc.id)}
            className={`flex-1 flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 px-2 sm:px-3 rounded-md transition-all duration-300 min-w-0 ${
              activeCalculator===calc.id 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <SafeIcon icon={calc.icon} className="text-sm flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-center truncate">{calc.label}</span>
          </button>
        ))}
      </div>

      {/* Calculator Content */}
      <AnimatePresence mode="wait">
        {activeCalculator==='debt' && <DebtPayoffCalculator key="debt" />}
        {activeCalculator==='savings' && <SavingsGoalCalculator key="savings" />}
        {activeCalculator==='investment' && <InvestmentROICalculator key="investment" />}
        {activeCalculator==='mortgage' && <MortgageCalculator key="mortgage" />}
      </AnimatePresence>
    </motion.div>
  )
}

const DebtPayoffCalculator=()=> {
  const [values,setValues]=useState({balance: '',interestRate: '',monthlyPayment: ''})
  const [result,setResult]=useState(null)

  const calculate=()=> {
    const balance=parseFloat(values.balance)
    const rate=parseFloat(values.interestRate) / 100 / 12
    const payment=parseFloat(values.monthlyPayment)

    if (balance && rate && payment) {
      if (payment <= balance * rate) {
        setResult({error: 'Monthly payment must be greater than monthly interest to pay off debt'})
        return
      }
      
      const months=Math.ceil(-Math.log(1 - (balance * rate) / payment) / Math.log(1 + rate))
      const totalPaid=payment * months
      const totalInterest=totalPaid - balance

      setResult({
        months,
        years: Math.floor(months / 12),
        remainingMonths: months % 12,
        totalPaid,
        totalInterest
      })
    } else {
      setResult({error: 'Please fill in all fields with valid numbers'})
    }
  }

  return (
    <motion.div
      initial={{opacity: 0,x: 20}}
      animate={{opacity: 1,x: 0}}
      exit={{opacity: 0,x: -20}}
      transition={{duration: 0.3}}
    >
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Balance ($)
            </label>
            <input
              type="number"
              value={values.balance}
              onChange={(e)=> setValues(prev=> ({...prev,balance: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              placeholder="10000"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interest Rate (% annual)
            </label>
            <input
              type="number"
              step="0.01"
              value={values.interestRate}
              onChange={(e)=> setValues(prev=> ({...prev,interestRate: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              placeholder="18.5"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Payment ($)
            </label>
            <input
              type="number"
              value={values.monthlyPayment}
              onChange={(e)=> setValues(prev=> ({...prev,monthlyPayment: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              placeholder="300"
            />
          </div>
          
          <button
            onClick={calculate}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Calculate Payoff
          </button>
        </div>

        {result && (
          <div className="bg-blue-50 p-4 sm:p-6 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-3">Payoff Results</h4>
            {result.error ? (
              <div className="text-red-700 text-sm">{result.error}</div>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Time to payoff:</span>
                  <span className="font-medium text-blue-900">
                    {result.years}y {result.remainingMonths}m
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Total paid:</span>
                  <span className="font-medium text-blue-900">
                    ${result.totalPaid.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Total interest:</span>
                  <span className="font-medium text-red-600">
                    ${result.totalInterest.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

const SavingsGoalCalculator=()=> {
  const [values,setValues]=useState({goal: '',currentSavings: '',monthlyContribution: '',interestRate: ''})
  const [result,setResult]=useState(null)

  const calculate=()=> {
    const goal=parseFloat(values.goal)
    const current=parseFloat(values.currentSavings) || 0
    const monthly=parseFloat(values.monthlyContribution)
    const rate=parseFloat(values.interestRate) / 100 / 12

    if (goal && monthly && goal > current) {
      const remaining=goal - current
      
      if (rate > 0) {
        const months=Math.ceil(Math.log(1 + (remaining * rate) / monthly) / Math.log(1 + rate))
        const totalContributed=monthly * months
        const interestEarned=goal - current - totalContributed
        
        setResult({
          months,
          years: Math.floor(months / 12),
          remainingMonths: months % 12,
          totalContributed,
          interestEarned: Math.max(0, interestEarned)
        })
      } else {
        const months=Math.ceil(remaining / monthly)
        setResult({
          months,
          years: Math.floor(months / 12),
          remainingMonths: months % 12,
          totalContributed: monthly * months,
          interestEarned: 0
        })
      }
    } else {
      setResult({error: 'Please fill in all fields. Goal must be greater than current savings.'})
    }
  }

  return (
    <motion.div
      initial={{opacity: 0,x: 20}}
      animate={{opacity: 1,x: 0}}
      exit={{opacity: 0,x: -20}}
      transition={{duration: 0.3}}
    >
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Savings Goal ($)
            </label>
            <input
              type="number"
              value={values.goal}
              onChange={(e)=> setValues(prev=> ({...prev,goal: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
              placeholder="20000"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Savings ($)
            </label>
            <input
              type="number"
              value={values.currentSavings}
              onChange={(e)=> setValues(prev=> ({...prev,currentSavings: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
              placeholder="5000"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Contribution ($)
            </label>
            <input
              type="number"
              value={values.monthlyContribution}
              onChange={(e)=> setValues(prev=> ({...prev,monthlyContribution: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
              placeholder="500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interest Rate (% annual)
            </label>
            <input
              type="number"
              step="0.01"
              value={values.interestRate}
              onChange={(e)=> setValues(prev=> ({...prev,interestRate: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
              placeholder="4.5"
            />
          </div>
          
          <button
            onClick={calculate}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Calculate Timeline
          </button>
        </div>

        {result && (
          <div className="bg-green-50 p-4 sm:p-6 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-3">Goal Timeline</h4>
            {result.error ? (
              <div className="text-red-700 text-sm">{result.error}</div>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-700">Time to reach goal:</span>
                  <span className="font-medium text-green-900">
                    {result.years}y {result.remainingMonths}m
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Total contributed:</span>
                  <span className="font-medium text-green-900">
                    ${result.totalContributed.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Interest earned:</span>
                  <span className="font-medium text-green-600">
                    ${result.interestEarned.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

const InvestmentROICalculator=()=> {
  const [values,setValues]=useState({initialInvestment: '',monthlyContribution: '',expectedReturn: '',years: ''})
  const [result,setResult]=useState(null)

  const calculate=()=> {
    const initial=parseFloat(values.initialInvestment) || 0
    const monthly=parseFloat(values.monthlyContribution) || 0
    const rate=parseFloat(values.expectedReturn) / 100 / 12
    const months=parseFloat(values.years) * 12

    if ((initial > 0 || monthly > 0) && rate >= 0 && months > 0) {
      const futureValueInitial=initial * Math.pow(1 + rate,months)
      const futureValueMonthly=monthly > 0 ? monthly * ((Math.pow(1 + rate,months) - 1) / rate) : 0
      const totalFutureValue=futureValueInitial + futureValueMonthly
      const totalInvested=initial + (monthly * months)
      const totalGain=totalFutureValue - totalInvested

      setResult({
        futureValue: totalFutureValue,
        totalInvested,
        totalGain,
        roi: totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0
      })
    } else {
      setResult({error: 'Please enter valid values for investment amount, return rate, and time period.'})
    }
  }

  return (
    <motion.div
      initial={{opacity: 0,x: 20}}
      animate={{opacity: 1,x: 0}}
      exit={{opacity: 0,x: -20}}
      transition={{duration: 0.3}}
    >
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Initial Investment ($)
            </label>
            <input
              type="number"
              value={values.initialInvestment}
              onChange={(e)=> setValues(prev=> ({...prev,initialInvestment: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
              placeholder="10000"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Contribution ($)
            </label>
            <input
              type="number"
              value={values.monthlyContribution}
              onChange={(e)=> setValues(prev=> ({...prev,monthlyContribution: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
              placeholder="500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Annual Return (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={values.expectedReturn}
              onChange={(e)=> setValues(prev=> ({...prev,expectedReturn: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
              placeholder="7"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Investment Period (Years)
            </label>
            <input
              type="number"
              value={values.years}
              onChange={(e)=> setValues(prev=> ({...prev,years: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
              placeholder="10"
            />
          </div>
          
          <button
            onClick={calculate}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Calculate Returns
          </button>
        </div>

        {result && (
          <div className="bg-purple-50 p-4 sm:p-6 rounded-lg">
            <h4 className="font-semibold text-purple-900 mb-3">Investment Results</h4>
            {result.error ? (
              <div className="text-red-700 text-sm">{result.error}</div>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-700">Future Value:</span>
                  <span className="font-medium text-purple-900">
                    ${result.futureValue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Total Invested:</span>
                  <span className="font-medium text-purple-900">
                    ${result.totalInvested.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Total Gain:</span>
                  <span className="font-medium text-green-600">
                    ${result.totalGain.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">ROI:</span>
                  <span className="font-medium text-green-600">
                    {result.roi.toFixed(1)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

const MortgageCalculator=()=> {
  const [values,setValues]=useState({homePrice: '',downPayment: '',loanTerm: '30',interestRate: ''})
  const [result,setResult]=useState(null)

  const calculate=()=> {
    const price=parseFloat(values.homePrice)
    const down=parseFloat(values.downPayment)
    const principal=price - down
    const rate=parseFloat(values.interestRate) / 100 / 12
    const months=parseFloat(values.loanTerm) * 12

    if (price > 0 && down >= 0 && down < price && rate > 0 && months > 0) {
      const monthlyPayment=principal * (rate * Math.pow(1 + rate,months)) / (Math.pow(1 + rate,months) - 1)
      const totalPaid=monthlyPayment * months
      const totalInterest=totalPaid - principal

      setResult({
        monthlyPayment,
        totalPaid,
        totalInterest,
        principal,
        downPaymentPercent: (down / price) * 100
      })
    } else {
      setResult({error: 'Please enter valid values. Down payment must be less than home price.'})
    }
  }

  return (
    <motion.div
      initial={{opacity: 0,x: 20}}
      animate={{opacity: 1,x: 0}}
      exit={{opacity: 0,x: -20}}
      transition={{duration: 0.3}}
    >
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Home Price ($)
            </label>
            <input
              type="number"
              value={values.homePrice}
              onChange={(e)=> setValues(prev=> ({...prev,homePrice: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
              placeholder="400000"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Down Payment ($)
            </label>
            <input
              type="number"
              value={values.downPayment}
              onChange={(e)=> setValues(prev=> ({...prev,downPayment: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
              placeholder="80000"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Term (Years)
            </label>
            <select
              value={values.loanTerm}
              onChange={(e)=> setValues(prev=> ({...prev,loanTerm: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
            >
              <option value="15">15 years</option>
              <option value="30">30 years</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interest Rate (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={values.interestRate}
              onChange={(e)=> setValues(prev=> ({...prev,interestRate: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
              placeholder="6.5"
            />
          </div>
          
          <button
            onClick={calculate}
            className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
          >
            Calculate Payment
          </button>
        </div>

        {result && (
          <div className="bg-orange-50 p-4 sm:p-6 rounded-lg">
            <h4 className="font-semibold text-orange-900 mb-3">Mortgage Results</h4>
            {result.error ? (
              <div className="text-red-700 text-sm">{result.error}</div>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-orange-700">Monthly Payment:</span>
                  <span className="font-medium text-orange-900">
                    ${result.monthlyPayment.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-700">Loan Amount:</span>
                  <span className="font-medium text-orange-900">
                    ${result.principal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-700">Down Payment:</span>
                  <span className="font-medium text-orange-900">
                    {result.downPaymentPercent.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-700">Total Paid:</span>
                  <span className="font-medium text-orange-900">
                    ${result.totalPaid.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-700">Total Interest:</span>
                  <span className="font-medium text-red-600">
                    ${result.totalInterest.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default InteractiveCalculators