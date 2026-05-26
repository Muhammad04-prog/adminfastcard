import React from 'react';
import { X } from 'lucide-react';

interface ColorModalProps {
  show: boolean;
  name: string;
  hex: string;
  setName: (val: string) => void;
  setHex: (val: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export const ColorModal: React.FC<ColorModalProps> = ({
  show,
  name,
  hex,
  setName,
  setHex,
  onClose,
  onSubmit,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200 select-none">
      <div className="bg-white p-6 rounded-2xl w-full max-w-sm border border-slate-100 shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          type="button"
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 focus:outline-none"
        >
          <X className="w-5 h-5 stroke-[2.2]" />
        </button>

        <h3 className="text-lg font-bold text-[#0f172a] m-0 mb-4 select-none">
          New color
        </h3>

        <div className="grid grid-cols-3 gap-3 items-center mb-6">
          <div className="col-span-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Color name
            </label>
            <input
              type="text"
              placeholder="e.g. Dark blue"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 placeholder-slate-400 focus:outline-none text-sm font-semibold"
            />
          </div>
          <div className="relative">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Color value
            </label>
            
            {/* Dynamic Swatch Swell Trigger */}
            <label className="border border-slate-200 rounded-lg p-2 flex items-center justify-between cursor-pointer hover:border-slate-300 transition-all duration-100 bg-white min-h-[42px] select-none shadow-sm relative">
              <input
                type="color"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
              />
              <div 
                className="w-5 h-5 rounded shadow-sm border border-slate-200/50 flex-shrink-0" 
                style={{ backgroundColor: hex }}
              />
              <span className="text-slate-600 text-[10px] font-bold font-mono pl-1.5 truncate mr-auto">
                {hex}
              </span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full justify-end">
          <button 
            type="button"
            onClick={onClose}
            className="border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg px-5 py-2.5 font-bold text-xs bg-white focus:outline-none"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={onSubmit}
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg px-5 py-2.5 font-bold text-xs focus:outline-none"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};
