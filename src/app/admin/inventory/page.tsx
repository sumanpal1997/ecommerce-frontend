'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Boxes,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Plus,
  PlusCircle,
  ArrowUpDown,
  RefreshCw,
  Package,
  Layers,
  ShieldAlert,
  Sparkles,
  DollarSign,
  Tag,
  FolderTree,
  FileText,
  Image as ImageIcon,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { adminApi, CreateProductPayload } from '@/features/admin/services/admin.api';
import { InventoryItem } from '@/features/admin/types/admin.types';
import { productApi } from '@/features/products/services/product.api';
import { CategoryTreeNode } from '@/features/products/types/product.types';
import { formatCurrency } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';

interface FlatCategory {
  id: string;
  name: string;
}

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<FlatCategory[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'LOW' | 'OUT' | 'HEALTHY'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 1. Restock Modal State
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [quantityDelta, setQuantityDelta] = useState<number>(50);
  const [reason, setReason] = useState('Scheduled warehouse shipment replenishment');
  const [isSubmittingRestock, setIsSubmittingRestock] = useState(false);

  // 2. Enlist New Product Modal State
  const [isEnlistModalOpen, setIsEnlistModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBrand, setNewBrand] = useState('Sony');
  const [newCategoryId, setNewCategoryId] = useState('');
  const [newSku, setNewSku] = useState('');
  const [newBasePrice, setNewBasePrice] = useState<number>(399);
  const [newSalePrice, setNewSalePrice] = useState<string>('');
  const [newInitialStock, setNewInitialStock] = useState<number>(45);
  const [newImageUrl, setNewImageUrl] = useState(
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
  );
  const [newAlt, setNewAlt] = useState('');
  const [newDescription, setNewDescription] = useState(
    'Engineered with industry-leading acoustic performance, active noise cancellation, and all-day ergonomic comfort for demanding professionals.',
  );
  const [newSpecKey1, setNewSpecKey1] = useState('Color');
  const [newSpecVal1, setNewSpecVal1] = useState('Midnight Black');
  const [newSpecKey2, setNewSpecKey2] = useState('Warranty');
  const [newSpecVal2, setNewSpecVal2] = useState('2-Year Comprehensive');
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);

  // Flatten nested category tree
  const flattenTree = (nodes: CategoryTreeNode[], prefix = ''): FlatCategory[] => {
    let result: FlatCategory[] = [];
    for (const node of nodes) {
      const label = prefix ? `${prefix} › ${node.name}` : node.name;
      result.push({ id: node.id, name: label });
      if (node.children && Array.isArray(node.children) && node.children.length > 0) {
        result = result.concat(flattenTree(node.children, label));
      }
    }
    return result;
  };

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      setNotice(null);
      const [inventoryData, categoryTree] = await Promise.all([
        adminApi.getAllInventory(),
        productApi.getCategories(),
      ]);
      setItems(inventoryData);
      const flat = flattenTree(categoryTree);
      setCategories(flat);
      if (flat.length > 0 && !newCategoryId) {
        setNewCategoryId(flat[0].id);
      }
    } catch (err) {
      console.error('Failed to load inventory or categories:', err);
      setNotice({ type: 'error', text: 'Failed to retrieve warehouse stock counts.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Auto-generate SKU when Title or Brand updates if SKU hasn't been manually set
  const handleTitleChange = (val: string) => {
    setNewTitle(val);
    const brandPrefix = (newBrand || 'PRD').slice(0, 3).toUpperCase();
    const cleanWords = val.replace(/[^a-zA-Z0-9\s]/g, '').trim().split(/\s+/).filter(Boolean);
    const acronym = cleanWords.slice(0, 3).map((w) => w.slice(0, 3).toUpperCase()).join('-');
    const suffix = Math.floor(100 + Math.random() * 900);
    setNewSku(`${brandPrefix}-${acronym || 'ITEM'}-${suffix}`);
  };

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    setIsSubmittingRestock(true);
    setNotice(null);
    try {
      await adminApi.adjustStock(selectedItem.sku, quantityDelta, reason);
      setNotice({
        type: 'success',
        text: `Successfully adjusted SKU ${selectedItem.sku} by ${quantityDelta > 0 ? '+' : ''}${quantityDelta} units.`,
      });
      setSelectedItem(null);
      await fetchInventory();
    } catch (err: unknown) {
      console.error('Stock adjustment failed:', err);
      setNotice({
        type: 'error',
        text: 'Failed to apply stock adjustment. Ensure deduction does not exceed available stock.',
      });
    } finally {
      setIsSubmittingRestock(false);
    }
  };

  const handleEnlistProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBrand.trim() || !newCategoryId || !newSku.trim()) {
      setNotice({ type: 'error', text: 'Please fill in all required product fields.' });
      return;
    }

    setIsSubmittingProduct(true);
    setNotice(null);

    try {
      const payload: CreateProductPayload = {
        title: newTitle.trim(),
        brand: newBrand.trim(),
        categoryId: newCategoryId,
        sku: newSku.trim().toUpperCase(),
        basePrice: Number(newBasePrice),
        ...(newSalePrice && Number(newSalePrice) > 0 ? { salePrice: Number(newSalePrice) } : {}),
        initialStock: Number(newInitialStock) || 0,
        description: newDescription.trim(),
        images: [
          {
            url: newImageUrl.trim(),
            alt: newAlt.trim() || newTitle.trim(),
            isPrimary: true,
          },
        ],
        attributes: {
          [newSpecKey1.trim()]: newSpecVal1.trim(),
          [newSpecKey2.trim()]: newSpecVal2.trim(),
        },
        status: 'ACTIVE',
      };

      const created = await adminApi.createProduct(payload);
      setNotice({
        type: 'success',
        text: `Product "${created.title}" (SKU: ${created.sku}) successfully enlisted and made live in customer catalog with ${newInitialStock} units!`,
      });

      // Reset form
      setIsEnlistModalOpen(false);
      setNewTitle('');
      setNewSku('');
      setNewSalePrice('');

      // Refresh inventory
      await fetchInventory();
    } catch (err: unknown) {
      console.error('Failed to enlist product:', err);
      if (err instanceof Error) {
        setNotice({ type: 'error', text: err.message });
      } else {
        setNotice({ type: 'error', text: 'Failed to enlist new product. Verify SKU uniqueness and category.' });
      }
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const isLow = item.availableStock <= item.lowStockThreshold && item.availableStock > 0;
    const isOut = item.availableStock === 0;
    const isHealthy = item.availableStock > item.lowStockThreshold;

    if (filter === 'LOW' && !isLow) return false;
    if (filter === 'OUT' && !isOut) return false;
    if (filter === 'HEALTHY' && !isHealthy) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const title = item.productId?.title?.toLowerCase() || '';
      const sku = item.sku.toLowerCase();
      const brand = item.productId?.brand?.toLowerCase() || '';
      return title.includes(q) || sku.includes(q) || brand.includes(q);
    }

    return true;
  });

  const totalSKUs = items.length;
  const totalOnHand = items.reduce((acc, cur) => acc + (cur.onHandStock || 0), 0);
  const totalReserved = items.reduce((acc, cur) => acc + (cur.reservedStock || 0), 0);
  const lowStockCount = items.filter((i) => i.availableStock <= i.lowStockThreshold).length;

  return (
    <div className="space-y-6">
      {/* Title & Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            <span>Inventory &amp; Warehouse Console</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Enlist new catalog items, monitor real-time stock counts, and execute warehouse replenishment.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchInventory}
            disabled={isLoading}
            className="border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setIsEnlistModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/25"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Enlist New Product</span>
          </Button>
        </div>
      </div>

      {notice && (
        <div
          className={`rounded-xl border p-4 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn ${
            notice.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
          }`}
        >
          {notice.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
          )}
          <span>{notice.text}</span>
        </div>
      )}

      {/* Warehouse Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Total Catalog SKUs
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">{totalSKUs}</div>
          <div className="text-[10px] text-slate-500">Active tracked items</div>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Units On Hand
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">{totalOnHand}</div>
          <div className="text-[10px] text-slate-500">Physical warehouse count</div>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Active Reserved
          </div>
          <div className="text-xl sm:text-2xl font-black text-indigo-400">{totalReserved}</div>
          <div className="text-[10px] text-slate-500">Pending checkout locks</div>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Stock Warnings
          </div>
          <div
            className={`text-xl sm:text-2xl font-black ${
              lowStockCount > 0 ? 'text-amber-400' : 'text-teal-400'
            }`}
          >
            {lowStockCount}
          </div>
          <div className="text-[10px] text-slate-500">SKUs below safety margin</div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-800/80 pb-3">
          {[
            { label: 'All Inventory', value: 'ALL' },
            { label: 'Low Stock (< Threshold)', value: 'LOW' },
            { label: 'Out of Stock (0)', value: 'OUT' },
            { label: 'Healthy Stock', value: 'HEALTHY' },
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setFilter(tab.value as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === tab.value
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inventory by SKU, product name, or brand..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-4 text-xs text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin text-indigo-500" />
            <span>Loading inventory records...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Boxes className="h-8 w-8 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-slate-300">No inventory records found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No SKUs matched the selected filter &ldquo;{filter}&rdquo; or search query.
            </p>
            <Button
              size="sm"
              onClick={() => setIsEnlistModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-xs font-bold"
            >
              <PlusCircle className="h-3.5 w-3.5 mr-1" />
              <span>Enlist a New Product</span>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">SKU / Product</th>
                  <th className="py-3.5 px-4 font-semibold">Brand</th>
                  <th className="py-3.5 px-4 font-semibold text-center">On Hand</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Reserved</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Available</th>
                  <th className="py-3.5 px-4 font-semibold">Health Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Replenish Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredItems.map((item) => {
                  const isLow =
                    item.availableStock <= item.lowStockThreshold && item.availableStock > 0;
                  const isOut = item.availableStock === 0;

                  return (
                    <tr key={item._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-800 border border-slate-700/60">
                            {item.productId?.images?.[0]?.url ? (
                              <Image
                                src={item.productId.images[0].url}
                                alt={item.productId.title || item.sku}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-slate-500">
                                <Package className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 max-w-[280px]">
                            <div className="font-bold text-white truncate flex items-center gap-1.5">
                              <span>{item.productId?.title || 'Unknown Product'}</span>
                              {item.productId?.slug && (
                                <a
                                  href={`/products/${item.productId.slug}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-slate-500 hover:text-indigo-400"
                                  title="View on Customer Storefront"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                            <div className="font-mono text-[10px] text-indigo-400 font-semibold">
                              SKU: {item.sku}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-slate-300 font-medium">
                        {item.productId?.brand || '—'}
                      </td>

                      <td className="py-4 px-4 text-center font-mono font-bold text-slate-200">
                        {item.onHandStock}
                      </td>

                      <td className="py-4 px-4 text-center font-mono font-semibold text-indigo-400">
                        {item.reservedStock}
                      </td>

                      <td className="py-4 px-4 text-center font-mono font-black text-sm">
                        <span
                          className={
                            isOut
                              ? 'text-rose-400'
                              : isLow
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }
                        >
                          {item.availableStock}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        {isOut ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/20">
                            <XCircle className="h-3 w-3" />
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/20">
                            <AlertTriangle className="h-3 w-3" />
                            Low Stock (&le; {item.lowStockThreshold})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="h-3 w-3" />
                            Optimal Stock
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedItem(item);
                            setQuantityDelta(50);
                            setReason('Scheduled warehouse shipment replenishment');
                          }}
                          className="text-[11px] h-7 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold cursor-pointer"
                        >
                          <Plus className="h-3 w-3 mr-1 text-indigo-400" />
                          <span>Restock</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: ENLIST NEW PRODUCT MODAL */}
      {isEnlistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
          <form
            onSubmit={handleEnlistProduct}
            className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-6 shadow-2xl my-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
                  <PlusCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Enlist New Customer Product
                  </h3>
                  <p className="text-xs text-slate-400">
                    Registers catalog listing, assigns warehouse SKU, and initializes available stock.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEnlistModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
              {/* Product Title */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Product Title *</span>
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Sony WH-1000XM5 Wireless Noise-Canceling Headphones"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              {/* Brand & Category Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Brand *</span>
                  </label>
                  <input
                    type="text"
                    value={newBrand}
                    onChange={(e) => {
                      setNewBrand(e.target.value);
                      handleTitleChange(newTitle);
                    }}
                    placeholder="e.g. Sony, Apple, Nike, Herman Miller"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    required
                  />
                  {/* Quick brand selectors */}
                  <div className="flex flex-wrap gap-1 pt-1 text-[10px]">
                    {['Sony', 'Apple', 'Nike', 'Herman Miller', 'Bose', 'Breville'].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => {
                          setNewBrand(b);
                          handleTitleChange(newTitle);
                        }}
                        className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <FolderTree className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Catalog Category *</span>
                  </label>
                  <select
                    value={newCategoryId}
                    onChange={(e) => setNewCategoryId(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    required
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SKU & Initial Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Warehouse SKU Code *</span>
                  </label>
                  <input
                    type="text"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value.toUpperCase())}
                    placeholder="e.g. SNY-WH1000-XM5"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-mono text-xs text-white uppercase focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Boxes className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Initial Warehouse Stock (Units) *</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newInitialStock}
                    onChange={(e) => setNewInitialStock(parseInt(e.target.value, 10) || 0)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-mono text-xs text-white focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Pricing Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Base Retail Price ($) *</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min={1}
                    value={newBasePrice}
                    onChange={(e) => setNewBasePrice(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-mono text-xs text-white focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-amber-400" />
                    <span>Promotional Sale Price ($ - Optional)</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newSalePrice}
                    onChange={(e) => setNewSalePrice(e.target.value)}
                    placeholder="Leave empty for regular retail"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-mono text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Image URL & Live Preview */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <ImageIcon className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Primary Product Image URL *</span>
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    required
                  />
                  {newImageUrl && (
                    <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden border border-slate-700 bg-slate-800">
                      <Image
                        src={newImageUrl}
                        alt="Product preview"
                        fill
                        sizes="48px"
                        className="object-cover"
                        onError={() => {}}
                      />
                    </div>
                  )}
                </div>

                {/* Preset image suggestions */}
                <div className="flex flex-wrap gap-1 text-[10px] text-slate-400">
                  <span>Presets:</span>
                  {[
                    { label: 'Headphones', url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80' },
                    { label: 'Laptop', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80' },
                    { label: 'Smartwatch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80' },
                    { label: 'Sneakers', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80' },
                    { label: 'Espresso', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80' },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setNewImageUrl(preset.url)}
                      className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Description */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Consumer Product Description *</span>
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe craftsmanship, features, and luxury design..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              {/* Specifications / Key Attributes */}
              <div className="space-y-2 border-t border-slate-800 pt-3">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Key Specifications &amp; Attributes</span>
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    value={newSpecKey1}
                    onChange={(e) => setNewSpecKey1(e.target.value)}
                    placeholder="Spec 1 Name (e.g. Color)"
                    className="rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200"
                  />
                  <input
                    type="text"
                    value={newSpecVal1}
                    onChange={(e) => setNewSpecVal1(e.target.value)}
                    placeholder="Spec 1 Value (e.g. Midnight Black)"
                    className="rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200"
                  />
                  <input
                    type="text"
                    value={newSpecKey2}
                    onChange={(e) => setNewSpecKey2(e.target.value)}
                    placeholder="Spec 2 Name (e.g. Warranty)"
                    className="rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200"
                  />
                  <input
                    type="text"
                    value={newSpecVal2}
                    onChange={(e) => setNewSpecVal2(e.target.value)}
                    placeholder="Spec 2 Value (e.g. 2-Year Comprehensive)"
                    className="rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
              <span className="text-[11px] text-slate-400">
                * All items are registered with atomic inventory defense.
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEnlistModalOpen(false)}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmittingProduct || !newTitle.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 font-bold"
                >
                  {isSubmittingProduct ? (
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Enlisting Product...</span>
                    </span>
                  ) : (
                    <span>Publish &amp; Enlist Product</span>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: RESTOCK MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <form
            onSubmit={handleAdjustStock}
            className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center gap-2 text-indigo-400 font-bold">
              <Boxes className="h-5 w-5" />
              <h3 className="text-base text-white">Adjust Warehouse Stock</h3>
            </div>

            <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800 text-xs space-y-1">
              <p className="font-bold text-white truncate">
                {selectedItem.productId?.title || selectedItem.sku}
              </p>
              <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                <span>
                  SKU: <strong className="text-indigo-400">{selectedItem.sku}</strong>
                </span>
                <span>•</span>
                <span>
                  Current Available:{' '}
                  <strong className="text-emerald-400">{selectedItem.availableStock}</strong>
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Quantity Delta (positive to add, negative to deduct)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={quantityDelta}
                  onChange={(e) => setQuantityDelta(parseInt(e.target.value, 10) || 0)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-mono text-sm text-white focus:border-indigo-500 focus:outline-none"
                  required
                />
                <div className="flex items-center gap-1">
                  {[25, 50, 100].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setQuantityDelta(preset)}
                      className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-indigo-400 cursor-pointer"
                    >
                      +{preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Audit Log Reason
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Received new shipment from supplier"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedItem(null)}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmittingRestock || quantityDelta === 0}
                className="bg-indigo-600 hover:bg-indigo-700 font-bold"
              >
                {isSubmittingRestock
                  ? 'Updating Warehouse...'
                  : `Apply ${quantityDelta > 0 ? '+' : ''}${quantityDelta} Units`}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
