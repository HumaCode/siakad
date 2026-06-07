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
     * Get paginated program of studies with search query and filters.
     */
    public function getPaginatedProdis(?string $search, ?string $fakultas, ?string $tahun, int $perPage = 6): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        $query = Prodi::with('fakultas')->orderBy('nama');

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('kode', 'like', "%{$search}%")
                  ->orWhere('kaprodi', 'like', "%{$search}%");
            });
        }

        if (!empty($fakultas) && $fakultas !== 'Semua Fakultas') {
            $query->whereHas('fakultas', function ($q) use ($fakultas) {
                $q->where('nama', $fakultas);
            });
        }

        if (!empty($tahun) && $tahun !== 'Semua Tahun' && $tahun !== 'all') {
            $query->where('tahun', $tahun);
        }

        return $query->paginate($perPage)->withQueryString();
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

    /**
     * Delete an existing program of study.
     */
    public function deleteProdi(Prodi $prodi): bool
    {
        return $prodi->delete();
    }
}
