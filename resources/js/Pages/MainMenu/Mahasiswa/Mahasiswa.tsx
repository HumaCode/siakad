import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import '@/../css/mahasiswa.css';

// Partials
import StatCards from './Partials/StatCards';
import FilterToolbar from './Partials/FilterToolbar';
import MahasiswaTable from './Partials/MahasiswaTable';
import MahasiswaFormModal from './Partials/MahasiswaFormModal';

export default function Mahasiswa({ mahasiswas, stats, filters, all_prodis, all_dosens, angkatan_list }: any) {
    const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
    const [search, setSearch] = useState(filters.search || '');
    const [prodiFilter, setProdiFilter] = useState(filters.prodi || '');
    const [angkatanFilter, setAngkatanFilter] = useState(filters.angkatan || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingMahasiswa, setEditingMahasiswa] = useState<any | null>(null);

    // Debounce search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            applyFilters();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search, prodiFilter, angkatanFilter, statusFilter]);

    const applyFilters = () => {
        router.get(
            route('mahasiswa.index'),
            {
                search,
                prodi: prodiFilter,
                angkatan: angkatanFilter,
                status: statusFilter,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const openCreateModal = () => {
        setEditingMahasiswa(null);
        setIsFormModalOpen(true);
    };

    const openEditModal = (mhs: any) => {
        setEditingMahasiswa(mhs);
        setIsFormModalOpen(true);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Mahasiswa - SIAKAD" />

            <div className="main-content">
                {/* PAGE HEADER */}
                <div className="page-header" data-aos="fade-down" data-aos-duration="550">
                    <div className="ph-inner">
                        <h4><i className="bi bi-people-fill me-2"></i>Manajemen Mahasiswa</h4>
                        <p>Data seluruh mahasiswa aktif, nonaktif, cuti, dan alumni Universitas Nusantara</p>
                    </div>
                    <div className="ph-right">
                        <button className="btn-ph btn-ph-white"><i className="bi bi-upload"></i> Import Excel</button>
                        <button className="btn-ph btn-ph-solid" onClick={openCreateModal}><i className="bi bi-person-plus-fill"></i> Tambah Mahasiswa</button>
                    </div>
                </div>

                {/* STAT CARDS */}
                <StatCards stats={stats} />

                {/* FILTER TOOLBAR */}
                <FilterToolbar
                    search={search}
                    setSearch={setSearch}
                    prodiFilter={prodiFilter}
                    setProdiFilter={setProdiFilter}
                    angkatanFilter={angkatanFilter}
                    setAngkatanFilter={setAngkatanFilter}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    allProdis={all_prodis}
                    angkatanList={angkatan_list}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    onAdd={openCreateModal}
                />

                {/* MAIN CONTENT AREA */}
                {viewMode === 'table' && (
                    <MahasiswaTable
                        mahasiswas={mahasiswas}
                        onEdit={openEditModal}
                    />
                )}
            </div>

            {/* MODALS */}
            <MahasiswaFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                mahasiswa={editingMahasiswa}
                allProdis={all_prodis}
                allDosens={all_dosens}
            />
        </AuthenticatedLayout>
    );
}
