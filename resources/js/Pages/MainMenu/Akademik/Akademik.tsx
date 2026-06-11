import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import ConfirmationModal from '@/Components/ConfirmationModal';
import { destroy as destroyProdi, destroyMataKuliah, destroyFakultas } from '@/actions/App/Http/Controllers/MainMenu/AkademikController';

// Partials
import KurikulumTab from './Partials/KurikulumTab';
import MataKuliahTab from './Partials/MataKuliahTab';
import KelasTab from './Partials/KelasTab';
import JadwalTab from './Partials/JadwalTab';
import KalenderTab from './Partials/KalenderTab';
import FakultasTab from './Partials/FakultasTab';

// Modals
import KurikulumModal from './Partials/KurikulumModal';
import MataKuliahModal from './Partials/MataKuliahModal';
import KelasModal from './Partials/KelasModal';
import JadwalModal from './Partials/JadwalModal';
import KalenderModal from './Partials/KalenderModal';
import KalenderDetailModal from './Partials/KalenderDetailModal';
import KurikulumDetailModal from './Partials/KurikulumDetailModal';
import MataKuliahDetailModal from './Partials/MataKuliahDetailModal';
import FakultasModal from './Partials/FakultasModal';

interface Stats {
    prodi_count: number;
    dosen_count: number;
    ruangan_count: number;
    matakuliah_count: number;
    jadwal_count: number;
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

interface PaginatedMataKuliahs {
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
    mata_kuliahs: PaginatedMataKuliahs;
    all_prodis: any[];
    all_prodis_with_years?: any[];
    all_dosens: any[];
    all_ruangans?: any[];
    all_mata_kuliahs_raw?: any[];
    jadwals?: any[];
    all_kelas?: any[];
    kalender?: any[];
    filters: {
        search: string | null;
        fakultas: string | null;
        tahun: string | null;
        search_mk: string | null;
        prodi_mk: string | null;
        sem_mk: string | null;
        jenis_mk: string | null;
    };
}

export default function Akademik({ stats, fakultas, prodis, mata_kuliahs, all_prodis, all_prodis_with_years = [], all_dosens, all_ruangans = [], all_mata_kuliahs_raw = [], all_kelas = [], jadwals = [], kalender = [], filters }: PageProps) {
    const [activeTab, setActiveTab] = useState<'kurikulum' | 'matakuliah' | 'kelas' | 'jadwal' | 'kalender' | 'fakultas'>('kurikulum');
    
    // Modal Open states
    const [isFakultasModalOpen, setIsFakultasModalOpen] = useState(false);
    const [editingFakultas, setEditingFakultas] = useState<any | null>(null);
    const [fakultasToDelete, setFakultasToDelete] = useState<any | null>(null);
    const [isDeletingFakultas, setIsDeletingFakultas] = useState(false);

    const handleOpenFakultasModal = (fakultas?: any) => {
        setEditingFakultas(fakultas && fakultas.id ? fakultas : null);
        setIsFakultasModalOpen(true);
    };

    const confirmDeleteFakultas = () => {
        if (!fakultasToDelete) return;
        setIsDeletingFakultas(true);
        router.delete(destroyFakultas.url(fakultasToDelete.id), {
            onSuccess: () => {
                setFakultasToDelete(null);
                setIsDeletingFakultas(false);
                triggerToast('Fakultas berhasil dihapus.', 'success');
            },
            onError: () => {
                setIsDeletingFakultas(false);
                triggerToast('Gagal menghapus Fakultas.', 'danger');
            }
        });
    };

    const [isKurikulumModalOpen, setIsKurikulumModalOpen] = useState(false);
    const [isMKModalOpen, setIsMKModalOpen] = useState(false);
    const [isJadwalModalOpen, setIsJadwalModalOpen] = useState(false);
    const [isKalenderModalOpen, setIsKalenderModalOpen] = useState(false);
    const [detailKalender, setDetailKalender] = useState<any | null>(null);
    const [editingKalender, setEditingKalender] = useState<any | null>(null);
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

    // Mata Kuliah states & handlers
    const [editingMataKuliah, setEditingMataKuliah] = useState<any | null>(null);
    const [detailMataKuliah, setDetailMataKuliah] = useState<any | null>(null);
    const [mataKuliahToDelete, setMataKuliahToDelete] = useState<any | null>(null);
    const [isDeletingMK, setIsDeletingMK] = useState(false);

    const handleOpenMKModal = (mk?: any) => {
        setEditingMataKuliah(mk && mk.id ? mk : null);
        setIsMKModalOpen(true);
    };

    const confirmDeleteMataKuliah = () => {
        if (!mataKuliahToDelete) return;
        setIsDeletingMK(true);
        router.delete(destroyMataKuliah.url(mataKuliahToDelete.id), {
            onSuccess: () => {
                setMataKuliahToDelete(null);
                setIsDeletingMK(false);
                triggerToast('Mata Kuliah berhasil dihapus.', 'success');
            },
            onError: () => {
                setIsDeletingMK(false);
                triggerToast('Gagal menghapus Mata Kuliah.', 'danger');
            }
        });
    };

    // Kelas states & handlers
    const [isKelasModalOpen, setIsKelasModalOpen] = useState(false);
    const [editingKelas, setEditingKelas] = useState<any | null>(null);
    const [kelasToDelete, setKelasToDelete] = useState<any | null>(null);
    const [isDeletingKelas, setIsDeletingKelas] = useState(false);

    const handleOpenKelasModal = (kelas?: any) => {
        setEditingKelas(kelas && kelas.id ? kelas : null);
        setIsKelasModalOpen(true);
    };

    const confirmDeleteKelas = () => {
        if (!kelasToDelete) return;
        setIsDeletingKelas(true);
        router.delete(route('akademik.kelas.destroy', kelasToDelete.id), {
            onSuccess: () => {
                setKelasToDelete(null);
                setIsDeletingKelas(false);
                triggerToast('Kelas berhasil dihapus.', 'success');
            },
            onError: () => {
                setIsDeletingKelas(false);
                triggerToast('Gagal menghapus Kelas.', 'danger');
            }
        });
    };

    // Jadwal states & handlers
    const [editingJadwal, setEditingJadwal] = useState<any | null>(null);
    const [jadwalToDelete, setJadwalToDelete] = useState<any | null>(null);
    const [isDeletingJadwal, setIsDeletingJadwal] = useState(false);

    const handleOpenJadwalModal = (jadwal?: any) => {
        setEditingJadwal(jadwal && jadwal.id ? jadwal : null);
        setIsJadwalModalOpen(true);
    };

    const confirmDeleteJadwal = () => {
        if (!jadwalToDelete) return;
        setIsDeletingJadwal(true);
        router.delete(route('akademik.jadwal.destroy', jadwalToDelete.id), {
            onSuccess: () => {
                setJadwalToDelete(null);
                setIsDeletingJadwal(false);
                triggerToast('Jadwal kuliah berhasil dihapus.', 'success');
            },
            onError: () => {
                setIsDeletingJadwal(false);
                triggerToast('Gagal menghapus Jadwal kuliah.', 'danger');
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
        setIsKelasModalOpen(false);
        setIsJadwalModalOpen(false);
        setIsKalenderModalOpen(false);
        setIsFakultasModalOpen(false);
        setEditingProdi(null);
        setEditingMataKuliah(null);
        setEditingKelas(null);
        setEditingJadwal(null);
        setEditingKalender(null);
        setEditingFakultas(null);
        setDetailKalender(null);
        triggerToast(msg, 'success');
    };

    const handleKalenderEventClick = (ev: any) => {
        setDetailKalender(ev);
    };

    const handleEditKalender = () => {
        setEditingKalender(detailKalender);
        setDetailKalender(null);
        setIsKalenderModalOpen(true);
    };

    const handleDeletedKalender = (msg: string) => {
        setDetailKalender(null);
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
                        <div className="stat-mini-num text-teal-600 dark:text-teal-400">{stats.matakuliah_count}</div>
                        <div className="stat-mini-lbl">Mata Kuliah</div>
                        <div className="stat-mini-badge bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400">
                            Semester ini
                        </div>
                    </div>
                    <div className="stat-mini">
                        <div className="stat-mini-num text-purple-600 dark:text-purple-400">{stats.jadwal_count}</div>
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
                        className={`main-tab cursor-pointer ${activeTab === 'fakultas' ? 'active' : ''}`}
                        onClick={() => setActiveTab('fakultas')}
                    >
                        <i className="bi bi-building-fill" /> Fakultas
                        <span className="tab-count ms-1">{fakultas.length}</span>
                    </button>
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
                        <span className="tab-count ms-1">{stats.matakuliah_count}</span>
                    </button>
                    <button 
                        className={`main-tab cursor-pointer ${activeTab === 'kelas' ? 'active' : ''}`}
                        onClick={() => setActiveTab('kelas')}
                    >
                        <i className="bi bi-people-fill" /> Kelas 
                        <span className="tab-count ms-1">{all_kelas.length}</span>
                    </button>
                    <button 
                        className={`main-tab cursor-pointer ${activeTab === 'jadwal' ? 'active' : ''}`}
                        onClick={() => setActiveTab('jadwal')}
                    >
                        <i className="bi bi-calendar3-week-fill" /> Jadwal Kuliah 
                        <span className="tab-count ms-1">{stats.jadwal_count}</span>
                    </button>
                    <button 
                        className={`main-tab cursor-pointer ${activeTab === 'kalender' ? 'active' : ''}`}
                        onClick={() => setActiveTab('kalender')}
                    >
                        <i className="bi bi-calendar-event-fill" /> Kalender Akademik
                    </button>
                </div>

                {/* TAB PANELS */}
                {activeTab === 'fakultas' && (
                    <FakultasTab 
                        fakultas={fakultas}
                        onOpenModal={handleOpenFakultasModal}
                        onDelete={(f) => setFakultasToDelete(f)}
                    />
                )}
                {activeTab === 'kurikulum' && (
                    <KurikulumTab 
                        fakultas={fakultas} 
                        prodis={prodis}
                        initialSearch={filters?.search || ''}
                        initialFakultas={filters?.fakultas || 'Semua Fakultas'}
                        initialTahun={filters?.tahun || 'all'}
                        onFiltersChange={(searchVal, fakultasVal, tahunVal) => {
                            router.get('/akademik', {
                                search: searchVal || null,
                                fakultas: fakultasVal !== 'Semua Fakultas' ? fakultasVal : null,
                                tahun: tahunVal,
                            }, {
                                preserveState: true,
                                preserveScroll: true,
                            });
                        }}
                        onOpenModal={handleOpenKurikulumModal} 
                        onDelete={handleDeleteProdi}
                        onViewDetail={handleOpenDetailModal}
                        allProdisWithYears={all_prodis_with_years}
                        onCopySuccess={(msg) => triggerToast(msg, 'success')}
                    />
                )}
                {activeTab === 'matakuliah' && (
                    <MataKuliahTab 
                        mataKuliahs={mata_kuliahs}
                        allProdis={all_prodis}
                        initialSearch={filters?.search_mk || ''}
                        initialProdi={filters?.prodi_mk || ''}
                        initialSem={filters?.sem_mk || ''}
                        initialJenis={filters?.jenis_mk || ''}
                        onFiltersChange={(searchVal, prodiVal, semVal, jenisVal) => {
                            router.get('/akademik', {
                                search_mk: searchVal || null,
                                prodi_mk: prodiVal !== 'Semua Prodi' ? prodiVal : null,
                                sem_mk: semVal !== 'Semua Semester' ? semVal : null,
                                jenis_mk: jenisVal !== 'Semua Jenis' ? jenisVal : null,
                            }, {
                                preserveState: true,
                                preserveScroll: true,
                            });
                        }}
                        onOpenModal={() => handleOpenMKModal(null)} 
                        onEdit={handleOpenMKModal}
                        onDetail={(mk) => setDetailMataKuliah(mk)}
                        onDelete={(mk) => setMataKuliahToDelete(mk)} 
                    />
                )}
                {activeTab === 'kelas' && (
                    <KelasTab 
                        allKelas={all_kelas}
                        allProdis={all_prodis}
                        onOpenModal={handleOpenKelasModal}
                        onDelete={(kelas) => setKelasToDelete(kelas)} 
                    />
                )}
                {activeTab === 'jadwal' && (
                    <JadwalTab 
                        jadwals={jadwals}
                        allProdis={all_prodis}
                        allKelas={all_kelas}
                        onOpenModal={handleOpenJadwalModal} 
                        onDeleteJadwal={(jadwal) => setJadwalToDelete(jadwal)}
                    />
                )}
                {activeTab === 'kalender' && (
                    <KalenderTab 
                        kalender={kalender}
                        tahun={filters.tahun}
                        onOpenModal={() => setIsKalenderModalOpen(true)} 
                        onToast={(msg) => triggerToast(msg, 'success')} 
                        onEventClick={handleKalenderEventClick}
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
                onClose={() => {
                    setIsMKModalOpen(false);
                    setEditingMataKuliah(null);
                }} 
                onSave={handleSaveModal} 
                dosens={all_dosens}
                prodis={all_prodis}
                mataKuliah={editingMataKuliah}
            />
            <JadwalModal 
                isOpen={isJadwalModalOpen} 
                onClose={() => {
                    setIsJadwalModalOpen(false);
                    setEditingJadwal(null);
                }} 
                onSave={handleSaveModal} 
                ruangans={all_ruangans}
                mataKuliahs={all_mata_kuliahs_raw}
                dosens={all_dosens}
                allKelas={all_kelas}
                jadwal={editingJadwal}
            />
            <KelasModal 
                isOpen={isKelasModalOpen} 
                onClose={() => {
                    setIsKelasModalOpen(false);
                    setEditingKelas(null);
                }} 
                onSave={handleSaveModal} 
                prodis={all_prodis}
                kelas={editingKelas}
            />
            <KalenderModal 
                isOpen={isKalenderModalOpen} 
                onClose={() => {
                    setIsKalenderModalOpen(false);
                    setEditingKalender(null);
                }} 
                onSave={handleSaveModal} 
                tahun={filters.tahun || (new Date().getFullYear().toString())}
                eventToEdit={editingKalender}
            />
            <FakultasModal
                isOpen={isFakultasModalOpen}
                onClose={() => {
                    setIsFakultasModalOpen(false);
                    setEditingFakultas(null);
                }}
                onSave={handleSaveModal}
                fakultas={editingFakultas}
            />
            <KalenderDetailModal
                isOpen={detailKalender !== null}
                onClose={() => setDetailKalender(null)}
                eventDetail={detailKalender}
                onEdit={handleEditKalender}
                onDeleted={handleDeletedKalender}
            />
            <KurikulumDetailModal 
                isOpen={detailProdi !== null} 
                onClose={() => setDetailProdi(null)} 
                prodi={detailProdi}
            />
            <MataKuliahDetailModal 
                isOpen={detailMataKuliah !== null} 
                onClose={() => setDetailMataKuliah(null)} 
                mataKuliah={detailMataKuliah}
            />
            <ConfirmationModal
                show={mataKuliahToDelete !== null}
                title="Hapus Mata Kuliah"
                description={
                    <>
                        Apakah Anda yakin ingin menghapus mata kuliah <strong>{mataKuliahToDelete?.nama}</strong> ({mataKuliahToDelete?.kode})?
                    </>
                }
                warningText="Tindakan ini tidak dapat dibatalkan. Data mata kuliah yang dihapus akan hilang secara permanen dari sistem."
                confirmText="Hapus Mata Kuliah"
                cancelText="Batal"
                onClose={() => setMataKuliahToDelete(null)}
                onConfirm={confirmDeleteMataKuliah}
                processing={isDeletingMK}
                variant="danger"
            />

            <ConfirmationModal
                show={kelasToDelete !== null}
                title="Hapus Kelas"
                description={
                    <>
                        Apakah Anda yakin ingin menghapus kelas <strong>{kelasToDelete?.nama}</strong>?
                    </>
                }
                warningText="Tindakan ini tidak dapat dibatalkan. Seluruh jadwal kuliah yang dikaitkan dengan kelas ini juga akan terhapus."
                confirmText="Hapus Kelas"
                cancelText="Batal"
                onClose={() => setKelasToDelete(null)}
                onConfirm={confirmDeleteKelas}
                processing={isDeletingKelas}
                variant="danger"
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
                warningText="Tindakan ini tidak dapat dibatalkan. Seluruh data kurikulum, mata kuliah, and jadwal terkait program studi ini akan terpengaruh."
                confirmText="Hapus Program Studi"
                cancelText="Batal"
                onClose={() => setProdiToDelete(null)}
                onConfirm={confirmDeleteProdi}
                processing={isDeleting}
                variant="danger"
            />

            {/* DELETE CONFIRMATION MODAL FOR JADWAL */}
            <ConfirmationModal
                show={jadwalToDelete !== null}
                title="Hapus Jadwal Kuliah"
                description={
                    <>
                        Apakah Anda yakin ingin menghapus sesi jadwal kuliah untuk mata kuliah <strong>{jadwalToDelete?.mata_kuliah?.nama}</strong>?
                    </>
                }
                warningText="Tindakan ini tidak dapat dibatalkan. Sesi perkuliahan ini akan dihapus permanen dari sistem akademik."
                confirmText="Hapus Jadwal"
                cancelText="Batal"
                onClose={() => setJadwalToDelete(null)}
                onConfirm={confirmDeleteJadwal}
                processing={isDeletingJadwal}
                variant="danger"
            />

            <ConfirmationModal
                show={fakultasToDelete !== null}
                title="Hapus Fakultas"
                description={
                    <>
                        Apakah Anda yakin ingin menghapus fakultas <strong>{fakultasToDelete?.nama}</strong> ({fakultasToDelete?.kode})?
                    </>
                }
                warningText="Tindakan ini tidak dapat dibatalkan. Seluruh program studi yang terafiliasi dengan fakultas ini akan kehilangan induk fakultasnya."
                confirmText="Hapus Fakultas"
                cancelText="Batal"
                onClose={() => setFakultasToDelete(null)}
                onConfirm={confirmDeleteFakultas}
                processing={isDeletingFakultas}
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
