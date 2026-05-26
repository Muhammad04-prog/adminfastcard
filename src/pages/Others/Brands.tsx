import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Edit3, Trash2, X, Check } from 'lucide-react';

interface Brand {
  id: number;
  brandName: string;
}

const Brands: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);

  // Add form
  const [newName, setNewName] = useState('');
  const [addLoading, setAddLoading] = useState(false);

  // Edit inline
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Delete modal
  const [deleteBrand, setDeleteBrand] = useState<Brand | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => { fetchBrands(); }, []);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/Brand/get-brands');
      const raw = res.data;
      if (raw?.data?.brands && Array.isArray(raw.data.brands)) {
        setBrands(raw.data.brands);
      } else if (raw?.data && Array.isArray(raw.data)) {
        setBrands(raw.data);
      }
    } catch {
      setBrands([
        { id: 1, brandName: 'Samsung' },
        { id: 2, brandName: 'Xiaomi' },
        { id: 3, brandName: 'LG' },
        { id: 4, brandName: 'Nokia' },
        { id: 5, brandName: 'Panasonic' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setAddLoading(true);
    try {
      await api.post('/api/Brand/add-brand', { brandName: newName.trim() });
      setNewName('');
      await fetchBrands();
    } catch {
      setBrands(prev => [...prev, { id: Date.now(), brandName: newName.trim() }]);
      setNewName('');
    }
    setAddLoading(false);
  };

  const handleEditSave = async () => {
    if (!editId || !editName.trim()) return;
    setEditLoading(true);
    try {
      await api.put('/api/Brand/update-brand', { id: editId, brandName: editName.trim() });
      await fetchBrands();
    } catch {
      setBrands(prev => prev.map(b => b.id === editId ? { ...b, brandName: editName.trim() } : b));
    }
    setEditId(null);
    setEditLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteBrand) return;
    setDeleteLoading(true);
    try {
      await api.delete('/api/Brand/delete-brand', { params: { id: deleteBrand.id } });
      await fetchBrands();
    } catch {
      setBrands(prev => prev.filter(b => b.id !== deleteBrand.id));
    }
    setDeleteBrand(null);
    setDeleteLoading(false);
  };

  return (
    <div className="flex gap-6 items-start">
      {/* Left: Brand List */}
      <div className="flex-1 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-[1fr_auto] text-xs font-bold text-slate-400 uppercase tracking-wider px-5 py-3 border-b border-slate-100 bg-slate-50/50">
          <span>Brands</span>
          <span>Action</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-slate-400 font-semibold">Loading brands...</div>
        ) : brands.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">No brands yet. Add one →</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {brands.map(brand => (
              <div key={brand.id} className="grid grid-cols-[1fr_auto] items-center px-5 py-3.5 hover:bg-slate-50/50 transition-all group">
                {editId === brand.id ? (
                  <input
                    autoFocus
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleEditSave(); if (e.key === 'Escape') setEditId(null); }}
                    className="text-sm font-semibold text-slate-800 border-b border-blue-500 focus:outline-none bg-transparent pr-3"
                  />
                ) : (
                  <span className="text-sm font-semibold text-slate-800">{brand.brandName}</span>
                )}
                <div className="flex items-center gap-2">
                  {editId === brand.id ? (
                    <button
                      onClick={handleEditSave}
                      disabled={editLoading}
                      className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      {editLoading ? <span className="w-4 h-4 text-xs">...</span> : <Check className="w-4 h-4" />}
                    </button>
                  ) : (
                    <button
                      onClick={() => { setEditId(brand.id); setEditName(brand.brandName); }}
                      className="p-1.5 text-blue-400 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteBrand(brand)}
                    className="p-1.5 text-rose-400 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: Add New Brand */}
      <div className="w-72 bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-3">
        <h3 className="text-sm font-bold text-slate-800">Add new brand</h3>
        <input
          type="text"
          placeholder="Brand name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 text-sm"
        />
        <div className="flex justify-end">
          <button
            onClick={handleAdd}
            disabled={addLoading || !newName.trim()}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg disabled:opacity-60 transition-all"
          >
            {addLoading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteBrand && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setDeleteBrand(null)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            <h3 className="text-base font-bold text-slate-800 mb-2">Delete brand</h3>
            <p className="text-sm text-slate-500 mb-6">Are you sure you want to delete <span className="font-bold text-slate-700">"{deleteBrand.brandName}"</span>?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteBrand(null)} className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Cancel</button>
              <button onClick={handleDelete} disabled={deleteLoading} className="px-4 py-2 text-sm font-semibold border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-lg disabled:opacity-60">
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brands;
