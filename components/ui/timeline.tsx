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
        amount: "450만원 이상",
        count: "11건", 
        date: "1월 11일",
      }
    ]
  },
  {
    year: "2021년",
    milestones: [
      {
        amount: "9,000만원 이상",
        count: "555건",
        date: "11월 14일",
      },
      {
        amount: "1,000만원 이상",
        count: "11111건",
        date: "7월 27일",
      },
      {
        amount: "1,000만원 이상",
        count: "1111건",
        date: "1월 5일",
      }
    ]
  }
];


export default function Timeline() {
  return (
    <div className="relative max-w-4xl mx-auto p-6">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-black"></div>
      
      {timelineData.map((yearData, yearIndex) => (
        <div key={yearData.year} className="relative mb-12">
          {/* Year marker */}
          <div className="flex items-center mb-8">
            
            <div className="ml-8">
              <h2 className="text-2xl font-bold text-gray-800">{yearData.year}</h2>
            </div>
          </div>

          {/* Milestones */}
          <div className="ml-16 space-y-6">
            {yearData.milestones.map((milestone, milestoneIndex) => (
              <div
                key={milestoneIndex}
                className="relative bg-white rounded-xl  border border-gray-200 p-4 "
              >
                {/* Connector line */}
                <div className="absolute -left-8 top-1/2 w-8 h-0.5 bg-gray-300"></div>
                
                {/* Milestone dot */}
                <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-orange-500  rounded-full shadow-md flex items-center justify-center text-white">
                
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-3">
                      <h3 className=" whitespace-nowrap text-xl font-semibold text-gray-800">
                        {milestone.amount}
                      </h3>
                      <span className="w-auto whitespace-nowrap px-2 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full">
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