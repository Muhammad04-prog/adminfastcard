import React, { useState } from 'react';
import Categories from './Others/Categories';
import Brands from './Others/Brands';
import Banners from './Others/Banners';

type Tab = 'categories' | 'brands' | 'banners';

const Other: React.FC = () => {
  const [tab, setTab] = useState<Tab>('categories');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'categories', label: 'Categories' },
    { key: 'brands', label: 'Brands' },
    { key: 'banners', label: 'Banners' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Tab bar */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2.5 text-sm font-semibold transition-all duration-150 border-b-2 -mb-px focus:outline-none ${
              tab === t.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'categories' && <Categories />}
      {tab === 'brands' && <Brands />}
      {tab === 'banners' && <Banners />}
    </div>
  );
};

export default Other;
