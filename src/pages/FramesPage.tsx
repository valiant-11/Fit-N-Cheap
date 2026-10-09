import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFit } from '../context/FitContext';
import { calculateBikeFit } from '../lib/fit/engine';
import { rankMatchedFrames, type FitStatus } from '../lib/fit/matcher';
import { exportFramesToCsv, parseFramesFromCsv } from '../lib/fit/csv';
import type { BikeFrame, RiderMeasurements } from '../types';
import {
  Bike,
  AlertTriangle,
  Plus,
  Download,
  Upload,
  Search,
  CheckCircle2,
  Sliders,
  Sparkles,
  ExternalLink,
  Trash2,
  Edit2,
  X,
  RotateCcw,
  Compass,
  ArrowRight,
} from 'lucide-react';

export const FramesPage: React.FC = () => {
  const {
    frames,
    addFrame,
    updateFrame,
    deleteFrame,
    importFrames,
    resetFramesToDefault,
    measurements,
    loadSampleMeasurements,
  } = useFit();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FitStatus | 'all'>('all');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFrameId, setEditingFrameId] = useState<string | null>(null);

  // Form state
  const [formBrand, setFormBrand] = useState('');
  const [formModel, setFormModel] = useState('');
  const [formYear, setFormYear] = useState<number>(new Date().getFullYear());
  const [formSize, setFormSize] = useState('');
  const [formSeatTubeCT, setFormSeatTubeCT] = useState<number>(520);
  const [formStack, setFormStack] = useState<number>(550);
  const [formReach, setFormReach] = useState<number>(385);
  const [formEffTT, setFormEffTT] = useState<number>(545);
  const [formHeadTube, setFormHeadTube] = useState<number>(145);
  const [formWheelbase, setFormWheelbase] = useState<number>(990);
  const [formSourceUrl, setFormSourceUrl] = useState('');
  const [formVerified, setFormVerified] = useState(false);

  // Status notification
  const [notice, setNotice] = useState<string | null>(null);

  // Derive fit targets if measurements are complete
  const isMeasurementsComplete =
    measurements.height !== undefined &&
    measurements.inseam !== undefined &&
    measurements.torso !== undefined &&
    measurements.arm !== undefined &&
    measurements.shoulder !== undefined &&
    measurements.flexibility !== undefined &&
    measurements.ridingStyle !== undefined;

  const fitResults = isMeasurementsComplete
    ? calculateBikeFit(measurements as RiderMeasurements)
    : null;

  // Compute matched frames
  const matchedList = fitResults ? rankMatchedFrames(frames, fitResults) : [];

  // Filtered frames
  const displayFrames = (fitResults ? matchedList : frames.map(f => ({ frame: f, status: 'close' as FitStatus, statusLabel: 'Geometry Only', score: 50, deltaReachMm: 0, deltaStackMm: 0, deltaSeatTubeMm: 0, primaryIssue: null, suggestions: [] })))
    .filter(item => {
      const f = item.frame;
      const matchesSearch =
        f.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.size.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

  // Modal open for New or Edit
  const handleOpenAddModal = () => {
    setEditingFrameId(null);
    setFormBrand('');
    setFormModel('');
    setFormYear(new Date().getFullYear());
    setFormSize('54 cm');
    setFormSeatTubeCT(500);
    setFormStack(550);
    setFormReach(385);
    setFormEffTT(545);
    setFormHeadTube(145);
    setFormWheelbase(990);
    setFormSourceUrl('');
    setFormVerified(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (frame: BikeFrame) => {
    setEditingFrameId(frame.id);
    setFormBrand(frame.brand);
    setFormModel(frame.model);
    setFormYear(frame.year);
    setFormSize(frame.size);
    setFormSeatTubeCT(frame.seatTubeCT);
    setFormStack(frame.stack);
    setFormReach(frame.reach);
    setFormEffTT(frame.effTT);
    setFormHeadTube(frame.headTube);
    setFormWheelbase(frame.wheelbase);
    setFormSourceUrl(frame.sourceUrl || '');
    setFormVerified(frame.verified);
    setIsModalOpen(true);
  };

  const handleSaveFrame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBrand.trim() || !formModel.trim()) return;

    if (editingFrameId) {
      updateFrame(editingFrameId, {
        brand: formBrand.trim(),
        model: formModel.trim(),
        year: formYear,
        size: formSize.trim(),
        seatTubeCT: formSeatTubeCT,
        stack: formStack,
        reach: formReach,
        effTT: formEffTT,
        headTube: formHeadTube,
        wheelbase: formWheelbase,
        sourceUrl: formSourceUrl.trim(),
        verified: formVerified,
      });
      setNotice(`Updated ${formBrand} ${formModel}`);
    } else {
      addFrame({
        brand: formBrand.trim(),
        model: formModel.trim(),
        year: formYear,
        size: formSize.trim(),
        seatTubeCT: formSeatTubeCT,
        stack: formStack,
        reach: formReach,
        effTT: formEffTT,
        headTube: formHeadTube,
        wheelbase: formWheelbase,
        sourceUrl: formSourceUrl.trim(),
        verified: formVerified,
      });
      setNotice(`Added ${formBrand} ${formModel}`);
    }

    setIsModalOpen(false);
    setTimeout(() => setNotice(null), 4000);
  };

  // CSV Export
  const handleExportCsv = () => {
    const csvContent = exportFramesToCsv(frames);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fit_n_cheap_frames_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // CSV Import
  const handleImportCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target?.result as string;
      const parsed = parseFramesFromCsv(text);
      if (parsed.length > 0) {
        importFrames(parsed);
        setNotice(`Successfully imported ${parsed.length} frames from CSV!`);
      } else {
        setNotice('No valid frame records found in CSV file.');
      }
      setTimeout(() => setNotice(null), 4000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-5xl mx-auto w-full space-y-6 py-2 sm:py-6">
      {/* MANDATORY WARNING BANNER */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-semibold flex items-center gap-3 shadow-xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
        <span className="tracking-wide">
          Always check the manufacturer&apos;s geometry chart before purchasing or ordering any frame.
        </span>
      </div>

      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Bike className="w-3.5 h-3.5" />
            <span>Road Frame Matcher</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Geometry Comparison & Cockpit Tuning
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Compare frame stack and reach directly against your tailored fit targets.
          </p>
        </div>

        {/* Action Buttons: Add, Export, Import */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Frame</span>
          </button>

          <label className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-xs cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            <span>Import CSV</span>
            <input type="file" accept=".csv" onChange={handleImportCsv} className="hidden" />
          </label>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-xs transition-colors"
            title="Download CSV database"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export</span>
          </button>

          <button
            type="button"
            onClick={resetFramesToDefault}
            className="p-2.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            title="Reset to 3 demo example frames"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notice alert */}
      {notice && (
        <div className="p-3.5 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-900 dark:text-brand-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-brand-500" />
          <span>{notice}</span>
        </div>
      )}

      {/* Target Fit Reminder / Sample Quick-load Banner */}
      {!fitResults ? (
        <div className="p-5 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-brand-500" />
              Fit Targets Needed for Live Scoring
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Complete the measurement wizard or load sample rider data to rank frames with mm differences and cockpit adjustments.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/wizard"
              className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs shadow-xs"
            >
              Fit Wizard
            </Link>
            <button
              type="button"
              onClick={loadSampleMeasurements}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-300 dark:border-slate-700"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 inline mr-1" />
              Use Sample Targets
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-bold text-brand-400 uppercase tracking-wider text-[11px]">
              Active Fit Targets:
            </span>
            <span>
              Target Reach:{' '}
              <strong className="text-cyan-400 font-mono">
                {fitResults.reachMinMm}–{fitResults.reachMaxMm} mm
              </strong>
            </span>
            <span>•</span>
            <span>
              Target Stack:{' '}
              <strong className="text-cyan-400 font-mono">
                {fitResults.stackMinMm}–{fitResults.stackMaxMm} mm
              </strong>
            </span>
            <span>•</span>
            <span>
              Seat Tube (C-T):{' '}
              <strong className="text-emerald-400 font-mono">
                {fitResults.frameSizeSeatTubeCT} cm ({fitResults.frameSizeSeatTubeCT * 10} mm)
              </strong>
            </span>
          </div>
          <Link to="/results" className="text-brand-400 hover:underline flex items-center gap-1 font-semibold">
            <span>View Full Fit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search brand, model, size..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Status Filter Chips */}
        {fitResults && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium w-full sm:w-auto">
            {[
              { id: 'all', label: 'All Frames' },
              { id: 'fits', label: 'Fits Well' },
              { id: 'close', label: 'Close' },
              { id: 'too_big', label: 'Too Big' },
              { id: 'too_small', label: 'Too Small' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id as FitStatus | 'all')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  statusFilter === tab.id
                    ? 'bg-brand-500 text-slate-950 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* FRAMES LISTING */}
      <div className="space-y-4">
        {displayFrames.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <Bike className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200">No matching frames found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search filter, or add a custom frame using the &quot;Add Frame&quot; button.
            </p>
          </div>
        ) : (
          displayFrames.map(item => {
            const f = item.frame;
            const isFit = item.status === 'fits';
            const isClose = item.status === 'close';
            const isTooBig = item.status === 'too_big';

            return (
              <div
                key={f.id}
                className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border transition-all space-y-4 shadow-xs ${
                  isFit
                    ? 'border-emerald-500/50 hover:border-emerald-500'
                    : isClose
                    ? 'border-cyan-500/40 hover:border-cyan-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-black text-slate-900 dark:text-white">
                        {f.brand} — {f.model}
                      </h2>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                        Size: {f.size} ({f.year})
                      </span>

                      {!f.verified && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400">
                          EXAMPLE ONLY
                        </span>
                      )}
                    </div>
                    {f.sourceUrl && (
                      <a
                        href={f.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-slate-400 hover:text-brand-500 inline-flex items-center gap-1"
                      >
                        <span>Geometry Source</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* Fit Status Badge & Actions */}
                  <div className="flex items-center gap-3">
                    {fitResults && (
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-extrabold uppercase px-3 py-1 rounded-full ${
                            isFit
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : isClose
                              ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300'
                              : isTooBig
                              ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {item.statusLabel}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-400">
                          {item.score}% Match
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-800 pl-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(f)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors"
                        title="Edit geometry"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteFrame(f.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                        title="Delete frame"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Geometry Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-xs font-mono pt-1">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-[10px] text-slate-400 uppercase font-sans block">Stack</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{f.stack} mm</span>
                    {fitResults && (
                      <span className={`block text-[10px] mt-0.5 ${item.deltaStackMm === 0 ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {item.deltaStackMm > 0 ? `+${item.deltaStackMm}` : item.deltaStackMm} mm
                      </span>
                    )}
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-[10px] text-slate-400 uppercase font-sans block">Reach</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{f.reach} mm</span>
                    {fitResults && (
                      <span className={`block text-[10px] mt-0.5 ${item.deltaReachMm === 0 ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {item.deltaReachMm > 0 ? `+${item.deltaReachMm}` : item.deltaReachMm} mm
                      </span>
                    )}
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-[10px] text-slate-400 uppercase font-sans block">Seat Tube (C-T)</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{f.seatTubeCT} mm</span>
                    {fitResults && (
                      <span className={`block text-[10px] mt-0.5 ${item.deltaSeatTubeMm === 0 ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {item.deltaSeatTubeMm > 0 ? `+${item.deltaSeatTubeMm}` : item.deltaSeatTubeMm} mm
                      </span>
                    )}
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-[10px] text-slate-400 uppercase font-sans block">Effective Top Tube</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{f.effTT} mm</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-[10px] text-slate-400 uppercase font-sans block">Head Tube</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{f.headTube} mm</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-[10px] text-slate-400 uppercase font-sans block">Wheelbase</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{f.wheelbase} mm</span>
                  </div>
                </div>

                {/* Practical Tuning Suggestions */}
                {fitResults && item.suggestions.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-brand-500" />
                      Cockpit Tuning to Close Fit Gaps:
                    </span>
                    <ul className="space-y-1 text-slate-600 dark:text-slate-300 list-disc list-inside">
                      {item.suggestions.map((sug, sIdx) => (
                        <li key={sIdx}>{sug}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ADD / EDIT FRAME MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Bike className="w-5 h-5 text-brand-500" />
                <span>{editingFrameId ? 'Edit Frame Geometry' : 'Add Custom Road Frame'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFrame} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Brand *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Specialized"
                    value={formBrand}
                    onChange={e => setFormBrand(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Model *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tarmac SL7"
                    value={formModel}
                    onChange={e => setFormModel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Size *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 54 or M"
                    value={formSize}
                    onChange={e => setFormSize(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Model Year</label>
                  <input
                    type="number"
                    value={formYear}
                    onChange={e => setFormYear(parseInt(e.target.value, 10) || 2024)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                  />
                </div>
              </div>

              {/* Geometry specs (in mm) */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-3">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Geometry Dimensions (mm)
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block">Stack (mm) *</label>
                    <input
                      type="number"
                      required
                      value={formStack}
                      onChange={e => setFormStack(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block">Reach (mm) *</label>
                    <input
                      type="number"
                      required
                      value={formReach}
                      onChange={e => setFormReach(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block">Seat Tube C-T *</label>
                    <input
                      type="number"
                      required
                      value={formSeatTubeCT}
                      onChange={e => setFormSeatTubeCT(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block">Eff. Top Tube</label>
                    <input
                      type="number"
                      value={formEffTT}
                      onChange={e => setFormEffTT(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block">Head Tube</label>
                    <input
                      type="number"
                      value={formHeadTube}
                      onChange={e => setFormHeadTube(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block">Wheelbase</label>
                    <input
                      type="number"
                      value={formWheelbase}
                      onChange={e => setFormWheelbase(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Manufacturer Chart URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://manufacturer.com/geometry"
                  value={formSourceUrl}
                  onChange={e => setFormSourceUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="form-verified"
                  checked={formVerified}
                  onChange={e => setFormVerified(e.target.checked)}
                  className="rounded text-brand-500"
                />
                <label htmlFor="form-verified" className="text-slate-600 dark:text-slate-400 font-medium">
                  Verified against official manufacturer geometry chart
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold shadow-md"
                >
                  {editingFrameId ? 'Save Changes' : 'Add to Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
