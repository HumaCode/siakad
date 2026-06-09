import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import FormModal from '@/Components/FormModal';
import FormInput from '@/Components/FormInput';
import FormSelect from '@/Components/FormSelect';

export default function MahasiswaFormModal({ isOpen, onClose, mahasiswa, allProdis, allDosens }: any) {
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

    const handleSubmit = () => {
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                reset();
            }
        };

        if (mahasiswa) {
            put(route('mahasiswa.update', mahasiswa.id), options);
        } else {
            post(route('mahasiswa.store'), options);
        }
    };

    const prodiOptions = [
        { value: '', label: 'Pilih Prodi' },
        ...allProdis.map((p: any) => ({
            value: p.id,
            label: `${p.nama} (${p.jenjang})`
        }))
    ];

    const statusOptions = [
        { value: 'Aktif', label: 'Aktif' },
        { value: 'Cuti', label: 'Cuti' },
        { value: 'Non-Aktif', label: 'Non-Aktif' },
        { value: 'Drop Out', label: 'Drop Out' },
        { value: 'Lulus', label: 'Lulus' }
    ];

    const dosenOptions = [
        { value: '', label: 'Pilih Dosen Wali' },
        ...allDosens.map((d: any) => ({
            value: d.id,
            label: d.nama
        }))
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

                <FormSelect
                    label="Program Studi"
                    value={data.prodi_id}
                    onChange={e => setData('prodi_id', e.target.value)}
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

                <FormSelect
                    label="Dosen Wali"
                    value={data.dosen_wali_id}
                    onChange={e => setData('dosen_wali_id', e.target.value)}
                    options={dosenOptions}
                    error={errors.dosen_wali_id}
                />
            </div>
        </FormModal>
    );
}
