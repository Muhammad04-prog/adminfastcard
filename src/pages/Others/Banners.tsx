import React, { useState, useRef } from 'react';
import { Upload, Trash2, Clock } from 'lucide-react';

interface SliderItem {
  id: number;
  file?: File;
  preview: string;
  name: string;
}

interface BannerItem {
  id: number;
  file?: File;
  preview: string;
  name: string;
}

// Countdown format helper
function formatCountdown(seconds: number) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(d).padStart(2, '0')}d/${String(h).padStart(2, '0')}h/${String(m).padStart(2, '0')}m/${String(s).padStart(2, '0')}s`;
}

const DEMO_SLIDER: SliderItem[] = [
  { id: 1, preview: '', name: 'Healthcare_Erbology.png' },
  { id: 2, preview: '', name: 'Healthcare_Erbology.png' },
  { id: 3, preview: '', name: 'Healthcare_Erbology.png' },
];
const DEMO_BANNER: BannerItem[] = [
  { id: 1, preview: '', name: 'Healthcare_Erbology.png' },
];

const Banners: React.FC = () => {
  // Main Slider state
  const [sliders, setSliders] = useState<SliderItem[]>(DEMO_SLIDER);
  const [sliderSubtitle, setSliderSubtitle] = useState('Enhance Your Music Experience');
  const [sliderTitle, setSliderTitle] = useState('Enhance Your Music Experience');
  const sliderFileRef = useRef<HTMLInputElement>(null);

  // Banner state
  const [banners, setBanners] = useState<BannerItem[]>(DEMO_BANNER);
  const [bannerCategory, setBannerCategory] = useState('');
  const [bannerCountdown] = useState(formatCountdown(5 * 86400 + 23 * 3600 + 59 * 60 + 35));
  const [bannerTitle, setBannerTitle] = useState('Enhance Your Music Experience');
  const bannerFileRef = useRef<HTMLInputElement>(null);

  // Upload slider images
  const handleSliderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newItems: SliderItem[] = Array.from(files).map(f => ({
      id: Date.now() + Math.random(),
      file: f,
      preview: URL.createObjectURL(f),
      name: f.name,
    }));
    setSliders(prev => [...prev, ...newItems]);
  };

  const handleDeleteSlider = (id: number) => {
    setSliders(prev => prev.filter(s => s.id !== id));
  };

  // Upload banner images
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newItems: BannerItem[] = Array.from(files).map(f => ({
      id: Date.now() + Math.random(),
      file: f,
      preview: URL.createObjectURL(f),
      name: f.name,
    }));
    setBanners(prev => [...prev, ...newItems]);
  };

  const handleDeleteBanner = (id: number) => {
    setBanners(prev => prev.filter(b => b.id !== id));
  };

  const handleSaveSlider = () => {
    // In a real app, you'd upload files and metadata to your API here
    alert('Slider saved! (UI demo — connect to your API)');
  };

  const handleSaveBanner = () => {
    alert('Banner saved! (UI demo — connect to your API)');
  };

  // Placeholder thumbnail
  const Thumb = ({ preview, name }: { preview: string; name: string }) => (
    <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
      {preview ? (
        <img src={preview} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-purple-400 to-slate-700 opacity-70" />
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      {/* ── Main Sliders ── */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-800">Main sliders</h3>

        {/* Upload zone */}
        <input type="file" ref={sliderFileRef} className="hidden" multiple accept="image/*,.svg,.gif" onChange={handleSliderUpload} />
        <div
          onClick={() => sliderFileRef.current?.click()}
          className="w-full border-2 border-dashed border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-50 transition-all"
        >
          <Upload className="w-5 h-5 text-slate-400" />
          <p className="text-xs font-semibold text-slate-600">Click to upload or drag and drop</p>
          <p className="text-[10px] text-slate-400">SVG, JPG, PNG, or gif maximum 900×400</p>
        </div>

        {/* File list */}
        {sliders.length > 0 && (
          <div>
            <div className="grid grid-cols-[auto_1fr_auto] gap-x-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 pb-1 border-b border-slate-100">
              <span>Image</span><span>File name</span><span>Action</span>
            </div>
            <div className="divide-y divide-slate-100">
              {sliders.map(s => (
                <div key={s.id} className="grid grid-cols-[auto_1fr_auto] gap-x-3 items-center py-2.5 px-1">
                  <Thumb preview={s.preview} name={s.name} />
                  <span className="text-xs font-semibold text-slate-700 truncate">{s.name}</span>
                  <button onClick={() => handleDeleteSlider(s.id)} className="p-1.5 text-slate-400 hover:text-rose-500 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subtitle & Title */}
        <div className="space-y-2">
          <div className="relative">
            <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">Subtitle</label>
            <input
              value={sliderSubtitle}
              onChange={e => setSliderSubtitle(e.target.value)}
              className="w-full px-3 pt-3 pb-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <div className="relative">
            <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">Title</label>
            <input
              value={sliderTitle}
              onChange={e => setSliderTitle(e.target.value)}
              className="w-full px-3 pt-3 pb-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={handleSaveSlider} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all">
            Save
          </button>
        </div>
      </div>

      {/* ── Banner ── */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-800">Banner</h3>

        {/* Upload zone */}
        <input type="file" ref={bannerFileRef} className="hidden" multiple accept="image/*,.svg,.gif" onChange={handleBannerUpload} />
        <div
          onClick={() => bannerFileRef.current?.click()}
          className="w-full border-2 border-dashed border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-50 transition-all"
        >
          <Upload className="w-5 h-5 text-slate-400" />
          <p className="text-xs font-semibold text-slate-600">Click to upload or drag and drop</p>
          <p className="text-[10px] text-slate-400">SVG, JPG, PNG, or gif maximum 900×400</p>
        </div>

        {/* File list */}
        {banners.length > 0 && (
          <div>
            <div className="grid grid-cols-[auto_1fr_auto] gap-x-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 pb-1 border-b border-slate-100">
              <span>Image</span><span>File name</span><span>Action</span>
            </div>
            <div className="divide-y divide-slate-100">
              {banners.map(b => (
                <div key={b.id} className="grid grid-cols-[auto_1fr_auto] gap-x-3 items-center py-2.5 px-1">
                  <Thumb preview={b.preview} name={b.name} />
                  <span className="text-xs font-semibold text-slate-700 truncate">{b.name}</span>
                  <button onClick={() => handleDeleteBanner(b.id)} className="p-1.5 text-slate-400 hover:text-rose-500 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category dropdown */}
        <div className="relative">
          <select
            value={bannerCategory}
            onChange={e => setBannerCategory(e.target.value)}
            className="w-full appearance-none px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 text-sm text-slate-600 bg-white"
          >
            <option value="">Categories</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="home">Home</option>
          </select>
          <svg className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </div>

        {/* Countdown */}
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-600">
          <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="font-semibold">{bannerCountdown}</span>
        </div>

        {/* Title */}
        <div className="relative">
          <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400">Title</label>
          <input
            value={bannerTitle}
            onChange={e => setBannerTitle(e.target.value)}
            className="w-full px-3 pt-3 pb-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>

        <div className="flex justify-end">
          <button onClick={handleSaveBanner} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banners;
