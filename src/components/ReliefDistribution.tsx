import React, { useState } from 'react';
import {
  Box,
  Truck,
  Plus,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Sparkles,
  ArrowRight,
  Clock,
  Home,
  ShieldAlert,
  Search,
} from 'lucide-react';
import { useFloodGuard } from '../context/FloodGuardContext';
import { ReliefResource } from '../types';

export const ReliefDistribution: React.FC = () => {
  const {
    resources,
    shelters,
    distributions,
    distributeResource,
    addResourceStock,
    showNotification,
  } = useFloodGuard();

  // Modals
  const [dispatchModalOpen, setDispatchModalOpen] = useState<boolean>(false);
  const [addStockModalOpen, setAddStockModalOpen] = useState<boolean>(false);

  // Form states for dispatch
  const [targetShelterId, setTargetShelterId] = useState<string>(shelters[0]?.id || '');
  const [targetResourceName, setTargetResourceName] = useState<string>(resources[0]?.name || '');
  const [dispatchQty, setDispatchQty] = useState<number>(200);

  // Form states for adding stock
  const [addResourceId, setAddResourceId] = useState<string>(resources[0]?.id || '');
  const [addQty, setAddQty] = useState<number>(500);

  // Recommendation engine: rank shelters with highest resource needs
  const rankedShelters = [...shelters].sort((a, b) => {
    const aDemand = a.demands.foodPacks + a.demands.waterLiters / 2 + a.demands.medicalKits * 5;
    const bDemand = b.demands.foodPacks + b.demands.waterLiters / 2 + b.demands.medicalKits * 5;
    return bDemand - aDemand;
  });

  const handleConfirmDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetShelterId || !targetResourceName || dispatchQty <= 0) return;
    const success = distributeResource(targetShelterId, targetResourceName, Number(dispatchQty));
    if (success) {
      setDispatchModalOpen(false);
    }
  };

  const handleConfirmAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addResourceId || addQty <= 0) return;
    addResourceStock(addResourceId, Number(addQty));
    setAddStockModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-indigo-500/20 text-indigo-400">
              <Box className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase">
              SMART DISASTER LOGISTICS & SUPPLY CHAIN
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Smart Relief Distribution Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Optimize essential life-sustaining aid allocation with zero stockout waste.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAddStockModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#102A43] hover:bg-[#1a3d60] text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Add Inbound Stock</span>
          </button>

          <button
            onClick={() => setDispatchModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-[#071426] text-xs font-black flex items-center gap-1.5 shadow-lg shadow-cyan-500/25 transition-all"
          >
            <Truck className="w-4 h-4" />
            <span>Dispatch Aid to Shelter</span>
          </button>
        </div>
      </div>

      {/* AI Recommendation Engine Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-[#102A43] to-[#071426] border border-indigo-500/30 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-400/40">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-indigo-300 uppercase">
                AI Logistics Recommendation Engine
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-900 text-indigo-200">
                Live Deficit Audit
              </span>
            </div>
            <p className="text-xs text-slate-200 mt-0.5">
              Highest critical demand identified at: <strong className="text-white">{rankedShelters[0]?.name}</strong> ({rankedShelters[0]?.demands.foodPacks} food packs & {rankedShelters[0]?.demands.waterLiters}L water deficit).
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setTargetShelterId(rankedShelters[0]?.id || '');
            setTargetResourceName('Ready-to-Eat Food Packets (MREs)');
            setDispatchQty(rankedShelters[0]?.demands.foodPacks || 300);
            setDispatchModalOpen(true);
          }}
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 shadow-md transition-all"
        >
          <span>Auto-Allocate Stock</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Resource Inventory Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Box className="w-4 h-4 text-cyan-400" />
            <span>Central Relief Stockpile & Depletion Trackers</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">
            {resources.length} Tracked Commodities
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((res) => {
            const available = res.totalStock - res.distributed;
            const pctRemaining = (available / res.totalStock) * 100;
            const isLow = available <= res.thresholdWarning;

            return (
              <div
                key={res.id}
                className="p-5 rounded-2xl bg-glass-card border border-slate-800 hover:border-cyan-500/30 space-y-3 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400">{res.category}</span>
                    <h3 className="text-sm font-bold text-white mt-0.5">{res.name}</h3>
                  </div>
                  {isLow && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 animate-pulse">
                      Low Stock
                    </span>
                  )}
                </div>

                {/* Numbers */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                  <div className="p-2 rounded-lg bg-[#071426]">
                    <span className="text-[10px] text-slate-400 block">Total Stock</span>
                    <span className="font-mono font-bold text-slate-200">
                      {res.totalStock.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#071426]">
                    <span className="text-[10px] text-slate-400 block">Distributed</span>
                    <span className="font-mono font-bold text-amber-400">
                      {res.distributed.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#071426]">
                    <span className="text-[10px] text-slate-400 block">Remaining</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {available.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Stock Depletion</span>
                    <span className="font-mono">{pctRemaining.toFixed(1)}% Available</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${
                        pctRemaining <= 25 ? 'bg-red-500' : pctRemaining <= 50 ? 'bg-amber-500' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${pctRemaining}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-[10px] text-slate-400 font-mono">
                    Unit: {res.unit}
                  </span>
                  <button
                    onClick={() => {
                      setTargetResourceName(res.name);
                      setDispatchModalOpen(true);
                    }}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold text-xs flex items-center gap-1"
                  >
                    <span>Dispatch</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Split: Shelter Needs Ranking vs Distribution Audit Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 cols: Shelter Demand Ranks */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Home className="w-4 h-4 text-teal-400" />
              <span>Shelter Resource Deficit Ranks</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Real-Time Demand</span>
          </div>

          <div className="space-y-2.5">
            {rankedShelters.map((shl, idx) => (
              <div
                key={shl.id}
                className="p-3.5 rounded-xl bg-glass-card border border-slate-800 space-y-2"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-950 text-indigo-300 font-mono text-[10px] font-bold flex items-center justify-center border border-indigo-700">
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-white">{shl.name}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      shl.status === 'Full' ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {shl.occupiedCapacity} Evacuees
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-mono">
                  <div className="bg-[#071426] p-1.5 rounded">
                    <span className="text-[9px] text-slate-400 block font-sans">Food</span>
                    <span className="text-amber-400 font-bold">{shl.demands.foodPacks} packs</span>
                  </div>
                  <div className="bg-[#071426] p-1.5 rounded">
                    <span className="text-[9px] text-slate-400 block font-sans">Water</span>
                    <span className="text-cyan-400 font-bold">{shl.demands.waterLiters} L</span>
                  </div>
                  <div className="bg-[#071426] p-1.5 rounded">
                    <span className="text-[9px] text-slate-400 block font-sans">Medical</span>
                    <span className="text-red-400 font-bold">{shl.demands.medicalKits} kits</span>
                  </div>
                  <div className="bg-[#071426] p-1.5 rounded">
                    <span className="text-[9px] text-slate-400 block font-sans">Blankets</span>
                    <span className="text-slate-200 font-bold">{shl.demands.blankets}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 6 cols: Distribution Audit Ledger */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Recent Supply Dispatches (Ledger)</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Immutable Audit</span>
          </div>

          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {distributions.map((dist) => (
              <div
                key={dist.id}
                className="p-3 rounded-xl bg-[#071426] border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-cyan-400">#{dist.id}</span>
                    <span className="font-bold text-white">{dist.resourceName}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Target: <span className="text-slate-200">{dist.shelterName}</span> • Auth by {dist.authorizedBy}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-emerald-400 text-sm">
                    +{dist.quantity}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {dist.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dispatch Modal */}
      {dispatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0d2137] border border-cyan-500/40 rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-cyan-400" />
                <span>Dispatch Aid To Shelter</span>
              </h3>
              <button
                onClick={() => setDispatchModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmDispatch} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Select Target Shelter:</label>
                <select
                  value={targetShelterId}
                  onChange={(e) => setTargetShelterId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#071426] border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  {shelters.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.occupiedCapacity} evacuees)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Select Commodity:</label>
                <select
                  value={targetResourceName}
                  onChange={(e) => setTargetResourceName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#071426] border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  {resources.map((r) => (
                    <option key={r.id} value={r.name}>
                      {r.name} (Available: {r.totalStock - r.distributed} {r.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Quantity to Transfer:</label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={dispatchQty}
                  onChange={(e) => setDispatchQty(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-[#071426] border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#071426] font-black text-xs shadow-md"
                >
                  Confirm & Dispatch Truck
                </button>
                <button
                  type="button"
                  onClick={() => setDispatchModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Stock Modal */}
      {addStockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0d2137] border border-teal-500/40 rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-teal-400" />
                <span>Receive Inbound Stock Shipment</span>
              </h3>
              <button
                onClick={() => setAddStockModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmAddStock} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Resource Commodity:</label>
                <select
                  value={addResourceId}
                  onChange={(e) => setAddResourceId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#071426] border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  {resources.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Shipment Quantity Received:</label>
                <input
                  type="number"
                  min="1"
                  max="50000"
                  value={addQty}
                  onChange={(e) => setAddQty(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-[#071426] border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-[#071426] font-black text-xs shadow-md"
                >
                  Add To Depot Stock
                </button>
                <button
                  type="button"
                  onClick={() => setAddStockModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
