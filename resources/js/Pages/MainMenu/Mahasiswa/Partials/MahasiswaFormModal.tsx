import React, { useEffect, useMemo } from 'react';
import { useForm } from '@inertiajs/react';
import FormModal from '@/Components/FormModal';
import FormInput from '@/Components/FormInput';
import FormSelect from '@/Components/FormSelect';
import SearchableSelect from '@/Components/SearchableSelect';

export default function MahasiswaFormModal({ isOpen, onClose, mahasiswa, allProdis, allDosens, onSuccess, onError }: any) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        nim: '',
        nama: '',
        prodi_id: '',
        angkatan: new Date().getFullYear().toString(),
        status_akademik: 'Aktif',
        dosen_wali_id: '',
    });

    useEffect(() => {
        if (isOpen) {
            if (mahasiswa) {
                setData({
                    nim: mahasiswa.nim || '',
                    nama: mahasiswa.nama || '',
                    prodi_id: mahasiswa.prodi_id || '',
                    angkatan: mahasiswa.angkatan || '',
                    status_akademik: mahasiswa.status_akademik || 'Aktif',
                    dosen_wali_id: mahasiswa.dosen_wali_id || '',
                });
            } else {
                reset();
            }
            clearErrors();
        }
    }, [isOpen, mahasiswa]);

    // Auto-fill dosen wali when prodi changes
    const handleProdiChange = (prodiId: string) => {
        setData(prev => {
            // Find a dosen from that prodi
            const dosenForProdi = allDosens.find((d: any) => String(d.prodi_id) === String(prodiId));
            return {
                ...prev,
                prodi_id: prodiId,
                dosen_wali_id: dosenForProdi ? String(dosenForProdi.id) : '',
            };
        });
    };

    // Dosen filtered by selected prodi (for display / fallback select)
    const dosenForSelectedProdi = useMemo(() => {
        if (!data.prodi_id) return [];
        return allDosens.filter((d: any) => String(d.prodi_id) === String(data.prodi_id));
    }, [data.prodi_id, allDosens]);

    // Currently selected dosen object
    const selectedDosen = useMemo(() => {
        if (!data.dosen_wali_id) return null;
        return allDosens.find((d: any) => String(d.id) === String(data.dosen_wali_id)) ?? null;
    }, [data.dosen_wali_id, allDosens]);

    const handleSubmit = () => {
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                reset();
                const msg = mahasiswa
                    ? 'Data mahasiswa berhasil diperbarui'
                    : 'Mahasiswa baru berhasil ditambahkan';
                onSuccess?.(msg);
            },
            onError: (errors: Record<string, string>) => {
                const firstError = Object.values(errors)[0];
                onError?.(firstError || 'Terjadi kesalahan, periksa kembali form');
            },
        };

        if (mahasiswa) {
            put(route('mahasiswa.update', mahasiswa.id), options);
        } else {
            post(route('mahasiswa.store'), options);
        }
    };

    // --- Options ---
    const prodiOptions = allProdis.map((p: any) => ({
        value: p.id,
        label: `${p.nama} (${p.jenjang})`
    }));

    const statusOptions = [
        { value: 'Aktif',     label: 'Aktif' },
        { value: 'Cuti',      label: 'Cuti' },
        { value: 'Non-Aktif', label: 'Non-Aktif' },
        { value: 'Drop Out',  label: 'Drop Out' },
        { value: 'Lulus',     label: 'Lulus' },
    ];

    // Dosen options when prodi has multiple dosen (allow manual pick)
    const dosenOptions = [
        { value: '', label: 'Pilih Dosen Wali' },
        ...dosenForSelectedProdi.map((d: any) => ({
            value: d.id,
            label: d.nama,
        })),
    ];

    return (
        <FormModal
            show={isOpen}
            onClose={onClose}
            onSave={handleSubmit}
            processing={processing}
            maxWidth="3xl"
            title={mahasiswa ? 'Edit Mahasiswa' : 'Tambah Mahasiswa'}
            subtitle={mahasiswa ? 'Ubah informasi data akademik mahasiswa' : 'Tambahkan data mahasiswa baru ke dalam sistem'}
            saveText={mahasiswa ? 'Simpan Perubahan' : 'Simpan'}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    label="NIM"
                    placeholder="Masukkan NIM"
                    value={data.nim}
                    onChange={e => setData('nim', e.target.value)}
                    error={errors.nim}
                    required
                />

                <FormInput
                    label="Nama Lengkap"
                    placeholder="Masukkan Nama Lengkap"
                    value={data.nama}
                    onChange={e => setData('nama', e.target.value)}
                    error={errors.nama}
                    required
                />

                {/* Program Studi — Select2 style */}
                <SearchableSelect
                    label="Program Studi"
                    placeholder="Pilih Program Studi"
                    value={data.prodi_id}
                    onChange={handleProdiChange}
                    options={prodiOptions}
                    error={errors.prodi_id}
                    required
                />

                <FormInput
                    label="Angkatan"
                    placeholder="Masukkan Tahun Angkatan"
                    value={data.angkatan}
                    onChange={e => setData('angkatan', e.target.value)}
                    error={errors.angkatan}
                    required
                />

                <FormSelect
                    label="Status Akademik"
                    value={data.status_akademik}
                    onChange={e => setData('status_akademik', e.target.value)}
                    options={statusOptions}
                    error={errors.status_akademik}
                    required
                />

                {/* Dosen Wali — auto-filled, editable jika prodi punya banyak dosen */}
                <div>
                    <label className="form-label-c">Dosen Wali</label>

                    {!data.prodi_id ? (
                        // Belum pilih prodi
                        <div className="dosen-auto-field">
                            <i className="bi bi-person-badge text-slate-300" style={{ fontSize: '16px' }} />
                            <span className="dosen-empty">Pilih Program Studi terlebih dahulu</span>
                        </div>
                    ) : dosenForSelectedProdi.length === 0 ? (
                        // Prodi tidak punya dosen
                        <div className="dosen-auto-field">
                            <i className="bi bi-exclamation-circle text-amber-400" style={{ fontSize: '16px' }} />
                            <span className="dosen-empty">Belum ada dosen di prodi ini</span>
                        </div>
                    ) : dosenForSelectedProdi.length === 1 ? (
                        // Hanya 1 dosen — tampilkan auto-filled read-only
                        <div className="dosen-auto-field">
                            <i className="bi bi-person-check-fill" style={{ fontSize: '16px', color: 'var(--primary)' }} />
                            <span className="dosen-name">{selectedDosen?.nama ?? dosenForSelectedProdi[0].nama}</span>
                            <i className="bi bi-magic" style={{ fontSize: '11px', color: 'var(--text-muted)' }} title="Otomatis terisi" />
                        </div>
                    ) : (
                        // Banyak dosen — bisa dipilih manual
                        <FormSelect
                            value={data.dosen_wali_id}
                            onChange={e => setData('dosen_wali_id', e.target.value)}
                            options={dosenOptions}
                            error={errors.dosen_wali_id}
                        />
                    )}

                    {errors.dosen_wali_id && (
                        <p className="ss-error-msg">{errors.dosen_wali_id}</p>
                    )}
                </div>
            </div>
        </FormModal>
    );
}
