'use client'
import React, { useState } from 'react';
import { Calculator, RefreshCw } from 'lucide-react';
import HamburgerWithSidebar from '@/components/ui/HamburgerWithSidebar';
import KkudaHeader from "@/components/ui/KkudaHeader";
import KkudaFooter from '@/components/ui/KkudaFooter';

interface PaymentRow {
  round: number;
  principal: number;
  interest: number;
  totalPayment: number;
  remainingBalance: number;
}

interface Summary {
  totalRounds: number;
  totalPrincipal: number;
  totalInterest: number;
  totalPaid: number;
}

type RepaymentMethod = 'maturity' | 'equalP' | 'equalPni';

export default function App() {
  const [loanAmount, setLoanAmount] = useState<string>('');
  const [loanPeriod, setLoanPeriod] = useState<string>('');
  const [loanRate, setLoanRate] = useState<string>('');
  const [periodUnit, setPeriodUnit] = useState<'year' | 'month'>('month');
  const [repaymentMethod, setRepaymentMethod] = useState<RepaymentMethod>('equalPni');
  const [paymentRows, setPaymentRows] = useState<PaymentRow[]>([]);
  const [summary, setSummary] = useState<Summary>({
    totalRounds: 0,
    totalPrincipal: 0,
    totalInterest: 0,
    totalPaid: 0
  });

  const incrementLoanAmount = (amount: number) => {
    const currentAmount = parseInt(loanAmount) || 0;
    setLoanAmount((currentAmount + amount).toString());
  };

  const incrementLoanPeriod = (period: number) => {
    const currentPeriod = parseInt(loanPeriod) || 0;
    setLoanPeriod((currentPeriod + period).toString());
  };

  const incrementLoanRate = (rate: number) => {
    const currentRate = parseFloat(loanRate) || 0;
    setLoanRate((currentRate + rate).toString());
  };

  const resetForm = () => {
    setLoanAmount('0');
    setLoanPeriod('0');
    setLoanRate('0');
    setPeriodUnit('month');
    setRepaymentMethod('equalPni');
    setPaymentRows([]);
    setSummary({
      totalRounds: 0,
      totalPrincipal: 0,
      totalInterest: 0,
      totalPaid: 0
    });
  };

  const calculate = () => {
    const loanAmountNum = parseInt(loanAmount) || 0;
    const loanRateNum = parseFloat(loanRate) || 0;
    let loanPeriodNum = parseInt(loanPeriod) || 0;

    // Convert years to months if needed
    if (periodUnit === 'year') {
      loanPeriodNum = loanPeriodNum * 12;
    }

    if (loanAmountNum <= 0 || loanRateNum < 0 || loanPeriodNum <= 0) {
      alert('올바른 값을 입력해주세요.');
      return;
    }

    const monthlyRate = loanRateNum / 100 / 12;
    let totalInterest = 0;
    let schedule: PaymentRow[] = [];
    let monthlyPayment = 0;

    if (repaymentMethod === 'maturity') {
      // 만기일시상환
      const monthlyInterest = loanAmountNum * monthlyRate;
      totalInterest = monthlyInterest * loanPeriodNum;

      for (let i = 1; i <= loanPeriodNum; i++) {
        const isLast = i === loanPeriodNum;
        const interest = monthlyInterest;
        const principal = isLast ? loanAmountNum : 0;
        const total = interest + principal;
        const left = isLast ? 0 : loanAmountNum;

        schedule.push({
          round: i,
          interest: Math.round(interest),
          principal: Math.round(principal),
          totalPayment: Math.round(total),
          remainingBalance: left,
        });
      }
    } else if (repaymentMethod === 'equalP') {
      // 원금균등상환
      const fixPrincipal = loanAmountNum / loanPeriodNum;
      let balance = loanAmountNum;

      for (let i = 1; i <= loanPeriodNum; i++) {
        const interest = balance * monthlyRate;
        const principal = fixPrincipal;
        const total = interest + principal;
        balance -= principal;

        schedule.push({
          round: i,
          interest: Math.round(interest),
          principal: Math.round(principal),
          totalPayment: Math.round(total),
          remainingBalance: Math.max(0, Math.round(balance)),
        });

        totalInterest += interest;
      }
    } else if (repaymentMethod === 'equalPni') {
      // 원리금균등상환
      monthlyPayment = (loanAmountNum * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -loanPeriodNum));
      let balance = loanAmountNum;

      for (let i = 1; i <= loanPeriodNum; i++) {
        const interest = balance * monthlyRate;
        const principal = i === loanPeriodNum ? balance - interest : monthlyPayment - interest;
        const total = i === loanPeriodNum ? balance : principal + interest;
        balance -= principal;
        if (i === loanPeriodNum) balance -= interest;

        schedule.push({
          round: i,
          interest: Math.round(interest),
          principal: Math.round(principal),
          totalPayment: Math.round(total),
          remainingBalance: Math.max(0, Math.round(balance)),
        });

        totalInterest += interest;
      }
    }

    setPaymentRows(schedule);
    setSummary({
      totalRounds: loanPeriodNum,
      totalPrincipal: loanAmountNum,
      totalInterest: Math.round(totalInterest),
      totalPaid: repaymentMethod === 'equalPni' 
        ? Math.round(monthlyPayment * loanPeriodNum)
        : loanAmountNum + Math.round(totalInterest)
    });
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (<div>
              <HamburgerWithSidebar />
    <div className="min-h-screen ">
        <KkudaHeader />
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-3 pt-6">
          <Calculator className="h-8 w-8 text-orange-500" />
          <h1 className="text-3xl font-bold text-gray-900">대출 상환 계산기</h1>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          {/* 대출금액 */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-xl font-medium text-gray-700">대출금액</label>
              <span className="text-2xl font-bold text-gray-900">{parseInt(loanAmount || '0').toLocaleString()} 원</span>
            </div>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-lg"
              placeholder="예: 1000000"
            />
            <div className="flex gap-2">
              <button
                onClick={() => incrementLoanAmount(1000000)}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                +100만
              </button>
              <button
                onClick={() => incrementLoanAmount(10000000)}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                +1,000만
              </button>
              <button
                onClick={() => incrementLoanAmount(100000000)}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                +1억
              </button>
            </div>
          </div>

          {/* 대출기간 */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-xl font-medium text-gray-700">대출기간</label>
              <span className="text-2xl font-bold text-gray-900">
                {loanPeriod} {periodUnit === 'year' ? '년' : '개월'}
              </span>
            </div>
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setPeriodUnit('month')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  periodUnit === 'month' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                월
              </button>
              <button
                onClick={() => setPeriodUnit('year')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  periodUnit === 'year' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                년
              </button>
            </div>
            {periodUnit === 'year' ? (<input
              type="number"
              value={loanPeriod}
              onChange={(e) => setLoanPeriod(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-lg"
              placeholder="예: 1"
            />):(<input
              type="number"
              value={loanPeriod}
              onChange={(e) => setLoanPeriod(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-lg"
              placeholder="예: 12"
            />)}
            
            <div className="flex gap-2">
              {periodUnit === 'year' ? (
                <>
                  <button
                    onClick={() => incrementLoanPeriod(1)}
                    className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    +1년
                  </button>
                  <button
                    onClick={() => incrementLoanPeriod(5)}
                    className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    +5년
                  </button>
                  <button
                    onClick={() => incrementLoanPeriod(10)}
                    className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    +10년
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => incrementLoanPeriod(1)}
                    className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    +1개월
                  </button>
                  <button
                    onClick={() => incrementLoanPeriod(3)}
                    className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    +3개월
                  </button>
                  <button
                    onClick={() => incrementLoanPeriod(6)}
                    className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    +6개월
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 대출금리 */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-xl font-medium text-gray-700">대출금리</label>
              <span className="text-2xl font-bold text-gray-900">{loanRate} %</span>
            </div>
            <input
              type="number"
              value={loanRate}
              onChange={(e) => setLoanRate(e.target.value)}
              step="0.1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-lg"
              placeholder="예: 2.5"
            />
            <div className="flex gap-2">
              <button
                onClick={() => incrementLoanRate(0.1)}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                +0.1%
              </button>
              <button
                onClick={() => incrementLoanRate(0.5)}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                +0.5%
              </button>
              <button
                onClick={() => incrementLoanRate(1)}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                +1.0%
              </button>
            </div>
          </div>

          {/* 상환방법 */}
          <div className="space-y-3">
            <label className="block text-xl font-medium text-gray-700">상환방법</label>
            <div className="flex gap-2">
              <button
                onClick={() => setRepaymentMethod('equalPni')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                  repaymentMethod === 'equalPni'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                원리금균등
              </button>
              <button
                onClick={() => setRepaymentMethod('equalP')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                  repaymentMethod === 'equalP'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                원금균등
              </button>
              <button
                onClick={() => setRepaymentMethod('maturity')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                  repaymentMethod === 'maturity'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                만기일시
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={resetForm}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-6 py-3 flex items-center justify-center space-x-2 font-medium transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
              <span>초기화</span>
            </button>
            <button
              onClick={calculate}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-6 py-3 flex items-center justify-center space-x-2 font-medium transition-colors"
            >
              <Calculator className="h-5 w-5" />
              <span>계산하기</span>
            </button>
          </div>
        </div>

        {/* Summary Table */}
        {summary.totalRounds > 0 && (
          <div>
            <h2 className="px-2 py-4 text-2xl font-bold text-black">요약</h2>
            <div className="border border-gray-200 overflow-hidden ">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-medium font-medium text-gray-700">대출원금</th>
                      <th className="px-4 py-3 text-right text-medium font-medium text-gray-700">대출기간</th>
                      <th className="px-4 py-3 text-right text-medium font-medium text-gray-700">연이율</th>
                      <th className="px-4 py-3 text-right text-medium font-medium text-gray-700">총 이자액(원)</th>
                      <th className="px-4 py-3 text-right text-medium font-medium text-gray-700">총 상환금액(원)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-200">
                      <td className="px-4 py-3 text-medium text-gray-900">{formatNumber(summary.totalPrincipal)} 원</td>
                      <td className="px-4 py-3 text-medium text-gray-900 text-right">{summary.totalRounds} 개월</td>
                      <td className="px-4 py-3 text-medium text-gray-900 text-right">{loanRate}%</td>
                      <td className="px-4 py-3 text-medium text-orange-600 text-right font-medium">
                        {formatNumber(summary.totalInterest)}
                      </td>
                      <td className="px-4 py-3 text-medium text-gray-900 text-right font-bold">
                        {formatNumber(summary.totalPaid)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Payment Schedule Table */}
        {paymentRows.length > 0 && (
          <div>
            <h2 className="px-2 py-4 text-2xl font-bold text-black">상환표</h2>
            <div className="border border-gray-200 overflow-hidden ">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-center text-medium font-medium text-gray-700">회차</th>
                      <th className="px-4 py-3 text-right text-medium font-medium text-gray-700">원금(원)</th>
                      <th className="px-4 py-3 text-right text-medium font-medium text-gray-700">이자액(원)</th>
                      <th className="px-4 py-3 text-right text-medium font-medium text-gray-700">납부액(원)</th>
                      <th className="px-4 py-3 text-right text-medium font-medium text-gray-700">대출잔액(원)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentRows.map((row, index) => (
                      <tr key={index} className="border-t border-gray-200">
                        <td className="px-4 py-3 text-medium text-gray-900 text-center">{row.round}</td>
                        <td className="px-4 py-3 text-medium text-gray-900 text-right">
                          {formatNumber(row.principal)}
                        </td>
                        <td className="px-4 py-3 text-medium text-orange-500 text-right">
                          {formatNumber(row.interest)}
                        </td>
                        <td className="px-4 py-3 text-medium text-gray-900 text-right font-medium">
                          {formatNumber(row.totalPayment)}
                        </td>
                        <td className="px-4 py-3 text-medium text-gray-600 text-right">
                          {formatNumber(row.remainingBalance)}
                        </td>
                      </tr>
                    ))}
                    {/* Total Row */}
                    <tr className="border-t-2 border-gray-200 bg-gray-100 font-bold">
                      <td className="px-4 py-3 text-medium text-gray-900 text-center">합계</td>
                      <td className="px-4 py-3 text-medium text-gray-900 text-right">
                        {formatNumber(summary.totalPrincipal)}
                      </td>
                      <td className="px-4 py-3 text-medium text-orange-500 text-right">
                        {formatNumber(summary.totalInterest)}
                      </td>
                      <td className="px-4 py-3 text-medium text-gray-900 text-right">
                        {formatNumber(summary.totalPaid)}
                      </td>
                      <td className="px-4 py-3 text-medium text-gray-600 text-right">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    <KkudaFooter />
    </div>
  );
  
}