'use client';

import { useState } from 'react';
import { Calculator, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
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

export default function InstallmentCalculatorPage() {
    const router = useRouter();
    const [loanAmount, setLoanAmount] = useState<string>('');
    const [annualInterestRate, setAnnualInterestRate] = useState<string>('');
    const [loanTerm, setLoanTerm] = useState<string>('');
    const [paymentRows, setPaymentRows] = useState<PaymentRow[]>([]);
    const [summary, setSummary] = useState<Summary>({
        totalRounds: 0,
        totalPrincipal: 0,
        totalInterest: 0,
        totalPaid: 0
    });

    const handleBack = () => {
        router.push('/');
    };

    const calculate = () => {
        const loanAmountNum = parseInt(loanAmount) || 0;
        const annualInterestRateNum = parseFloat(annualInterestRate) || 0;
        const loanTermNum = parseInt(loanTerm) || 0;

        if (loanAmountNum <= 0 || annualInterestRateNum < 0 || loanTermNum <= 0) {
            alert('올바른 값을 입력해주세요.');
            return;
        }

        const monthlyInterestRate = (annualInterestRateNum / 100) / 12;
        const principalPayment = loanTermNum > 0 ? loanAmountNum / loanTermNum : 0;

        let remainingBalance = loanAmountNum;
        let totalPrincipal = 0;
        let totalInterest = 0;
        let totalPaidAmount = 0;
        const rows: PaymentRow[] = [];

        for (let i = 1; i <= loanTermNum; i++) {
            const interestPayment = Math.round(remainingBalance * monthlyInterestRate);
            const totalPayment = Math.round(principalPayment + interestPayment);
            remainingBalance -= principalPayment;

            totalPrincipal += principalPayment;
            totalInterest += interestPayment;
            totalPaidAmount += totalPayment;

            rows.push({
                round: i,
                principal: Math.round(principalPayment),
                interest: interestPayment,
                totalPayment: totalPayment,
                remainingBalance: Math.round(Math.max(remainingBalance, 0))
            });
        }

        setPaymentRows(rows);
        setSummary({
            totalRounds: loanTermNum,
            totalPrincipal: Math.round(totalPrincipal),
            totalInterest: totalInterest,
            totalPaid: totalPaidAmount
        });
    };

    const formatNumber = (num: number) => {
        return num.toLocaleString();
    };

    return (
        <div>
            <HamburgerWithSidebar />
            <div className="min-h-screen">
                <KkudaHeader />

                {/* Content */}
                <div className="mobile-container py-6 space-y-6 ">
                    
                    {/* Page Title */}
                    <div className="flex items-center space-x-3 pt-6">
                        <Calculator className="h-8 w-8 text-orange-500" />
                        <h1 className="text-3xl font-bold text-gray-900">할부이자 계산기</h1>
                    </div>

                    {/* Input Form */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700 mb-2">
                                    상품금액(원)
                                </label>
                                <input
                                    type="number"
                                    id="loanAmount"
                                    value={loanAmount}
                                    onChange={(e) => setLoanAmount(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="예: 1000000"
                                />
                            </div>

                            <div>
                                <label htmlFor="annualInterestRate" className="block text-sm font-medium text-gray-700 mb-2">
                                    연이율(%)
                                </label>
                                <input
                                    type="number"
                                    id="annualInterestRate"
                                    value={annualInterestRate}
                                    onChange={(e) => setAnnualInterestRate(e.target.value)}
                                    step="0.1"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="예: 12.5"
                                />
                            </div>

                            <div>
                                <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700 mb-2">
                                    상환기간(개월)
                                </label>
                                <input
                                    type="number"
                                    id="loanTerm"
                                    value={loanTerm}
                                    onChange={(e) => setLoanTerm(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="예: 12"
                                />
                            </div>
                        </div>

                        <div className="flex justify-center pt-4">
                            <Button
                                onClick={calculate}
                                className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-8 py-2 flex items-center space-x-2"
                            >
                                
                                <span>계산하기</span>
                            </Button>
                        </div>
                    </div>

                    {/* Summary Table */}
                    {summary.totalRounds > 0 && (
                        <div>

                            <h2 className=" px-2 py-4 text-2xl font-bold text-black">요약</h2>
                            <div className="border border-gray-200 overflow-hidden ">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>

                                                <th className="px-4 py-3 text-left text-medium font-medium text-gray-700 ">총 회차</th>
                                                <th className="px-4 py-3 text-right text-medium font-medium text-gray-700 ">총 원금(원)</th>
                                                <th className="px-4 py-3 text-right text-medium font-medium text-gray-700 ">총 이자액(원)</th>
                                                <th className="px-4 py-3 text-right text-medium font-medium text-gray-700 ">총 납부액(원)</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-t border-gray-200">
                                                <td className="px-4 py-3 text-medium text-gray-900">{summary.totalRounds}</td>
                                                <td className="px-4 py-3 text-medium text-gray-900 text-right font-medium">
                                                    {formatNumber(summary.totalPrincipal)}
                                                </td>
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
                            
                                <h2 className="px-2 py-4 text-2xl font-bold text-black">계산결과</h2>
                                <div className=" border border-gray-200 overflow-hidden ">
                           
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-center text-medium font-medium text-gray-700">회차</th>
                                            <th className="px-4 py-3 text-right text-medium font-medium text-gray-700">원금(원)</th>
                                            <th className="px-4 py-3 text-right text-medium font-medium text-gray-700">이자액(원)</th>
                                            <th className="px-4 py-3 text-right text-medium font-medium text-gray-700">납부액(원)</th>
                                            <th className="px-4 py-3 text-right text-medium font-medium text-gray-700">잔액(원)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paymentRows.map((row, index) => (
                                            <tr key={index} className="border-t border-gray-200 ">
                                                <td className="px-4 py-3 text-medium text-gray-900 text-center">{row.round}</td>
                                                <td className="px-4 py-3 text-medium text-gray-900 text-right">
                                                    {formatNumber(row.principal)}
                                                </td>
                                                <td className="px-4 py-3 text-medium text-orange-600 text-right">
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
                                        <tr className=" border-t-2 border-gray-200 bg-gray-100 font-bold">
                                            <td className="px-4 py-3 text-medium text-gray-900 text-center">합계</td>
                                            <td className="px-4 py-3 text-medium text-gray-900 text-right">
                                                {formatNumber(summary.totalPrincipal)}
                                            </td>
                                            <td className="px-4 py-3 text-medium text-orange-600 text-right">
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