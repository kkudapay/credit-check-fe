'use client'

import React, { useState } from 'react'

type RepaymentRow = {
  회차: number
  이자: number
  원금: number
  합계: number
  대출잔액: number
}

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState<number>(10000000)
  const [loanPeriod, setLoanPeriod] = useState<number>(12)
  const [loanRate, setLoanRate] = useState<number>(5)
  const [method, setMethod] = useState<'maturity' | 'equalP' | 'equalPni'>('maturity')

  const monthlyRate = loanRate / 100 / 12
  let totalInterest = 0
  let schedule: RepaymentRow[] = []
  let monthlyPayment = 0

  if (method === 'maturity') {
    const monthlyInterest = loanAmount * monthlyRate
    totalInterest = monthlyInterest * loanPeriod

    for (let i = 1; i <= loanPeriod; i++) {
      const isLast = i === loanPeriod
      const interest = monthlyInterest
      const principal = isLast ? loanAmount : 0
      const total = interest + principal
      const left = isLast ? 0 : loanAmount

      schedule.push({
        회차: i,
        이자: Math.round(interest),
        원금: Math.round(principal),
        합계: Math.round(total),
        대출잔액: left,
      })
    }
  } else if (method === 'equalP') {
    const fixPrincipal = loanAmount / loanPeriod
    let balance = loanAmount

    for (let i = 1; i <= loanPeriod; i++) {
      const interest = balance * monthlyRate
      const principal = fixPrincipal
      const total = interest + principal
      balance -= principal

      schedule.push({
        회차: i,
        이자: Math.round(interest),
        원금: Math.round(principal),
        합계: Math.round(total),
        대출잔액: Math.max(0, Math.round(balance)),
      })

      totalInterest += interest
    }
  } else if (method === 'equalPni') {
    monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -loanPeriod))
    let balance = loanAmount

    for (let i = 1; i <= loanPeriod; i++) {
      const interest = balance * monthlyRate
      const principal = i === loanPeriod ? balance - interest : monthlyPayment - interest
      const total = i === loanPeriod ? balance : principal + interest
      balance -= principal
      if (i === loanPeriod) balance -= interest

      schedule.push({
        회차: i,
        이자: Math.round(interest),
        원금: Math.round(principal),
        합계: Math.round(total),
        대출잔액: Math.max(0, Math.round(balance)),
      })

      totalInterest += interest
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <h1 className="text-2xl font-bold">대출 상환 계산기</h1>

      {/* 입력 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium">대출금액 (원)</label>
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="mt-1 block w-full border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">대출기간 (개월)</label>
          <input
            type="number"
            value={loanPeriod}
            onChange={(e) => setLoanPeriod(Number(e.target.value))}
            className="mt-1 block w-full border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">연이율 (%)</label>
          <input
            type="number"
            value={loanRate}
            onChange={(e) => setLoanRate(Number(e.target.value))}
            className="mt-1 block w-full border px-2 py-1 rounded"
            step="0.1"
          />
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex gap-2">
        <button onClick={() => setMethod('maturity')} className={`px-4 py-2 rounded ${method === 'maturity' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
          만기일시상환
        </button>
        <button onClick={() => setMethod('equalP')} className={`px-4 py-2 rounded ${method === 'equalP' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
          원금균등상환
        </button>
        <button onClick={() => setMethod('equalPni')} className={`px-4 py-2 rounded ${method === 'equalPni' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
          원리금균등상환
        </button>
      </div>

      {/* 요약 */}
      <div>
        <h2 className="text-xl font-semibold mb-2">요약</h2>
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">대출원금</th>
              <th className="border px-2 py-1">대출기간</th>
              <th className="border px-2 py-1">연이율</th>
              <th className="border px-2 py-1">총 이자</th>
              <th className="border px-2 py-1">총 상환금액</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-2 py-1 text-right">{loanAmount.toLocaleString()} 원</td>
              <td className="border px-2 py-1 text-right">{loanPeriod} 개월</td>
              <td className="border px-2 py-1 text-right">{loanRate.toFixed(2)} %</td>
              <td className="border px-2 py-1 text-right">{Math.round(totalInterest).toLocaleString()} 원</td>
              <td className="border px-2 py-1 text-right">
                {method === 'equalPni'
                  ? Math.round(monthlyPayment * loanPeriod).toLocaleString()
                  : (loanAmount + Math.round(totalInterest)).toLocaleString()}{' '}
                원
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 상환표 */}
      <div>
        <h2 className="text-xl font-semibold mb-2">상환표</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">회차</th>
                <th className="border px-2 py-1">이자</th>
                <th className="border px-2 py-1">원금</th>
                <th className="border px-2 py-1">합계</th>
                <th className="border px-2 py-1">대출잔액</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row) => (
                <tr key={row.회차}>
                  <td className="border px-2 py-1 text-center">{row.회차}</td>
                  <td className="border px-2 py-1 text-right">{row.이자.toLocaleString()} 원</td>
                  <td className="border px-2 py-1 text-right">{row.원금.toLocaleString()} 원</td>
                  <td className="border px-2 py-1 text-right">{row.합계.toLocaleString()} 원</td>
                  <td className="border px-2 py-1 text-right">{row.대출잔액.toLocaleString()} 원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
