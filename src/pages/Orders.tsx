import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Orders: React.FC = () => {
  return (
    <div className="space-y-6 select-none animate-in fade-in duration-300">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0f172a] m-0">
          Orders
        </h1>
      </div>

      {/* Main Empty State Content Container */}
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white border border-slate-100/60 rounded-3xl p-12 text-center shadow-sm">
        
        {/* Jagged Clipboard Checklist SVG */}
        <div className="relative mb-6">
          <svg className="w-24 h-28" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Clipboard Top Clip backing (shadowy tab) */}
            <rect x="42" y="12" width="16" height="8" rx="2" fill="#475569" opacity="0.4" />
            
            {/* Main Sheet with Jagged/Teeth Bottom */}
            <path 
              d="M20 20 H80 V98 L75 94 L70 98 L65 94 L60 98 L55 94 L50 98 L45 94 L40 98 L35 94 L30 98 L25 94 L20 98 Z" 
              fill="#2e3b5e" 
              stroke="#202a45"
              strokeWidth="1.5"
            />
            
            {/* Clipboard Metallic Top Clip */}
            <rect x="35" y="14" width="30" height="9" rx="3" fill="#64748b" />
            <rect x="40" y="16" width="20" height="5" rx="1.5" fill="#94a3b8" />
            
            {/* White Checkmarks */}
            <path d="M30 42 l3 3 l6 -6" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M30 58 l3 3 l6 -6" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M30 74 l3 3 l6 -6" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* White Horizontal Checklist Lines */}
            <line x1="46" y1="41" x2="72" y2="41" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="46" y1="57" x2="72" y2="57" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="46" y1="73" x2="72" y2="73" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Text descriptions */}
        <h3 className="text-xl font-bold text-[#0f172a] m-0 mb-2 select-none">
          No Orders Yet
        </h3>
        <p className="text-slate-500 text-sm max-w-sm m-0 leading-relaxed">
          All the upcoming orders from your store will be visible in this page.
        </p>
        <p className="text-slate-500 text-sm max-w-sm m-0 leading-relaxed mt-0.5">
          You can add orders by yourself if you sell offline.
        </p>

        {/* Blue Action Button */}
        <Button 
          className="mt-6 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg px-6 py-3 font-semibold text-sm shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150"
        >
          <Plus className="w-4 h-4" />
          Add order
        </Button>

      </div>

    </div>
  );
};

export default Orders;
