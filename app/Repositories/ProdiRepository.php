<?php

namespace App\Repositories;

use App\Models\Prodi;
use App\Repositories\Interfaces\ProdiRepositoryInterface;
use Illuminate\Support\Collection;

class ProdiRepository implements ProdiRepositoryInterface
{
    /**
     * Get all program of studies with their faculty.
     */
    public function getAllProdis(): Collection
    {
        return Prodi::with('fakultas')->orderBy('nama')->get();
    }

    /**
     * Store a new program of study.
     */
    public function createProdi(array $data): Prodi
    {
        return Prodi::create([
            'fakultas_id' => $data['fakultas_id'],
            'kode' => $data['kode'],
            'nama' => $data['nama'],
            'jenjang' => $data['jenjang'],
            'kaprodi' => $data['kaprodi'] ?? null,
            'status' => $data['status'] ?? 'Aktif',
            'deskripsi' => $data['deskripsi'] ?? null,
            'sks' => $data['sks'] ?? 144,
            'lama_studi' => $data['lama_studi'] ?? 8,
            'akreditasi' => $data['akreditasi'] ?? 'Unggul',
            'tahun' => $data['tahun'] ?? 2024,
        ]);
    }

    /**
     * Update an existing program of study.
     */
    public function updateProdi(Prodi $prodi, array $data): Prodi
    {
        $prodi->update([
            'fakultas_id' => $data['fakultas_id'],
            'kode' => $data['kode'],
            'nama' => $data['nama'],
            'jenjang' => $data['jenjang'],
            'kaprodi' => $data['kaprodi'] ?? null,
            'status' => $data['status'] ?? 'Aktif',
            'deskripsi' => $data['deskripsi'] ?? null,
            'sks' => $data['sks'] ?? 144,
            'lama_studi' => $data['lama_studi'] ?? 8,
            'akreditasi' => $data['akreditasi'] ?? 'Unggul',
            'tahun' => $data['tahun'] ?? 2024,
        ]);

        return $prodi;
    }
}
