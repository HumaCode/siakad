import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState, useRef } from 'react';
import '../../../css/sistem/roles.css';
import ConfirmationModal from '@/Components/ConfirmationModal';

interface LogEntry {
    id: number;
    log_name: string | null;
    description: string;
    event: string | null;
    subject_type: string | null;
    subject_id: string | null;
    causer_id: string | null;
    causer_name: string;
    causer_email: string | null;
    properties: Record<string, any>;
    changes: Record<string, any>;
    created_at: string;
    created_at_human: string;
}

interface PaginatedLogs {
    data: LogEntry[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Stats {
    total: number;
    today: number;
    created: number;
    updated: number;
    deleted: number;
}

interface PageProps {
    logs: PaginatedLogs;
    stats: Stats;
    logNames: string[];
    events: string[];
    filters: Record<string, string>;
}

function AnimatedCounter({ value }: { value: number }) {
    const [count, setCount] = useState(value);
    const prev = useRef(value);
    useEffect(() => {
        const start = prev.current, end = value;
        if (start === end) { setCount(end); return; }
        const steps = 600 / 16;
        const inc = (end - start) / steps;
        let cur = start;
        const t = setInterval(() => {
            cur += inc;
            if ((inc > 0 && cur >= end) || (inc < 0 && cur <= end)) { setCount(end); clearInterval(t); }
            else setCount(Math.round(cur));
        }, 16);
        prev.current = value;
        return () => clearInterval(t);
    }, [value]);
    return <span>{count.toLocaleString('id-ID')}</span>;
}

const EVENT_CONFIG: Record<string, { color: string; bg: string; icon: string; label: string }> = {
    created: { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/50 dark:border-emerald-800/50', icon: 'bi-plus-circle-fill', label: 'Dibuat' },
    updated: { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/50 dark:border-amber-800/50', icon: 'bi-pencil-fill', label: 'Diubah' },
    deleted: { color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200/50 dark:border-rose-800/50', icon: 'bi-trash-fill', label: 'Dihapus' },
};

const getEventCfg = (event: string | null) =>
    EVENT_CONFIG[event ?? ''] ?? { color: 'text-slate-500', bg: 'bg-slate-50 dark:bg-slate-800 border-slate-200/50 dark:border-slate-700/50', icon: 'bi-activity', label: event ?? '-' };

export default function ActivityLog({ logs, stats, logNames, events, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [logName, setLogName] = useState(filters.log_name ?? '');
    const [event, setEvent] = useState(filters.event ?? '');
    const [dateFrom, setDateFrom] = useState(filters.date_from ?? '');
    const [dateTo, setDateTo] = useState(filters.date_to ?? '');
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [clearAllOpen, setClearAllOpen] = useState(false);
    const [clearOldOpen, setClearOldOpen] = useState(false);
    const [deleteProcessing, setDeleteProcessing] = useState(false);
    const [clearProcessing, setClearProcessing] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [toast, setToast] = useState<{ show: boolean; msg: string; type: 'success' | 'danger' } | null>(null);

    useEffect(() => {
        const h = () => setShowScrollTop(window.scrollY > 200);
        window.addEventListener('scroll', h);
        return () => window.removeEventListener('scroll', h);
    }, []);

    const triggerToast = (msg: string, type: 'success' | 'danger' = 'success') => {
        setToast({ show: true, msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const runFilters = (overrides: Record<string, string> = {}) => {
        router.get('/sistem/activity-log', {
            search, log_name: logName, event, date_from: dateFrom, date_to: dateTo, ...overrides,
        }, { preserveState: true, preserveScroll: true });
    };

    useEffect(() => {
        const t = setTimeout(() => { if (search !== (filters.search ?? '')) runFilters({ search }); }, 400);
        return () => clearTimeout(t);
    }, [search]);

    const handleDelete = () => {
        if (!deleteId) return;
        setDeleteProcessing(true);
        router.delete(`/sistem/activity-log/${deleteId}`, {
            onSuccess: () => { setDeleteId(null); triggerToast('Log berhasil dihapus'); },
            onError: () => triggerToast('Gagal menghapus log', 'danger'),
            onFinish: () => setDeleteProcessing(false),
        });
    };

    const handleClearAll = () => {
        setClearProcessing(true);
        router.post('/sistem/activity-log/clear-all', {}, {
            onSuccess: () => { setClearAllOpen(false); triggerToast('Semua log berhasil dibersihkan'); },
            onError: () => triggerToast('Gagal membersihkan log', 'danger'),
            onFinish: () => setClearProcessing(false),
        });
    };

    const handleClearOld = () => {
        setClearProcessing(true);
        router.post('/sistem/activity-log/clear-old', {}, {
            onSuccess: () => { setClearOldOpen(false); triggerToast('Log lama berhasil dibersihkan'); },
            onError: () => triggerToast('Gagal membersihkan log lama', 'danger'),
            onFinish: () => setClearProcessing(false),
        });
    };

    const getFilteredLinks = () => {
        const links = logs.links;
        if (links.length <= 10) return links;
        const current = logs.current_page, last = logs.last_page, delta = 2;
        const range: (number | string)[] = [];
        for (let i = Math.max(2, current - delta); i <= Math.min(last - 1, current + delta); i++) range.push(i);
        if (current - delta > 2) range.unshift('...');
        if (current + delta < last - 1) range.push('...');
        range.unshift(1);
        if (last > 1) range.push(last);
        const filtered: typeof links = [];
        filtered.push(links[0]);
        range.forEach(p => {
            if (p === '...') filtered.push({ url: null, label: '...', active: false });
            else { const f = links.find(l => l.label === p.toString()); if (f) filtered.push(f); }
        });
        filtered.push(links[links.length - 1]);
        return filtered;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Activity Log" />
            <div className="min-h-screen bg-[#f0f4ff] dark:bg-slate-950 p-4 sm:p-6 lg:p-8 font-poppins relative">
                {/* Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-violet-300/10 dark:bg-violet-500/5 rounded-full blur-[100px]" />
                    <div className="absolute bottom-20 -left-20 w-[450px] h-[450px] bg-blue-300/10 dark:bg-blue-500/5 rounded-full blur-[80px]" />
                </div>

                <div className="relative z-10 w-full">
                    {/* Page Header */}
                    <div className="page-header relative overflow-hidden text-white rounded-2xl p-6 sm:p-8 shadow-xl dark:shadow-none mb-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                            <div>
                                <h4 className="text-xl sm:text-2xl font-extrabold font-playfair tracking-tight mb-1 flex items-center gap-2">
                                    <i className="bi bi-journal-text" /> Activity Log
                                </h4>
                                <p className="text-sm text-blue-100 font-medium">
                                    Riwayat seluruh aktivitas dan perubahan data dalam sistem SIAKAD
                                </p>
                            </div>
                            <div className="flex gap-3 shrink-0">
                                <button className="btn-ph btn-ph-white font-poppins" onClick={() => setClearOldOpen(true)}>
                                    <i className="bi bi-clock-history" /> Hapus Log Lama
                                </button>
                                <button className="btn-ph btn-ph-solid font-poppins" onClick={() => setClearAllOpen(true)}>
                                    <i className="bi bi-trash3" /> Bersihkan Semua
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                        {[
                            { label: 'Total Log', value: stats.total, icon: 'bi-journal-text', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/30' },
                            { label: 'Hari Ini', value: stats.today, icon: 'bi-calendar-check', color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/30' },
                            { label: 'Dibuat', value: stats.created, icon: 'bi-plus-circle-fill', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
                            { label: 'Diubah', value: stats.updated, icon: 'bi-pencil-fill', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/30' },
                            { label: 'Dihapus', value: stats.deleted, icon: 'bi-trash-fill', color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/30' },
                        ].map(s => (
                            <div key={s.label} className="card-custom flex items-center gap-4 p-4 hover:-translate-y-0.5 transition-all duration-300">
                                <div className={`rounded-xl ${s.bg} ${s.color} flex items-center justify-center text-lg shrink-0`} style={{ width: 42, height: 42 }}>
                                    <i className={`bi ${s.icon}`} />
                                </div>
                                <div>
                                    <span className="text-slate-400 dark:text-slate-500 text-[10px] font-extrabold uppercase tracking-wider">{s.label}</span>
                                    <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 font-poppins mt-0.5 leading-none">
                                        <AnimatedCounter value={s.value} />
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Table Card */}
                    <div className="card-custom">
                        {/* Filter Bar */}
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                            <h5 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
                                <i className="bi bi-funnel-fill text-blue-600" /> Filter &amp; Pencarian Log
                            </h5>
                            <div className="filter-bar">
                                {/* Search */}
                                <div className="relative flex-1 min-w-[220px]">
                                    <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                                    <input
                                        type="text"
                                        className="filter-input w-full pl-9"
                                        placeholder="Cari deskripsi, modul..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                    />
                                </div>
                                {/* Module */}
                                <select className="filter-select min-w-[160px]" value={logName} onChange={e => { setLogName(e.target.value); runFilters({ log_name: e.target.value }); }}>
                                    <option value="">Semua Modul</option>
                                    {logNames.map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                                {/* Event */}
                                <select className="filter-select min-w-[130px]" value={event} onChange={e => { setEvent(e.target.value); runFilters({ event: e.target.value }); }}>
                                    <option value="">Semua Event</option>
                                    {events.map(ev => <option key={ev} value={ev}>{getEventCfg(ev).label}</option>)}
                                </select>
                                {/* Date range */}
                                <div className="flex items-center gap-2 min-w-[280px]">
                                    <input type="date" className="filter-input flex-1 text-xs !pl-3 !pr-2 !min-w-0" value={dateFrom} onChange={e => { setDateFrom(e.target.value); runFilters({ date_from: e.target.value }); }} title="Dari tanggal" />
                                    <span className="text-slate-400 dark:text-slate-500 text-xs font-semibold shrink-0">s/d</span>
                                    <input type="date" className="filter-input flex-1 text-xs !pl-3 !pr-2 !min-w-0" value={dateTo} onChange={e => { setDateTo(e.target.value); runFilters({ date_to: e.target.value }); }} title="Sampai tanggal" />
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="p-5 overflow-x-auto">
                            <table className="user-table">
                                <thead>
                                    <tr>
                                        <th className="w-12 text-center">#</th>
                                        <th className="w-28 text-center">Event</th>
                                        <th>Deskripsi</th>
                                        <th className="w-28 text-center">Modul</th>
                                        <th>Pengguna</th>
                                        <th className="w-36">Waktu</th>
                                        <th className="w-20 text-center">Detail</th>
                                        <th className="w-16 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.data.length === 0 && (
                                        <tr>
                                            <td colSpan={8} className="text-center py-14">
                                                <div className="flex flex-col items-center justify-center max-w-sm mx-auto py-6">
                                                    {/* Animated Floating Icon */}
                                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/5 dark:to-indigo-500/5 flex items-center justify-center text-blue-500 dark:text-blue-400 mb-4 shadow-sm relative overflow-hidden group">
                                                        <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-400/5 animate-ping opacity-75 rounded-2xl" />
                                                        <i className="bi bi-journal-x text-3xl relative z-10 transition-transform duration-300 group-hover:scale-110" />
                                                    </div>
                                                    
                                                    {/* Title & Subtitle */}
                                                    <h6 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 font-poppins">
                                                        Belum Ada Aktivitas Tercatat
                                                    </h6>
                                                    <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center leading-relaxed mb-4 font-poppins">
                                                        {search || logName || event || dateFrom || dateTo
                                                            ? "Tidak ditemukan log aktivitas yang sesuai dengan filter pencarian Anda saat ini."
                                                            : "Sistem saat ini belum mencatat adanya aktivitas atau perubahan data."}
                                                    </p>

                                                    {/* Reset Button */}
                                                    {(search || logName || event || dateFrom || dateTo) && (
                                                        <button
                                                            onClick={() => {
                                                                setSearch('');
                                                                setLogName('');
                                                                setEvent('');
                                                                setDateFrom('');
                                                                setDateTo('');
                                                                router.get('/sistem/activity-log');
                                                            }}
                                                            className="px-4 py-2 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 shadow-sm transition-all duration-200 flex items-center gap-1.5"
                                                        >
                                                            <i className="bi bi-arrow-counterclockwise" />
                                                            Reset Filter
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    {logs.data.map((log, i) => {
                                        const cfg = getEventCfg(log.event);
                                        const isExpanded = expandedId === log.id;
                                        const hasChanges = log.changes && Object.keys(log.changes).length > 0;
                                        const hasProps = log.properties && Object.keys(log.properties).length > 0;
                                        const initials = (log.causer_name || 'S').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

                                        return (
                                            <>
                                                <tr key={log.id} className={isExpanded ? 'bg-blue-50/30 dark:bg-blue-950/10' : ''}>
                                                    <td className="text-slate-400 font-semibold text-xs text-center">
                                                        {(logs.current_page - 1) * logs.per_page + i + 1}
                                                    </td>
                                                    <td className="text-center">
                                                        <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
                                                            <i className={`bi ${cfg.icon} text-[9px]`} />
                                                            {cfg.label}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="flex items-start gap-2">
                                                            {log.subject_type && (
                                                                <span className="text-[9px] font-bold uppercase text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded shrink-0 mt-0.5">
                                                                    {log.subject_type}
                                                                </span>
                                                            )}
                                                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                                                                {log.description}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        {log.log_name && (
                                                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded border border-blue-100/50 dark:border-blue-800/50">
                                                                {log.log_name}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-[9px] font-extrabold shrink-0">
                                                                {initials}
                                                            </div>
                                                            <div>
                                                                <div className="text-xs font-bold text-slate-700 dark:text-slate-200">{log.causer_name}</div>
                                                                {log.causer_email && (
                                                                    <div className="text-[10px] text-slate-400">{log.causer_email}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">{log.created_at_human}</div>
                                                        <div className="text-[10px] text-slate-400 font-mono">{log.created_at}</div>
                                                    </td>
                                                    <td className="text-center">
                                                        {(hasChanges || hasProps) ? (
                                                            <button
                                                                className={`btn-icon-sm ${isExpanded ? 'view' : 'edit'}`}
                                                                title={isExpanded ? 'Tutup Detail' : 'Lihat Detail'}
                                                                onClick={() => setExpandedId(isExpanded ? null : log.id)}
                                                            >
                                                                <i className={`bi ${isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                                                            </button>
                                                        ) : (
                                                            <span className="text-[10px] text-slate-300">-</span>
                                                        )}
                                                    </td>
                                                    <td className="text-center">
                                                        <button className="btn-icon-sm del" title="Hapus Log" onClick={() => setDeleteId(log.id)}>
                                                            <i className="bi bi-trash" />
                                                        </button>
                                                    </td>
                                                </tr>

                                                {/* Expanded detail row */}
                                                {isExpanded && (hasChanges || hasProps) && (
                                                    <tr key={`${log.id}-detail`} className="bg-slate-50/80 dark:bg-slate-800/20">
                                                        <td colSpan={8} className="px-5 py-4">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                {hasChanges && (
                                                                    <div>
                                                                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                                                                            <i className="bi bi-arrow-left-right text-amber-500" /> Perubahan Data
                                                                        </div>
                                                                        <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden text-xs font-mono">
                                                                            {Object.entries(log.changes?.old ?? {}).map(([k, v]) => (
                                                                                <div key={k} className="grid grid-cols-3 gap-2 px-3 py-1.5 border-b border-slate-100 dark:border-slate-800/60 last:border-0">
                                                                                    <span className="font-bold text-slate-500 truncate">{k}</span>
                                                                                    <span className="text-rose-600 dark:text-rose-400 truncate line-through">{String(v ?? '-')}</span>
                                                                                    <span className="text-emerald-600 dark:text-emerald-400 truncate">{String((log.changes?.attributes ?? {})[k] ?? '-')}</span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {hasProps && !hasChanges && (
                                                                    <div>
                                                                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                                                                            <i className="bi bi-info-circle text-blue-500" /> Properties
                                                                        </div>
                                                                        <pre className="bg-slate-900 text-green-400 text-[10px] rounded-xl p-3 overflow-auto max-h-40">
                                                                            {JSON.stringify(log.properties, null, 2)}
                                                                        </pre>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            {logs.last_page > 1 && (
                                <div className="flex items-center justify-between mt-5 flex-wrap gap-4">
                                    <div className="text-xs text-slate-400">
                                        Menampilkan <strong>{logs.from ?? 0}–{logs.to ?? 0}</strong> dari <strong>{logs.total}</strong> log
                                    </div>
                                    <div className="flex gap-1">
                                        {getFilteredLinks().map((link, idx) => {
                                            if (!link.url) return (
                                                <span key={idx} className="px-3 py-1.5 border border-slate-100 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-300 pointer-events-none"
                                                    dangerouslySetInnerHTML={{ __html: link.label }} />
                                            );
                                            return (
                                                <Link key={idx} href={link.url} preserveState preserveScroll
                                                    className={`px-3 py-1.5 border rounded-lg text-xs font-bold transition-all duration-200 ${link.active ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/80'}`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }} />
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Scroll to Top */}
                <button className={`scroll-top ${showScrollTop ? 'visible' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <i className="bi bi-chevron-up" />
                </button>
            </div>

            {/* Delete Log Modal */}
            <ConfirmationModal
                show={!!deleteId}
                title="Hapus Log Ini?"
                description="Entri activity log ini akan dihapus secara permanen dari database."
                confirmText="Ya, Hapus Log"
                variant="danger"
                processing={deleteProcessing}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
            />

            {/* Clear All Modal */}
            <ConfirmationModal
                show={clearAllOpen}
                title="Bersihkan Semua Log?"
                description="Seluruh riwayat activity log akan dihapus permanen. Tindakan ini tidak dapat dibatalkan."
                warningText="Semua data log termasuk riwayat audit trail akan hilang sepenuhnya."
                confirmText="Ya, Bersihkan Semua"
                variant="danger"
                processing={clearProcessing}
                onClose={() => setClearAllOpen(false)}
                onConfirm={handleClearAll}
            />

            {/* Clear Old Modal */}
            <ConfirmationModal
                show={clearOldOpen}
                title="Hapus Log Lama (>30 Hari)?"
                description="Log yang berusia lebih dari 30 hari akan dihapus untuk menghemat penyimpanan."
                confirmText="Ya, Hapus Log Lama"
                variant="warning"
                processing={clearProcessing}
                onClose={() => setClearOldOpen(false)}
                onConfirm={handleClearOld}
            />

            {/* Toast */}
            {toast?.show && (
                <div
                    className="flex items-center gap-3 fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3.5 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.15)] font-bold text-xs transition-all duration-300 font-poppins"
                    style={{
                        backgroundColor: toast.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)',
                        border: toast.type === 'success' ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(244,63,94,0.4)',
                        color: toast.type === 'success' ? '#10b981' : '#f43f5e',
                        backdropFilter: 'blur(12px)', zIndex: 9999,
                    }}
                >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${toast.type === 'success' ? 'bg-emerald-500/80' : 'bg-rose-500/80'}`}>
                        <i className={`bi ${toast.type === 'success' ? 'bi-check-lg' : 'bi-x-lg'} text-[10px]`} />
                    </div>
                    <span className="tracking-wide">{toast.msg}</span>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
