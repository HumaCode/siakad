import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import '@/../css/dosen.css';

// Partials
import StatCards from './Partials/StatCards';
import FilterToolbar from './Partials/FilterToolbar';
import DosenTable from './Partials/DosenTable';
import DosenCardView from './Partials/DosenCardView';
import BebanMengajar from './Partials/BebanMengajar';
import JabatanFungsional from './Partials/JabatanFungsional';
import StafTable from './Partials/StafTable';
import DosenDetailDrawer from './Partials/DosenDetailDrawer';
import DosenFormModal from './Partials/DosenFormModal';
import DosenImportModal from './Partials/DosenImportModal';
import Toast, { useToast } from '@/Components/Toast';

// Mock Data from HTML template
const defaultDosenData = [
    { id: 1, nidn: '0123456789', nama: 'Prof. Dr. Agus Maulana, Ph.D', initials: 'AM', gelar: 'Profesor', jabatan: 'Guru Besar', prodi: 'Teknik Informatika', mk: ['Machine Learning', 'Kecerdasan Buatan'], sks: 12, mhsBimbing: 32, rating: 4.8, pub: 48, status: 'Aktif', email: 'agus.m@univ.ac.id', hp: '0812-1234-5678', ttl: 'Bandung, 15 Maret 1968', pendidikan: 'S3 - MIT, USA (2002)', keahlian: 'AI, Machine Learning, Data Science', masaKerja: '22 tahun', scopus: '57206' },
    { id: 2, nidn: '0987654321', nama: 'Dr. Rina Wulandari, M.T', initials: 'RW', gelar: 'Doktor', jabatan: 'Lektor Kepala', prodi: 'Teknik Informatika', mk: ['Basis Data Lanjut', 'Sistem Basis Data'], sks: 9, mhsBimbing: 24, rating: 4.6, pub: 22, status: 'Aktif', email: 'rina.w@univ.ac.id', hp: '0812-2345-6789', ttl: 'Surabaya, 8 Juli 1978', pendidikan: 'S3 - ITS Surabaya (2012)', keahlian: 'Database Systems, Big Data', masaKerja: '14 tahun', scopus: '58312' },
    { id: 3, nidn: '0111222333', nama: 'Drs. Hendra Gunawan, M.Cs', initials: 'HG', gelar: 'Magister', jabatan: 'Lektor', prodi: 'Teknik Informatika', mk: ['Rekayasa Perangkat Lunak', 'Analisis Sistem'], sks: 9, mhsBimbing: 18, rating: 4.4, pub: 12, status: 'Aktif', email: 'hendra.g@univ.ac.id', hp: '0813-3456-7890', ttl: 'Yogyakarta, 22 Nov 1982', pendidikan: 'S2 - UGM (2008)', keahlian: 'Software Engineering, Agile', masaKerja: '11 tahun', scopus: '-' },
    { id: 4, nidn: '0444555666', nama: 'Ir. Surya Pratama, M.T', initials: 'SP', gelar: 'Magister', jabatan: 'Lektor', prodi: 'Teknik Informatika', mk: ['Jaringan Komputer', 'Keamanan Siber'], sks: 9, mhsBimbing: 20, rating: 4.5, pub: 18, status: 'Aktif', email: 'surya.p@univ.ac.id', hp: '0811-4567-8901', ttl: 'Semarang, 3 Apr 1980', pendidikan: 'S2 - UNDIP (2010)', keahlian: 'Networking, Cybersecurity', masaKerja: '13 tahun', scopus: '64821' },
    { id: 5, nidn: '0777888999', nama: 'Dr. Maya Sari, M.Si', initials: 'MS', gelar: 'Doktor', jabatan: 'Lektor Kepala', prodi: 'Sistem Informasi', mk: ['Analisis & Desain Sistem', 'Manajemen SI'], sks: 9, mhsBimbing: 28, rating: 4.7, pub: 31, status: 'Aktif', email: 'maya.s@univ.ac.id', hp: '0815-5678-9012', ttl: 'Jakarta, 11 Jan 1979', pendidikan: 'S3 - UI (2013)', keahlian: 'IS Management, ERP Systems', masaKerja: '15 tahun', scopus: '71294' },
    { id: 6, nidn: '0102030405', nama: 'Dr. Andi Kurniawan, M.Kom', initials: 'AK', gelar: 'Doktor', jabatan: 'Lektor', prodi: 'Teknik Informatika', mk: ['Keamanan Siber', 'Kriptografi'], sks: 12, mhsBimbing: 22, rating: 4.3, pub: 26, status: 'Aktif', email: 'andi.k@univ.ac.id', hp: '0816-6789-0123', ttl: 'Makassar, 28 Sep 1985', pendidikan: 'S3 - ITB (2016)', keahlian: 'Cybersecurity, Cryptography', masaKerja: '9 tahun', scopus: '82164' },
    { id: 7, nidn: '0607080910', nama: 'Prof. Hendra Kurniawan, Ph.D', initials: 'HK', gelar: 'Profesor', jabatan: 'Guru Besar', prodi: 'Manajemen Bisnis', mk: ['Manajemen Strategis', 'Leadership'], sks: 9, mhsBimbing: 35, rating: 4.9, pub: 64, status: 'Aktif', email: 'hendra.k@univ.ac.id', hp: '0817-7890-1234', ttl: 'Medan, 5 Feb 1965', pendidikan: 'S3 - NUS, Singapore (1998)', keahlian: 'Strategic Management, Leadership', masaKerja: '26 tahun', scopus: '38274' },
    { id: 8, nidn: '1112131415', nama: 'Dr. Dewi Anggraini, M.M', initials: 'DA', gelar: 'Doktor', jabatan: 'Lektor Kepala', prodi: 'Manajemen Bisnis', mk: ['Kewirausahaan Digital', 'Pemasaran Digital'], sks: 9, mhsBimbing: 20, rating: 4.5, pub: 19, status: 'Aktif', email: 'dewi.a@univ.ac.id', hp: '0818-8901-2345', ttl: 'Bandung, 14 Jun 1983', pendidikan: 'S3 - UNPAD (2015)', keahlian: 'Digital Marketing, Entrepreneurship', masaKerja: '10 tahun', scopus: '91734' },
    { id: 9, nidn: '1617181920', nama: 'Dr. Fajar Nugroho, M.T', initials: 'FN', gelar: 'Doktor', jabatan: 'Lektor', prodi: 'Teknik Informatika', mk: ['Machine Learning', 'Deep Learning'], sks: 12, mhsBimbing: 26, rating: 4.6, pub: 38, status: 'Aktif', email: 'fajar.n@univ.ac.id', hp: '0819-9012-3456', ttl: 'Solo, 20 Oct 1987', pendidikan: 'S3 - TU Delft, Netherlands (2018)', keahlian: 'Deep Learning, Computer Vision', masaKerja: '7 tahun', scopus: '104823' },
    { id: 10, nidn: '2122232425', nama: 'M. Saleh Prasetyo, M.T', initials: 'MP', gelar: 'Magister', jabatan: 'Asisten Ahli', prodi: 'Teknik Informatika', mk: ['Mobile Computing', 'Flutter Development'], sks: 9, mhsBimbing: 14, rating: 4.4, pub: 8, status: 'Aktif', email: 'm.saleh@univ.ac.id', hp: '0820-0123-4567', ttl: 'Malang, 7 Mar 1992', pendidikan: 'S2 - ITS (2020)', keahlian: 'Mobile Dev, Flutter, React Native', masaKerja: '5 tahun', scopus: '-' },
    { id: 11, nidn: '2627282930', nama: 'Dr. Sari Dewi, S.H., M.H', initials: 'SD', gelar: 'Doktor', jabatan: 'Lektor Kepala', prodi: 'Ilmu Hukum', mk: ['Hukum Perdata', 'Hukum Kontrak'], sks: 9, mhsBimbing: 30, rating: 4.6, pub: 24, status: 'Aktif', email: 'sari.d@univ.ac.id', hp: '0821-1234-5678', ttl: 'Padang, 18 Aug 1980', pendidikan: 'S3 - UI (2014)', keahlian: 'Civil Law, Contract Law', masaKerja: '12 tahun', scopus: '-' },
    { id: 12, nidn: '3132333435', nama: 'Ir. Baskoro Aji, M.M', initials: 'BA', gelar: 'Magister', jabatan: 'Lektor', prodi: 'Teknik Elektro', mk: ['Sistem Tenaga Listrik', 'Elektronika Daya'], sks: 9, mhsBimbing: 16, rating: 4.2, pub: 11, status: 'Cuti', email: 'baskoro.a@univ.ac.id', hp: '0822-2345-6789', ttl: 'Semarang, 25 Dec 1979', pendidikan: 'S2 - ITS (2007)', keahlian: 'Power Systems, Power Electronics', masaKerja: '16 tahun', scopus: '-' },
];

export default function Dosen({ dosens, stats, all_prodis }: any) {
    const [dosenList, setDosenList] = useState<any[]>(() => dosens || defaultDosenData);

    useEffect(() => {
        if (dosens) {
            setDosenList(dosens);
        }
    }, [dosens]);

    const [activeTab, setActiveTab] = useState<'dosen' | 'beban' | 'jabatan' | 'staf'>('dosen');
    const [viewMode, setViewMode] = useState<'table' | 'card'>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('dosen_view_mode');
            return (saved === 'table' || saved === 'card') ? saved : 'card';
        }
        return 'card';
    });

    useEffect(() => {
        localStorage.setItem('dosen_view_mode', viewMode);
    }, [viewMode]);

    // Filters
    const [search, setSearch] = useState('');
    const [prodiFilter, setProdiFilter] = useState('');
    const [gelarFilter, setGelarFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Modals & Drawer state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingDosen, setEditingDosen] = useState<any | null>(null);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [detailedDosen, setDetailedDosen] = useState<any | null>(null);

    // Toast
    const { toast, triggerToast, clearToast } = useToast();

    // Scroll top button
    const [showScrollTop, setShowScrollTop] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 200);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Filter Logic
    const filteredDosens = dosenList.filter((d) => {
        const matchesSearch = !search ||
            d.nama.toLowerCase().includes(search.toLowerCase()) ||
            d.nidn.includes(search) ||
            d.email.toLowerCase().includes(search.toLowerCase());

        const matchesProdi = !prodiFilter || d.prodi === prodiFilter;
        const matchesGelar = !gelarFilter || d.gelar === gelarFilter;
        const matchesStatus = !statusFilter || d.status === statusFilter;

        return matchesSearch && matchesProdi && matchesGelar && matchesStatus;
    });

    const handleOpenDetail = (dosen: any) => {
        setDetailedDosen(dosen);
        setIsDetailOpen(true);
    };

    const handleOpenEdit = (dosen: any) => {
        setEditingDosen(dosen);
        setIsFormOpen(true);
    };

    const handleOpenAdd = () => {
        setEditingDosen(null);
        setIsFormOpen(true);
    };

    const handleDeleteDosen = (dosen: any) => {
        if (confirm(`Apakah Anda yakin ingin menghapus data dosen ${dosen.nama}?`)) {
            router.delete(`/dosen/${dosen.id}`, {
                onSuccess: () => {
                    triggerToast('Data dosen berhasil dihapus', 'success');
                },
                onError: () => {
                    triggerToast('Gagal menghapus data dosen', 'danger');
                }
            });
        }
    };

    const handleImportStart = () => {
        setIsImportOpen(false);
        triggerToast('Import data dosen berhasil dimulai', 'success');
    };


    return (
        <AuthenticatedLayout header="Manajemen Dosen & Staf">
            <Head title="Dosen & Staf" />

            <div className="ph-inner">
                {/* PAGE HEADER */}
                <div className="page-header" data-aos="fade-down">
                    <h4>Manajemen Dosen & Staf</h4>
                    <p>Kelola profil akademik dosen, beban SKS mengajar, pembimbingan akademik, serta status kepegawaian staf non-dosen secara terpadu.</p>
                    <div className="ph-right">
                        <button className="btn-ph btn-ph-white" onClick={() => setIsImportOpen(true)}>
                            <i className="bi bi-file-earmark-excel"></i> Import Excel
                        </button>
                        <button className="btn-ph btn-ph-solid" onClick={handleOpenAdd}>
                            <i className="bi bi-person-plus-fill"></i> Tambah Dosen
                        </button>
                    </div>
                </div>

                {/* STAT CARDS */}
                <StatCards stats={stats} />

                {/* MAIN TABS */}
                <div className="main-tabs" data-aos="fade-up" data-aos-delay="100">
                    <button
                        className={`main-tab ${activeTab === 'dosen' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dosen')}
                    >
                        <i className="bi bi-person-badge-fill"></i>
                        Dosen Tetap
                        <span className="tab-count">{filteredDosens.length}</span>
                    </button>
                    <button
                        className={`main-tab ${activeTab === 'beban' ? 'active' : ''}`}
                        onClick={() => setActiveTab('beban')}
                    >
                        <i className="bi bi-journal-richtext"></i>
                        Beban Mengajar
                    </button>
                    <button
                        className={`main-tab ${activeTab === 'jabatan' ? 'active' : ''}`}
                        onClick={() => setActiveTab('jabatan')}
                    >
                        <i className="bi bi-award-fill"></i>
                        Jabatan Fungsional
                    </button>
                    <button
                        className={`main-tab ${activeTab === 'staf' ? 'active' : ''}`}
                        onClick={() => setActiveTab('staf')}
                    >
                        <i className="bi bi-people-fill"></i>
                        Staf Non-Dosen
                        <span className="tab-count">8</span>
                    </button>
                </div>

                {/* TAB PANELS */}
                <div className="tab-content mt-2">
                    <div className={`tab-panel ${activeTab === 'dosen' ? 'active' : ''}`}>
                        <FilterToolbar
                            search={search}
                            onSearchChange={setSearch}
                            prodiFilter={prodiFilter}
                            onProdiChange={setProdiFilter}
                            gelarFilter={gelarFilter}
                            onGelarChange={setGelarFilter}
                            statusFilter={statusFilter}
                            onStatusChange={setStatusFilter}
                            viewMode={viewMode}
                            onViewModeChange={setViewMode}
                            onAddClick={handleOpenAdd}
                            onImportClick={() => setIsImportOpen(true)}
                        />

                        {viewMode === 'table' ? (
                            <DosenTable
                                dosens={filteredDosens}
                                onViewDetail={handleOpenDetail}
                                onEdit={handleOpenEdit}
                                onDelete={handleDeleteDosen}
                            />
                        ) : (
                            <DosenCardView
                                dosens={filteredDosens}
                                onViewDetail={handleOpenDetail}
                                onEdit={handleOpenEdit}
                            />
                        )}
                    </div>

                    <div className={`tab-panel ${activeTab === 'beban' ? 'active' : ''}`}>
                        <BebanMengajar dosens={dosenList} />
                    </div>

                    <div className={`tab-panel ${activeTab === 'jabatan' ? 'active' : ''}`}>
                        <JabatanFungsional />
                    </div>

                    <div className={`tab-panel ${activeTab === 'staf' ? 'active' : ''}`}>
                        <StafTable />
                    </div>
                </div>
            </div>

            {/* DETAIL PROFILE DRAWER */}
            <DosenDetailDrawer
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                dosen={detailedDosen}
                onEdit={handleOpenEdit}
            />

            {/* FORM MODAL */}
            <DosenFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                dosen={editingDosen}
                allProdis={all_prodis}
                onSuccess={(msg) => triggerToast(msg, 'success')}
                onError={(msg) => triggerToast(msg, 'danger')}
            />

            {/* IMPORT MODAL */}
            <DosenImportModal
                isOpen={isImportOpen}
                onClose={() => setIsImportOpen(false)}
                onImportStart={handleImportStart}
            />

            {/* TOAST NOTIFICATION */}
            <Toast toast={toast} onClose={clearToast} />

            {/* SCROLL TOP BUTTON */}
            <button
                className={`scroll-top ${showScrollTop ? 'visible' : ''}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                style={{ zIndex: 999 }}
            >
                <i className="bi bi-chevron-up"></i>
            </button>
        </AuthenticatedLayout>
    );
}
