import React, { useState, useMemo } from 'react';
import { router } from '@inertiajs/react';

interface ProdiItem {
    id: string;
    kode: string;
    nama: string;
    jenjang: string;
    tahun: number;
    fakultas: string;
    sks: number;
    mkCount: number;
}

interface KurikulumCopyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (msg: string) => void;
    allProdisWithYears: ProdiItem[];
    currentTahun: string;
}

export default function KurikulumCopyModal({
    isOpen,
    onClose,
    onSuccess,
    allProdisWithYears,
    currentTahun,
}: KurikulumCopyModalProps) {
    const calendarYear = new Date().getFullYear();
    const [sourceTahun, setSourceTahun] = useState<number>(calendarYear - 1);
    const [targetTahun, setTargetTahun] = useState<number>(calendarYear);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [processing, setProcessing] = useState(false);
    const [search, setSearch] = useState('');

    const availableYears = useMemo(() => {
        const years = [...new Set(allProdisWithYears.map(p => p.tahun))].sort((a, b) => b - a);
        return years;
    }, [allProdisWithYears]);

    const sourceProdis = useMemo(() => {
        return allProdisWithYears.filter(p => p.tahun === sourceTahun);
    }, [allProdisWithYears, sourceTahun]);

    const filteredProdis = useMemo(() => {
        if (!search.trim()) return sourceProdis;
        const q = search.toLowerCase();
        return sourceProdis.filter(p =>
            p.nama.toLowerCase().includes(q) ||
            p.kode.toLowerCase().includes(q) ||
            p.fakultas.toLowerCase().includes(q)
        );
    }, [sourceProdis, search]);

    const allSelected = filteredProdis.length > 0 && filteredProdis.every(p => selectedIds.includes(p.id));
    const someSelected = filteredProdis.some(p => selectedIds.includes(p.id));

    const toggleAll = () => {
        if (allSelected) {
            setSelectedIds(prev => prev.filter(id => !filteredProdis.find(p => p.id === id)));
        } else {
            const newIds = filteredProdis.map(p => p.id);
            setSelectedIds(prev => [...new Set([...prev, ...newIds])]);
        }
    };

    const toggleOne = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSubmit = () => {
        if (selectedIds.length === 0) return;
        setProcessing(true);
        router.post('/akademik/prodi/copy', {
            source_tahun: sourceTahun,
            target_tahun: targetTahun,
            prodi_ids: selectedIds,
        }, {
            onSuccess: () => {
                setProcessing(false);
                setSelectedIds([]);
                onSuccess(`${selectedIds.length} kurikulum berhasil disalin ke tahun ${targetTahun}.`);
            },
            onError: () => {
                setProcessing(false);
            },
        });
    };

    const getJenjangColor = (jenjang: string) => {
        switch (jenjang) {
            case 'S2': return 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400';
            case 'S3': return 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400';
            case 'D3': return 'bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400';
            default:   return 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

                {/* ── Header ── */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-slate-900 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 flex-shrink-0">
                            <i className="bi bi-files text-lg" />
                        </div>
                        <div>
                            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                                Salin Kurikulum dari Tahun Sebelumnya
                            </h3>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                                Pilih program studi yang akan disalin beserta mata kuliah &amp; kelasnya
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-lg transition-colors cursor-pointer flex-shrink-0">
                        <i className="bi bi-x-lg" />
                    </button>
                </div>

                {/* ── Year Selector ── */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                                <i className="bi bi-arrow-left-circle mr-1 text-indigo-500" />
                                Tahun Sumber
                            </label>
                            <select
                                className="form-ctrl text-sm font-semibold"
                                value={sourceTahun}
                                onChange={e => {
                                    setSourceTahun(parseInt(e.target.value));
                                    setSelectedIds([]);
                                }}
                            >
                                {availableYears.length === 0 && (
                                    <option>Tidak ada data</option>
                                )}
                                {availableYears.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                                <i className="bi bi-arrow-right-circle mr-1 text-blue-500" />
                                Tahun Tujuan
                            </label>
                            <input
                                type="number"
                                className="form-ctrl text-sm font-semibold"
                                value={targetTahun}
                                min={1900}
                                max={2100}
                                onChange={e => setTargetTahun(parseInt(e.target.value) || calendarYear)}
                            />
                        </div>
                    </div>

                    {/* Warning if same year */}
                    {sourceTahun === targetTahun && (
                        <div className="mt-3 flex items-center gap-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg px-3 py-2 text-xs font-medium">
                            <i className="bi bi-exclamation-triangle-fill" />
                            Tahun sumber dan tujuan tidak boleh sama
                        </div>
                    )}
                </div>

                {/* ── Search & Select All ── */}
                <div className="px-6 pt-4 pb-2 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="fi-wrap flex-1">
                        <i className="bi bi-search fi-icon" />
                        <input
                            className="fi w-full"
                            type="text"
                            placeholder="Cari program studi..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        <div
                            onClick={toggleAll}
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer ${
                                allSelected
                                    ? 'bg-blue-600 border-blue-600'
                                    : someSelected
                                    ? 'bg-blue-100 border-blue-400 dark:bg-blue-950 dark:border-blue-600'
                                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'
                            }`}
                        >
                            {allSelected && <i className="bi bi-check text-white text-xs font-black" />}
                            {someSelected && !allSelected && <div className="w-2.5 h-0.5 bg-blue-500 rounded-full" />}
                        </div>
                        Pilih Semua
                    </label>
                </div>

                {/* ── Prodi List ── */}
                <div className="flex-1 overflow-y-auto px-6 py-3 space-y-2">
                    {filteredProdis.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 text-2xl mb-3">
                                <i className="bi bi-folder-x" />
                            </div>
                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                                {sourceProdis.length === 0
                                    ? `Tidak ada data kurikulum di tahun ${sourceTahun}`
                                    : 'Tidak ada hasil pencarian'}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                                {sourceProdis.length === 0
                                    ? 'Pilih tahun sumber yang memiliki data'
                                    : 'Coba kata kunci yang berbeda'}
                            </p>
                        </div>
                    ) : (
                        filteredProdis.map(prodi => {
                            const isChecked = selectedIds.includes(prodi.id);
                            return (
                                <label
                                    key={prodi.id}
                                    className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 group ${
                                        isChecked
                                            ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/20 shadow-sm shadow-blue-500/10'
                                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/30 dark:hover:bg-blue-950/10'
                                    }`}
                                >
                                    {/* Custom Checkbox */}
                                    <div
                                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                            isChecked
                                                ? 'bg-blue-600 border-blue-600'
                                                : 'border-slate-300 dark:border-slate-600 group-hover:border-blue-400'
                                        }`}
                                    >
                                        {isChecked && <i className="bi bi-check text-white text-xs font-black" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={isChecked}
                                        onChange={() => toggleOne(prodi.id)}
                                    />

                                    {/* Icon */}
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base font-black transition-all ${
                                        isChecked
                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                                    }`}>
                                        {prodi.kode.charAt(0)}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 truncate">
                                                {prodi.nama}
                                            </span>
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${getJenjangColor(prodi.jenjang)}`}>
                                                {prodi.jenjang}
                                            </span>
                                        </div>
                                        <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                                            {prodi.fakultas} · Kode: <strong className="text-slate-500 dark:text-slate-400">{prodi.kode}</strong>
                                        </div>
                                    </div>

                                    {/* Stats badges */}
                                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                        <div className="flex items-center gap-1 text-[10px] font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded-full">
                                            <i className="bi bi-book" />
                                            {prodi.mkCount} MK
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] font-semibold text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 rounded-full">
                                            <i className="bi bi-award" />
                                            {prodi.sks} SKS
                                        </div>
                                    </div>
                                </label>
                            );
                        })
                    )}
                </div>

                {/* ── Footer ── */}
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-3">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                        {selectedIds.length > 0 ? (
                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                                <i className="bi bi-check-circle-fill mr-1" />
                                {selectedIds.length} prodi dipilih
                            </span>
                        ) : (
                            <span>Belum ada prodi yang dipilih</span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={processing}
                            className="btn-outline cursor-pointer"
                        >
                            <i className="bi bi-x-lg" /> Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={processing || selectedIds.length === 0 || sourceTahun === targetTahun}
                            className="btn-add cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                                    Menyalin...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-files" /> Salin {selectedIds.length > 0 ? `(${selectedIds.length})` : ''} ke {targetTahun}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
