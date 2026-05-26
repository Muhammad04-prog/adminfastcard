import React from 'react';
import { X, Check } from 'lucide-react';

interface OptionModalProps {
  show: boolean;
  index: number;
  values: string[];
  input: string;
  setInput: (val: string) => void;
  onClose: () => void;
  onAdd: () => void;
  onRemove: (val: string) => void;
  onSave: () => void;
}

export const OptionModal: React.FC<OptionModalProps> = ({
  show,
  index,
  values,
  input,
  setInput,
  onClose,
  onAdd,
  onRemove,
  onSave,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200 select-none">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md border border-slate-100 shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          type="button"
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 focus:outline-none"
        >
          <X className="w-5 h-5 stroke-[2.2]" />
        </button>

        <h3 className="text-lg font-bold text-[#0f172a] m-0 mb-4 select-none">
          Option {index + 1}
        </h3>

        {/* Input with checkmark button */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter value name"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onAdd();
              }
            }}
            className="flex-grow px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 placeholder-slate-400 focus:outline-none text-sm font-semibold"
          />
          <button 
            type="button"
            onClick={onAdd}
            className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-100 flex items-center justify-center flex-shrink-0 focus:outline-none"
          >
            <Check className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* List of tags */}
        <div className="flex flex-wrap gap-1.5 min-h-[46px] p-2 border border-slate-150 rounded-lg bg-slate-50/50 mb-6">
          {values.length === 0 ? (
            <span className="text-xs text-slate-400 font-semibold p-1.5 select-none">
              No tags added yet. Enter a value name above.
            </span>
          ) : (
            values.map((val) => (
              <span 
                key={val} 
                className="bg-white text-slate-700 text-xs px-2.5 py-1.5 rounded-md font-bold flex items-center gap-1.5 border border-slate-200 shadow-sm select-none animate-in scale-in duration-100"
              >
                {val}
                <X 
                  className="w-3.5 h-3.5 text-slate-400 hover:text-rose-500 cursor-pointer stroke-[2]" 
                  onClick={() => onRemove(val)}
                />
              </span>
            ))
          )}
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
            onClick={onSave}
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg px-5 py-2.5 font-bold text-xs focus:outline-none"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
