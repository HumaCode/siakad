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
        ]);
    }
}
