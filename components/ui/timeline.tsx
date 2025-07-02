import React from 'react';
import { Calendar, DollarSign, TrendingUp, Award } from 'lucide-react';

interface TimelineItem {
  year: string;
  milestones: {
    amount: string;
    count: string;
    date: string;
  }[];
}

//더미데이터
const timelineData: TimelineItem[] = [
  {
    year: "2024년",
    milestones: [
      {
        amount: "5,000만원 이상",
        count: "9건",
        date: "5월 25일",
      },
      {
        amount: "450달러 이상",
        count: "11건", 
        date: "1월 11일",
      }
    ]
  },
  {
    year: "2021년",
    milestones: [
      {
        amount: "9,000달러의 이익",
        count: "555건",
        date: "11월 14일",
      },
      {
        amount: "1,000달러 이상",
        count: "9건",
        date: "7월 27일",
      },
      {
        amount: "1,000달러 이상",
        count: "9건",
        date: "1월 5일",
      }
    ]
  }
];


export default function Timeline() {
  return (
    <div className="relative max-w-4xl mx-auto p-6">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-green-200"></div>
      
      {timelineData.map((yearData, yearIndex) => (
        <div key={yearData.year} className="relative mb-12">
          {/* Year marker */}
          <div className="flex items-center mb-8">
            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-white border-4 border-indigo-500 rounded-full shadow-lg">
              <span className="text-sm font-bold text-indigo-600">{yearData.year.replace('년', '')}</span>
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold text-gray-800">{yearData.year}</h2>
            </div>
          </div>

          {/* Milestones */}
          <div className="ml-16 space-y-6">
            {yearData.milestones.map((milestone, milestoneIndex) => (
              <div
                key={milestoneIndex}
                className="relative bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Connector line */}
                <div className="absolute -left-8 top-1/2 w-8 h-0.5 bg-gray-300"></div>
                
                {/* Milestone dot */}
                <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-blue-500 border-blue-200 rounded-full border-4 border-white shadow-md flex items-center justify-center text-white">
                
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {milestone.amount}
                      </h3>
                      <span className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full">
                        {milestone.count}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{milestone.date}</span>
                    </div>
                  </div>

               
                  </div>
                </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}