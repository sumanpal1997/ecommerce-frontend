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
  ArrowUpDown,
  RefreshCw,
  Package,
  Layers,
  ShieldAlert,
} from 'lucide-react';
import { adminApi } from '@/features/admin/services/admin.api';
import { InventoryItem } from '@/features/admin/types/admin.types';
import { formatCurrency } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'LOW' | 'OUT' | 'HEALTHY'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Restock modal state
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [quantityDelta, setQuantityDelta] = useState<number>(50);
  const [reason, setReason] = useState('Scheduled warehouse shipment replenishment');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      setNotice(null);
      const data = await adminApi.getAllInventory();
      setItems(data);
    } catch (err) {
      console.error('Failed to load inventory:', err);
      setNotice({ type: 'error', text: 'Failed to retrieve warehouse stock counts.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    setIsSubmitting(true);
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
      setIsSubmitting(false);
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
  const lowStockCount = items.filter(
    (i) => i.availableStock <= i.lowStockThreshold,
  ).length;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Inventory &amp; Warehouse Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time stock on hand, atomic reservation tracking, and warehouse replenishment adjustments.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchInventory}
          disabled={isLoading}
          className="self-start sm:self-auto border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800"
        >
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Stock</span>
        </Button>
      </div>

      {notice && (
        <div
          className={`rounded-xl border p-4 text-xs font-semibold flex items-center gap-2 ${
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
          <div className="text-[10px] text-slate-500">Pending checkout TTL locks</div>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Stock Warnings
          </div>
          <div className={`text-xl sm:text-2xl font-black ${lowStockCount > 0 ? 'text-amber-400' : 'text-teal-400'}`}>
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
          <div className="py-16 text-center space-y-2">
            <Boxes className="h-8 w-8 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-slate-300">No inventory records found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No SKUs matched the selected filter &ldquo;{filter}&rdquo; or search query.
            </p>
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
                  const isLow = item.availableStock <= item.lowStockThreshold && item.availableStock > 0;
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
                            <div className="font-bold text-white truncate">
                              {item.productId?.title || 'Unknown Product'}
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
                        <span className={isOut ? 'text-rose-400' : isLow ? 'text-amber-400' : 'text-emerald-400'}>
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
                          className="text-[11px] h-7 px-3 bg-indigo-600 hover:bg-indigo-700 font-semibold"
                        >
                          <Plus className="h-3 w-3 mr-1" />
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

      {/* Restock & Adjustment Modal */}
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
                <span>SKU: <strong className="text-indigo-400">{selectedItem.sku}</strong></span>
                <span>•</span>
                <span>Current Available: <strong className="text-emerald-400">{selectedItem.availableStock}</strong></span>
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
                disabled={isSubmitting || quantityDelta === 0}
                className="bg-indigo-600 hover:bg-indigo-700 font-bold"
              >
                {isSubmitting ? 'Updating Warehouse...' : `Apply ${quantityDelta > 0 ? '+' : ''}${quantityDelta} Units`}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
