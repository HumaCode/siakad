import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import ConfirmationModal from '@/Components/ConfirmationModal';
import { destroy as destroyProdi } from '@/actions/App/Http/Controllers/MainMenu/AkademikController';

// Partials
import KurikulumTab from './Partials/KurikulumTab';
import MataKuliahTab from './Partials/MataKuliahTab';
import JadwalTab from './Partials/JadwalTab';
import KalenderTab from './Partials/KalenderTab';

// Modals
import KurikulumModal from './Partials/KurikulumModal';
import MataKuliahModal from './Partials/MataKuliahModal';
import JadwalModal from './Partials/JadwalModal';
import KalenderModal from './Partials/KalenderModal';
import KurikulumDetailModal from './Partials/KurikulumDetailModal';

interface Stats {
    prodi_count: number;
    dosen_count: number;
    ruangan_count: number;
}

interface PaginatedProdis {
    data: any[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

interface PageProps {
    stats: Stats;
    fakultas: any[];
    prodis: PaginatedProdis;
    filters: {
        search: string | null;
        fakultas: string | null;
        tahun: string | null;
    };
}

export default function Akademik({ stats, fakultas, prodis, filters }: PageProps) {
    const [activeTab, setActiveTab] = useState<'kurikulum' | 'matakuliah' | 'jadwal' | 'kalender'>('kurikulum');
    
    // Modal Open states
    const [isKurikulumModalOpen, setIsKurikulumModalOpen] = useState(false);
    const [isMKModalOpen, setIsMKModalOpen] = useState(false);
    const [isJadwalModalOpen, setIsJadwalModalOpen] = useState(false);
    const [isKalenderModalOpen, setIsKalenderModalOpen] = useState(false);
    const [editingProdi, setEditingProdi] = useState<any | null>(null);
    const [detailProdi, setDetailProdi] = useState<any | null>(null);

    const handleOpenDetailModal = (prodi: any) => {
        setDetailProdi(prodi);
    };

    const handleOpenKurikulumModal = (prodi?: any) => {
        setEditingProdi(prodi && prodi.id ? prodi : null);
        setIsKurikulumModalOpen(true);
    };

    // Delete Prodi states & handlers
    const [prodiToDelete, setProdiToDelete] = useState<any | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteProdi = (prodi: any) => {
        setProdiToDelete(prodi);
    };

    const confirmDeleteProdi = () => {
        if (!prodiToDelete) return;
        setIsDeleting(true);
        router.delete(destroyProdi.url(prodiToDelete.id), {
            onSuccess: () => {
                setProdiToDelete(null);
                setIsDeleting(false);
                triggerToast('Program Studi berhasil dihapus.', 'success');
            },
            onError: () => {
                setIsDeleting(false);
                triggerToast('Gagal menghapus Program Studi.', 'danger');
            }
        });
    };

    // Toast state
    const [toast, setToast] = useState<{ show: boolean; msg: string; type: 'success' | 'danger' } | null>(null);

    // Scroll to Top state
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 200);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const triggerToast = (msg: string, type: 'success' | 'danger' = 'success') => {
        setToast({ show: true, msg, type });
        setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    const handleSaveModal = (msg: string) => {
        setIsKurikulumModalOpen(false);
        setIsMKModalOpen(false);
        setIsJadwalModalOpen(false);
        setIsKalenderModalOpen(false);
        triggerToast(msg, 'success');
    };

    return (
        <AuthenticatedLayout
            header="Modul Akademik"
        >
            <Head title="SIAKAD — Akademik" />

            <div className="py-6 px-4 sm:px-6 lg:px-8 relative min-h-screen">
                {/* PAGE HEADER */}
                <div className="page-header" data-aos="fade-down" data-aos-duration="550">
                    <div className="page-header-inner">
                        <h4 className="flex items-center">
                            <i className="bi bi-book-fill me-2" /> Modul Akademik
                        </h4>
                        <p>Kelola kurikulum, mata kuliah, jadwal perkuliahan, dan kalender akademik Semester Gasal 2025/2026</p>
                    </div>
                    <div className="ph-right">
                        <div className="flex items-center gap-2.5 bg-white/15 dark:bg-slate-900/40 border border-white/10 dark:border-slate-800/60 px-4 py-2 rounded-xl text-xs font-bold text-white dark:text-slate-200 backdrop-blur-md">
                            <i className="bi bi-calendar3 text-blue-300 dark:text-blue-400" />
                            <span>Semester Gasal 2025/2026</span>
                            <span className="flex h-2 w-2 relative ml-1">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* STAT ROW */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                    <div className="stat-mini">
                        <div className="stat-mini-num text-blue-600 dark:text-blue-400">{stats.prodi_count}</div>
                        <div className="stat-mini-lbl">Program Studi</div>
                        <div className="stat-mini-badge bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                            <i className="bi bi-check-circle-fill" /> Aktif
                        </div>
                    </div>
                    <div className="stat-mini">
                        <div className="stat-mini-num text-teal-600 dark:text-teal-400">246</div>
                        <div className="stat-mini-lbl">Mata Kuliah</div>
                        <div className="stat-mini-badge bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400">
                            Semester ini
                        </div>
                    </div>
                    <div className="stat-mini">
                        <div className="stat-mini-num text-purple-600 dark:text-purple-400">892</div>
                        <div className="stat-mini-lbl">Sesi Jadwal</div>
                        <div className="stat-mini-badge bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
                            Mingguan
                        </div>
                    </div>
                    <div className="stat-mini">
                        <div className="stat-mini-num text-amber-500">{stats.dosen_count}</div>
                        <div className="stat-mini-lbl">Dosen Mengajar</div>
                        <div className="stat-mini-badge bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                            Aktif
                        </div>
                    </div>
                    <div className="stat-mini">
                        <div className="stat-mini-num text-green-600 dark:text-green-400">{stats.ruangan_count}</div>
                        <div className="stat-mini-lbl">Ruangan</div>
                        <div className="stat-mini-badge bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400">
                            Tersedia
                        </div>
                    </div>
                    <div className="stat-mini">
                        <div className="stat-mini-num text-rose-600 dark:text-rose-400">16</div>
                        <div className="stat-mini-lbl">Pertemuan/Sem</div>
                        <div className="stat-mini-badge bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
                            Minggu ke-8
                        </div>
                    </div>
                </div>

                {/* MAIN TABS */}
                <div className="main-tabs">
                    <button 
                        className={`main-tab cursor-pointer ${activeTab === 'kurikulum' ? 'active' : ''}`}
                        onClick={() => setActiveTab('kurikulum')}
                    >
                        <i className="bi bi-diagram-3-fill" /> Kurikulum 
                        <span className="tab-count ms-1">{stats.prodi_count}</span>
                    </button>
                    <button 
                        className={`main-tab cursor-pointer ${activeTab === 'matakuliah' ? 'active' : ''}`}
                        onClick={() => setActiveTab('matakuliah')}
                    >
                        <i className="bi bi-journal-richtext" /> Mata Kuliah 
                        <span className="tab-count ms-1">246</span>
                    </button>
                    <button 
                        className={`main-tab cursor-pointer ${activeTab === 'jadwal' ? 'active' : ''}`}
                        onClick={() => setActiveTab('jadwal')}
                    >
                        <i className="bi bi-calendar3-week-fill" /> Jadwal Kuliah 
                        <span className="tab-count ms-1">892</span>
                    </button>
                    <button 
                        className={`main-tab cursor-pointer ${activeTab === 'kalender' ? 'active' : ''}`}
                        onClick={() => setActiveTab('kalender')}
                    >
                        <i className="bi bi-calendar-event-fill" /> Kalender Akademik
                    </button>
                </div>

                {/* TAB PANELS */}
                {activeTab === 'kurikulum' && (
                    <KurikulumTab 
                        fakultas={fakultas} 
                        prodis={prodis}
                        initialSearch={filters?.search || ''}
                        initialFakultas={filters?.fakultas || 'Semua Fakultas'}
                        initialTahun={filters?.tahun || 'Semua Tahun'}
                        onFiltersChange={(searchVal, fakultasVal, tahunVal) => {
                            router.get('/akademik', {
                                search: searchVal || null,
                                fakultas: fakultasVal !== 'Semua Fakultas' ? fakultasVal : null,
                                tahun: tahunVal !== 'Semua Tahun' ? tahunVal : null,
                            }, {
                                preserveState: true,
                                preserveScroll: true,
                            });
                        }}
                        onOpenModal={handleOpenKurikulumModal} 
                        onDelete={handleDeleteProdi}
                        onViewDetail={handleOpenDetailModal}
                    />
                )}
                {activeTab === 'matakuliah' && (
                    <MataKuliahTab 
                        onOpenModal={() => setIsMKModalOpen(true)} 
                    />
                )}
                {activeTab === 'jadwal' && (
                    <JadwalTab 
                        onOpenModal={() => setIsJadwalModalOpen(true)} 
                    />
                )}
                {activeTab === 'kalender' && (
                    <KalenderTab 
                        onOpenModal={() => setIsKalenderModalOpen(true)} 
                        onToast={(msg) => triggerToast(msg, 'success')} 
                    />
                )}

                {/* Scroll to Top */}
                <button 
                    className={`scroll-top cursor-pointer ${showScrollTop ? 'visible' : ''}`} 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    <i className="bi bi-chevron-up" />
                </button>
            </div>

            {/* MODALS */}
            <KurikulumModal 
                isOpen={isKurikulumModalOpen} 
                onClose={() => {
                    setIsKurikulumModalOpen(false);
                    setEditingProdi(null);
                }} 
                onSave={handleSaveModal}
                fakultas={fakultas}
                prodi={editingProdi}
            />
            <MataKuliahModal 
                isOpen={isMKModalOpen} 
                onClose={() => setIsMKModalOpen(false)} 
                onSave={handleSaveModal} 
            />
            <JadwalModal 
                isOpen={isJadwalModalOpen} 
                onClose={() => setIsJadwalModalOpen(false)} 
                onSave={handleSaveModal} 
            />
            <KalenderModal 
                isOpen={isKalenderModalOpen} 
                onClose={() => setIsKalenderModalOpen(false)} 
                onSave={handleSaveModal} 
            />
            <KurikulumDetailModal 
                isOpen={detailProdi !== null} 
                onClose={() => setDetailProdi(null)} 
                prodi={detailProdi}
            />

            {/* DELETE CONFIRMATION MODAL */}
            <ConfirmationModal
                show={prodiToDelete !== null}
                title="Hapus Program Studi"
                description={
                    <>
                        Apakah Anda yakin ingin menghapus program studi <strong>{prodiToDelete?.prodi}</strong> ({prodiToDelete?.jenjang}) beserta seluruh data kurikulum terkait?
                    </>
                }
                warningText="Tindakan ini tidak dapat dibatalkan. Seluruh data kurikulum, mata kuliah, dan jadwal terkait program studi ini akan terpengaruh."
                confirmText="Hapus Program Studi"
                cancelText="Batal"
                onClose={() => setProdiToDelete(null)}
                onConfirm={confirmDeleteProdi}
                processing={isDeleting}
                variant="danger"
            />

            {/* TOAST */}
            {toast?.show && (
                <div
                    className="flex items-center gap-3 fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3.5 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.15)] font-bold text-xs transition-all duration-300 font-poppins"
                    style={{
                        backgroundColor: toast.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)',
                        border: toast.type === 'success' ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(244,63,94,0.4)',
                        color: toast.type === 'success' ? '#10b981' : '#f43f5e',
                        backdropFilter: 'blur(12px)', 
                        zIndex: 9999,
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
