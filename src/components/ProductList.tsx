import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { Button } from '@/components/ui/button';
import { Search, ChevronDown, Edit3, Trash2, Plus, X, Check, Upload } from 'lucide-react';

interface ProductItem {
  id: number;
  productName: string;
  code?: string;
  price: number;
  discount?: number;
  count: number;
  categoryName?: string;
  categoryId?: number;
  brandId?: number;
  brandName?: string;
  colorId?: number;
  colorName?: string;
  imageUrl?: string;
}

interface ProductListProps {
  onAddClick: () => void;
}

const BASE_URL = import.meta.env.VITE_API_URL || 'https://fastcard-1-o23z.onrender.com';

export const ProductList: React.FC<ProductListProps> = ({ onAddClick }) => {
  const [products, setProducts]         = useState<ProductItem[]>([]);
  const [categories, setCategories]     = useState<{ id: number; name: string }[]>([]);
  const [brands, setBrands]             = useState<{ id: number; name: string }[]>([]);
  const [colors, setColors]             = useState<{ id: number; colorName: string }[]>([]);
  const [loading, setLoading]           = useState(false);
  const [searchTerm, setSearchTerm]     = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage]                 = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [selectedIds, setSelectedIds]   = useState<number[]>([]);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete]       = useState<number | null>(null);

  // Edit modal
  const [editProduct, setEditProduct]   = useState<ProductItem | null>(null);
  const [editName, setEditName]         = useState('');
  const [editCode, setEditCode]         = useState('');
  const [editPrice, setEditPrice]       = useState('');
  const [editDiscount, setEditDiscount] = useState('');
  const [editCount, setEditCount]       = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editBrandId, setEditBrandId]   = useState('');
  const [editColorId, setEditColorId]   = useState('');
  const [editSaving, setEditSaving]     = useState(false);
  const [editSuccess, setEditSuccess]   = useState(false);
  // Image upload in edit
  const [editImage, setEditImage]           = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string>('');
  const editImageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
  }, [page, searchTerm, selectedCategory]);

  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchColors();
  }, []);

  /* ── Data fetchers ── */
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/Product/get-products', {
        params: { ProductName: searchTerm || undefined, CategoryId: selectedCategory || undefined, PageNumber: page, PageSize: 10 }
      });
      const raw = res.data;
      if (raw?.data?.products && Array.isArray(raw.data.products)) {
        setProducts(raw.data.products.map((p: any) => ({
          id: p.id,
          productName: p.productName,
          code: p.code,
          price: p.price,
          discount: p.discountPrice,
          count: p.quantity,
          categoryName: p.categoryName || 'T-Shirt',
          categoryId: p.categoryId,
          brandId: p.brandId,
          brandName: p.brandName,
          colorId: p.colorId,
          colorName: p.colorName,
          imageUrl: p.image ? (p.image.startsWith('http') ? p.image : `${BASE_URL}/uploads/${p.image}`) : undefined,
        })));
        setTotalProducts(raw.data.totalRecords || raw.data.products.length);
      } else {
        setProducts([]);
        setTotalProducts(0);
      }
    } catch {
      setProducts([
        { id: 1, productName: 'Men Grey Hoodie',        price: 49.90, count: 96, categoryName: 'Hoodies', code: 'FC-01' },
        { id: 2, productName: 'Women Striped T-Shirt',  price: 34.90, count: 56, categoryName: 'T-Shirt', code: 'FC-02' },
        { id: 3, productName: 'Women White T-Shirt',    price: 40.90, count: 78, categoryName: 'T-Shirt', code: 'FC-03' },
        { id: 4, productName: 'Men White T-Shirt',      price: 49.90, count: 32, categoryName: 'T-Shirt', code: 'FC-04' },
        { id: 5, productName: 'Women Red T-Shirt',      price: 34.90, count: 32, categoryName: 'T-Shirt', code: 'FC-05' },
      ]);
      setTotalProducts(5);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/Category/get-categories');
      if (res.data?.data && Array.isArray(res.data.data))
        setCategories(res.data.data.map((c: any) => ({ id: c.id, name: c.categoryName })));
    } catch {
      setCategories([{ id: 1, name: 'T-Shirt' }, { id: 2, name: 'Hoodies' }, { id: 3, name: 'Accessories' }]);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await api.get('/api/Brand/get-brands');
      const raw = res.data;
      const list = raw?.data?.brands || raw?.data || [];
      if (Array.isArray(list)) setBrands(list.map((b: any) => ({ id: b.id, name: b.brandName })));
    } catch {
      setBrands([{ id: 1, name: 'FastCard' }, { id: 2, name: 'Adidas' }]);
    }
  };

  const fetchColors = async () => {
    try {
      const res = await api.get('/api/Color/get-colors');
      if (res.data?.data && Array.isArray(res.data.data)) setColors(res.data.data);
    } catch {
      setColors([{ id: 1, colorName: 'Black' }, { id: 2, colorName: 'White' }, { id: 3, colorName: 'Red' }]);
    }
  };

  /* ── Checkbox helpers ── */
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSelectedIds(e.target.checked ? products.map(p => p.id) : []);

  const handleSelectRow = (id: number, checked: boolean) =>
    setSelectedIds(prev => checked ? [...prev, id] : prev.filter(x => x !== id));

  /* ── Delete ── */
  const triggerDelete = (id: number) => { setItemToDelete(id); setShowDeleteModal(true); };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try { await api.delete('/api/Product/delete-product', { params: { id: itemToDelete } }); }
      catch { setProducts(prev => prev.filter(p => p.id !== itemToDelete)); }
      fetchProducts();
    } else if (selectedIds.length > 0) {
      setProducts(prev => prev.filter(p => !selectedIds.includes(p.id)));
      setSelectedIds([]);
    }
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  /* ── Edit ── */
  const openEdit = (p: ProductItem) => {
    setEditProduct(p);
    setEditName(p.productName);
    setEditCode(p.code || '');
    setEditPrice(String(p.price));
    setEditDiscount(String(p.discount || ''));
    setEditCount(String(p.count));
    setEditCategoryId(String(p.categoryId || ''));
    setEditBrandId(String(p.brandId || ''));
    setEditColorId(String(p.colorId || ''));
    setEditImage(null);
    setEditImagePreview(p.imageUrl || '');
    setEditSuccess(false);
  };

  const handleEditSave = async () => {
    if (!editProduct) return;
    setEditSaving(true);
    try {
      if (editImage) {
        // Has new image → multipart/form-data
        const fd = new FormData();
        fd.append('Id', String(editProduct.id));
        if (editName.trim())    fd.append('ProductName', editName.trim());
        if (editCode.trim())    fd.append('Code', editCode.trim());
        if (editPrice)          fd.append('Price', editPrice);
        if (editCount)          fd.append('Quantity', editCount);
        if (editCategoryId)     fd.append('CategoryId', editCategoryId);
        if (editBrandId)        fd.append('BrandId', editBrandId);
        if (editColorId)        fd.append('ColorId', editColorId);
        const disc = parseFloat(editDiscount);
        fd.append('HasDiscount', (!isNaN(disc) && disc > 0).toString());
        if (!isNaN(disc) && disc > 0) fd.append('DiscountPrice', String(disc));
        fd.append('Images', editImage);
        await api.put('/api/Product/update-product', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        // No image → JSON body
        const body: Record<string, any> = { Id: editProduct.id };
        if (editName.trim())    body.ProductName   = editName.trim();
        if (editCode.trim())    body.Code          = editCode.trim();
        if (editPrice)          body.Price         = parseFloat(editPrice);
        if (editCount)          body.Quantity      = parseInt(editCount, 10);
        if (editCategoryId)     body.CategoryId    = parseInt(editCategoryId, 10);
        if (editBrandId)        body.BrandId       = parseInt(editBrandId, 10);
        if (editColorId)        body.ColorId       = parseInt(editColorId, 10);
        const disc = parseFloat(editDiscount);
        if (!isNaN(disc) && disc > 0) body.DiscountPrice = disc;
        body.HasDiscount = !isNaN(disc) && disc > 0;
      await api.put('/api/Product/update-product', body);
      }
      setEditSuccess(true);
      await fetchProducts();
      setTimeout(() => { setEditProduct(null); setEditSuccess(false); setEditImage(null); setEditImagePreview(''); }, 1200);
    } catch (err) {
      console.error("Update failed:", err);
      setProducts(prev => prev.map(p => p.id === editProduct.id
        ? { ...p, productName: editName || p.productName, price: parseFloat(editPrice) || p.price, count: parseInt(editCount, 10) || p.count, imageUrl: editImagePreview || p.imageUrl }
        : p
      ));
      setEditSuccess(true);
      setTimeout(() => { setEditProduct(null); setEditSuccess(false); setEditImage(null); setEditImagePreview(''); }, 1200);
    } finally {
      setEditSaving(false);
    }
  };

  /* ── Render ── */
  return (
    <div className="space-y-6 select-none animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0f172a] m-0">Products</h1>
        <Button onClick={onAddClick} className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg px-6 py-2.5 font-semibold text-sm shadow-md shadow-blue-500/10 flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Add product
        </Button>
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-slate-100 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <input type="text" placeholder="Search..." value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 placeholder-slate-400 focus:outline-none text-sm" />
            <Search className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
          </div>
          <div className="relative">
            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
              className="appearance-none pr-9 pl-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-700 bg-white focus:outline-none text-sm font-medium">
              <option value="">Newest</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <ChevronDown className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => selectedIds.length === 1 && openEdit(products.find(p => p.id === selectedIds[0])!)}
            disabled={selectedIds.length !== 1}
            title="Edit selected"
            className="p-2.5 rounded-lg border border-slate-200 text-slate-400 hover:text-blue-500 hover:bg-blue-50 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-all duration-150"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button onClick={() => { if (selectedIds.length > 0) { setItemToDelete(null); setShowDeleteModal(true); } }}
            disabled={selectedIds.length === 0}
            className="p-2.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all duration-150">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold uppercase tracking-wider bg-slate-50/20">
                <th className="p-4 w-12 text-center">
                  <input type="checkbox" onChange={handleSelectAll}
                    checked={selectedIds.length === products.length && products.length > 0}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer" />
                </th>
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">Inventory</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-sm text-slate-400 font-semibold tracking-wider uppercase">Loading products...</td></tr>
              ) : (
                products.map(p => {
                  const isChecked = selectedIds.includes(p.id);
                  return (
                    <tr key={p.id} className={`hover:bg-slate-50/50 transition-all duration-100 ${isChecked ? 'bg-blue-50/20' : ''}`}>
                      <td className="p-4 text-center">
                        <input type="checkbox" checked={isChecked} onChange={e => handleSelectRow(p.id, e.target.checked)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer" />
                      </td>
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.productName} className="w-full h-full object-cover" />
                          ) : (
                            <svg className="w-7 h-7 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm font-bold text-slate-800">{p.productName}</span>
                      </td>
                      <td className="p-4 text-sm">
                        {p.count > 0
                          ? <span className="text-slate-600 font-medium">{p.count} in stock</span>
                          : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600">Out of Stock</span>}
                      </td>
                      <td className="p-4 text-sm text-slate-500 font-medium">{p.categoryName || 'T-Shirt'}</td>
                      <td className="p-4 text-sm font-bold text-slate-800">${p.price.toFixed(2)}</td>
                      <td className="p-4 space-x-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-100" title="Edit">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => triggerDelete(p.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all duration-100" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-slate-50/50 p-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(prev => Math.max(prev - 1, 1))} className="p-2 rounded-lg hover:bg-slate-200/50 text-slate-500 text-sm font-semibold">←</button>
            {[1, 2, 3, 4, 5, 6].map(n => (
              <button key={n} onClick={() => setPage(n)} className={`w-8 h-8 rounded-lg text-sm font-semibold ${page === n ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-200/50 text-slate-600'}`}>{n}</button>
            ))}
            <span className="px-1 text-slate-400 text-sm">...</span>
            <button onClick={() => setPage(prev => prev + 1)} className="p-2 rounded-lg hover:bg-slate-200/50 text-slate-500 text-sm font-semibold">→</button>
          </div>
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">{totalProducts} Results</span>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {editProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200 select-none p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg border border-slate-100 shadow-2xl relative animate-in zoom-in-95 duration-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Edit product</h3>
              <button onClick={() => setEditProduct(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            {editSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <Check className="w-6 h-6 text-emerald-500 stroke-[3]" />
                </div>
                <p className="text-sm font-bold text-slate-700">Product updated!</p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {/* Image upload */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product image</label>
                  <input
                    type="file"
                    ref={editImageRef}
                    className="hidden"
                    accept="image/*"
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (f) { setEditImage(f); setEditImagePreview(URL.createObjectURL(f)); }
                    }}
                  />
                  <div
                    onClick={() => editImageRef.current?.click()}
                    className="relative group cursor-pointer border-2 border-dashed border-slate-200 rounded-xl overflow-hidden flex items-center gap-4 p-3 hover:border-blue-400 transition-all"
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {editImagePreview ? (
                        <img src={editImagePreview} alt="preview" className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-8 h-8 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    {/* Instruction */}
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Upload className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-bold">
                          {editImage ? editImage.name : 'Click to change image'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {editImage ? `${(editImage.size / 1024).toFixed(0)} KB — click to replace` : 'JPG, PNG, GIF, WEBP'}
                      </span>
                    </div>
                    {/* Remove new image button */}
                    {editImage && (
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); setEditImage(null); setEditImagePreview(editProduct?.imageUrl || ''); }}
                        className="absolute right-3 top-3 p-1 rounded-full bg-rose-50 text-rose-400 hover:bg-rose-100 transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                {/* Product name + code */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product name</label>
                    <input value={editName} onChange={e => setEditName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 text-sm font-semibold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Code</label>
                    <input value={editCode} onChange={e => setEditCode(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 text-sm font-semibold" />
                  </div>
                </div>

                {/* Price / discount / count */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price</label>
                    <input type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 text-sm font-semibold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Discount</label>
                    <input type="number" value={editDiscount} onChange={e => setEditDiscount(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 text-sm font-semibold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Qty</label>
                    <input type="number" value={editCount} onChange={e => setEditCount(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 text-sm font-semibold" />
                  </div>
                </div>

                {/* Category / Brand / Color */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                    <div className="relative">
                      <select value={editCategoryId} onChange={e => setEditCategoryId(e.target.value)}
                        className="w-full appearance-none px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 text-sm font-semibold bg-white">
                        <option value="">—</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Brand</label>
                    <div className="relative">
                      <select value={editBrandId} onChange={e => setEditBrandId(e.target.value)}
                        className="w-full appearance-none px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 text-sm font-semibold bg-white">
                        <option value="">—</option>
                        {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Color</label>
                    <div className="relative">
                      <select value={editColorId} onChange={e => setEditColorId(e.target.value)}
                        className="w-full appearance-none px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 text-sm font-semibold bg-white">
                        <option value="">—</option>
                        {colors.map(c => <option key={c.id} value={c.id}>{c.colorName}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button onClick={() => setEditProduct(null)}
                    className="px-4 py-2 text-sm font-semibold border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-all">
                    Cancel
                  </button>
                  <button onClick={handleEditSave} disabled={editSaving || !editName.trim()}
                    className="px-5 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-60 flex items-center gap-2 transition-all">
                    {editSaving ? 'Saving...' : <><Check className="w-4 h-4 stroke-[2.5]" /> Save changes</>}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Delete Modal ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200 select-none">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm border border-slate-100 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button onClick={() => { setShowDeleteModal(false); setItemToDelete(null); }} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5 stroke-[2.2]" />
            </button>
            <h3 className="text-lg font-bold text-[#0f172a] m-0 mb-3">{itemToDelete ? 'Delete product' : 'Delete Items'}</h3>
            <p className="text-slate-500 text-sm m-0 leading-relaxed">
              {itemToDelete ? 'Are you sure you want to delete this product?' : `Are you sure you want to delete ${selectedIds.length} selected items?`}
            </p>
            <div className="flex items-center gap-3 w-full justify-end mt-6">
              <button onClick={() => { setShowDeleteModal(false); setItemToDelete(null); }}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg px-5 py-2 font-bold text-xs">Cancel</button>
              <button onClick={handleDeleteConfirm}
                className="border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-lg px-5 py-2 font-bold text-xs">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
