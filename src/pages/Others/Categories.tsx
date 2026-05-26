import React, { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import { Search, Edit3, Trash2, Plus, X, Upload, Check } from "lucide-react";

interface Category {
  id: number;
  categoryName: string;
  image?: string;
}

const BASE_URL =
  import.meta.env.VITE_API_URL || "https://fastcard-1-o23z.onrender.com";

function imgUrl(img?: string) {
  if (!img) return "";
  return img.startsWith("http") ? img : `${BASE_URL}/uploads/${img}`;
}

// Minimal SVG icon used as placeholder when no category image
const PlaceholderIcon = () => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    className="w-10 h-10 text-slate-400"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <rect x="6" y="8" width="36" height="32" rx="4" />
    <path d="M6 18h36" />
    <path d="M18 8v10" />
  </svg>
);

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  // Add modal
  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState("");
  const [addFile, setAddFile] = useState<File | null>(null);
  const [addPreview, setAddPreview] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  // Edit modal
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  // Delete modal
  const [deleteCat, setDeleteCat] = useState<Category | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const addFileRef = useRef<HTMLInputElement>(null);
  const editFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/Category/get-categories");
      const raw = res.data;
      if (raw && Array.isArray(raw.data)) {
        setCategories(raw.data);
      }
    } catch {
      setCategories([
        { id: 1, categoryName: "Phones" },
        { id: 2, categoryName: "Computers" },
        { id: 3, categoryName: "SmartWatch" },
        { id: 4, categoryName: "HeadPhones" },
        { id: 5, categoryName: "Camera" },
        { id: 6, categoryName: "Gaming" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = categories.filter((c) =>
    c.categoryName.toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Add
  const handleAddFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setAddFile(f);
      setAddPreview(URL.createObjectURL(f));
    }
  };
  const handleAdd = async () => {
    if (!addName.trim()) return;
    setAddLoading(true);
    try {
      const fd = new FormData();
      fd.append("CategoryName", addName.trim());
      if (addFile) fd.append("CategoryImage", addFile);
      await api.post("/api/Category/add-category", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchCategories();
    } catch {
      await fetchCategories();
    }
    setShowAdd(false);
    setAddName("");
    setAddFile(null);
    setAddPreview("");
    setAddLoading(false);
  };

  // Edit
  const openEdit = (c: Category) => {
    setEditCat(c);
    setEditName(c.categoryName);
    setEditFile(null);
    setEditPreview(imgUrl(c.image));
  };
  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setEditFile(f);
      setEditPreview(URL.createObjectURL(f));
    }
  };
  const handleEdit = async () => {
    if (!editCat || !editName.trim()) return;
    setEditLoading(true);
    try {
      const fd = new FormData();
      fd.append("Id", String(editCat.id));
      fd.append("CategoryName", editName.trim());
      if (editFile) fd.append("CategoryImage", editFile);
      await api.put("/api/Category/update-category", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchCategories();
    } catch {
      await fetchCategories();
    }
    setEditCat(null);
    setEditLoading(false);
  };

  // Delete
  const handleDelete = async () => {
    if (!deleteCat) return;
    setDeleteLoading(true);
    try {
      await api.delete("/api/Category/delete-category", {
        params: { id: deleteCat.id },
      });
      await fetchCategories();
    } catch {
      setCategories((prev) => prev.filter((c) => c.id !== deleteCat.id));
    }
    setDeleteCat(null);
    setDeleteLoading(false);
  };

  return (
    <div className="space-y-5">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-4 pr-9 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 text-sm"
          />
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm shadow-blue-500/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Add new
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm font-semibold">
          Loading categories...
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {paginated.map((cat) => (
            <div
              key={cat.id}
              className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all group relative"
            >
              <button
                onClick={() => openEdit(cat)}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-lg text-blue-400 hover:bg-blue-50 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden">
                {cat.image ? (
                  <img
                    src={imgUrl(cat.image)}
                    alt={cat.categoryName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <PlaceholderIcon />
                )}
              </div>
              <span className="text-xs font-bold text-slate-700 text-center">
                {cat.categoryName}
              </span>
              <button
                onClick={() => setDeleteCat(cat)}
                className="absolute bottom-2.5 right-2.5 p-1.5 rounded-lg text-rose-400 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 text-sm font-semibold"
            >
              ←
            </button>
            {Array.from(
              { length: Math.min(totalPages, 6) },
              (_, i) => i + 1,
            ).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-semibold ${page === p ? "bg-blue-50 text-blue-600" : "hover:bg-slate-100 text-slate-600"}`}
              >
                {p}
              </button>
            ))}
            {totalPages > 6 && (
              <>
                <span className="text-slate-400 text-sm px-1">...</span>
                <button
                  onClick={() => setPage(totalPages)}
                  className="w-8 h-8 rounded-lg text-sm font-semibold hover:bg-slate-100 text-slate-600"
                >
                  {totalPages}
                </button>
              </>
            )}
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 text-sm font-semibold"
            >
              →
            </button>
          </div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {filtered.length} Results
          </span>
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setShowAdd(false);
                setAddName("");
                setAddFile(null);
                setAddPreview("");
              }}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-800 mb-4">
              Add category
            </h3>
            <input
              type="text"
              placeholder="Category name"
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 text-sm mb-3"
            />
            <input
              type="file"
              ref={addFileRef}
              className="hidden"
              accept="image/*,.svg,.gif"
              onChange={handleAddFileChange}
            />
            <div
              onClick={() => addFileRef.current?.click()}
              className="w-full border-2 border-dashed border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-50 transition-all mb-4"
            >
              {addPreview ? (
                <img
                  src={addPreview}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded-lg"
                />
              ) : (
                <>
                  <Upload className="w-5 h-5 text-slate-400" />
                  <p className="text-xs font-semibold text-slate-600">
                    Click to upload or drag and drop.
                  </p>
                  <p className="text-[10px] text-slate-400">
                    SVG, JPG, PNG, or gif maximum 900×400
                  </p>
                </>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowAdd(false);
                  setAddName("");
                  setAddFile(null);
                  setAddPreview("");
                }}
                className="px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={addLoading || !addName.trim()}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-60 flex items-center gap-1.5"
              >
                {addLoading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editCat && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setEditCat(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-800 mb-4">
              Edit category
            </h3>
            <input
              type="text"
              placeholder="Category name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 text-sm mb-3"
            />
            <input
              type="file"
              ref={editFileRef}
              className="hidden"
              accept="image/*,.svg,.gif"
              onChange={handleEditFileChange}
            />
            <div
              onClick={() => editFileRef.current?.click()}
              className="w-full border-2 border-dashed border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-50 transition-all mb-4"
            >
              {editPreview ? (
                <img
                  src={editPreview}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded-lg"
                />
              ) : (
                <>
                  <Upload className="w-5 h-5 text-slate-400" />
                  <p className="text-xs font-semibold text-slate-600">
                    Click to upload or drag and drop.
                  </p>
                  <p className="text-[10px] text-slate-400">
                    SVG, JPG, PNG, or gif maximum 900×400
                  </p>
                </>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditCat(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={editLoading || !editName.trim()}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-60 flex items-center gap-1.5"
              >
                {editLoading ? (
                  "Saving..."
                ) : (
                  <>
                    <Check className="w-4 h-4" /> Save
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteCat && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setDeleteCat(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-800 mb-2">
              Delete category
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-bold text-slate-700">
                "{deleteCat.categoryName}"
              </span>
              ? This will also remove its sub-categories.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteCat(null)}
                className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-4 py-2 text-sm font-semibold border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-lg disabled:opacity-60"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
