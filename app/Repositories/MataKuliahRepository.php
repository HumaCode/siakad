<?php

namespace App\Repositories;

use App\Models\MataKuliah;
use App\Repositories\Interfaces\MataKuliahRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class MataKuliahRepository implements MataKuliahRepositoryInterface
{
    /**
     * Get all courses.
     */
    public function getAllMataKuliahs(): Collection
    {
        return MataKuliah::with(['prodi', 'dosen'])->orderBy('kode')->get();
    }

    /**
     * Get paginated courses with filters.
     */
    public function getPaginatedMataKuliahs(?string $search, ?string $prodi, ?string $semester, ?string $jenis, int $perPage = 10): LengthAwarePaginator
    {
        $query = MataKuliah::with(['prodi', 'dosen'])->orderBy('kode');

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('kode', 'like', "%{$search}%")
                  ->orWhereHas('dosen', function ($qDosen) use ($search) {
                      $qDosen->where('nama', 'like', "%{$search}%")
                             ->orWhere('nidn', 'like', "%{$search}%");
                  });
            });
        }

        if (!empty($prodi) && $prodi !== 'Semua Prodi') {
            $query->whereHas('prodi', function ($q) use ($prodi) {
                $q->where('nama', $prodi);
            });
        }

        if (!empty($semester) && $semester !== 'Semua Semester') {
            $semNum = filter_var($semester, FILTER_SANITIZE_NUMBER_INT);
            if ($semNum !== '') {
                $query->where('sem', $semNum);
            }
        }

        if (!empty($jenis) && $jenis !== 'Semua Jenis') {
            $query->where('jenis', $jenis);
        }

        return $query->paginate($perPage)->withQueryString();
    }

    /**
     * Store a new course.
     */
    public function createMataKuliah(array $data): MataKuliah
    {
        return MataKuliah::create([
            'prodi_id' => $data['prodi_id'],
            'kode' => $data['kode'],
            'nama' => $data['nama'],
            'sks' => (int)($data['sks_teori'] ?? 0) + (int)($data['sks_praktik'] ?? 0),
            'sem' => $data['sem'],
            'jenis' => $data['jenis'] ?? 'Wajib',
            'prasyarat' => $data['prasyarat'] ?? null,
            'dosen_id' => $data['dosen_id'] ?? null,
            'status' => $data['status'] ?? 'Aktif',
            'deskripsi' => $data['deskripsi'] ?? null,
        ]);
    }

    /**
     * Update an existing course.
     */
    public function updateMataKuliah(MataKuliah $mataKuliah, array $data): MataKuliah
    {
        $mataKuliah->update([
            'prodi_id' => $data['prodi_id'],
            'kode' => $data['kode'],
            'nama' => $data['nama'],
            'sks' => (int)($data['sks_teori'] ?? 0) + (int)($data['sks_praktik'] ?? 0),
            'sem' => $data['sem'],
            'jenis' => $data['jenis'] ?? 'Wajib',
            'prasyarat' => $data['prasyarat'] ?? null,
            'dosen_id' => $data['dosen_id'] ?? null,
            'status' => $data['status'] ?? 'Aktif',
            'deskripsi' => $data['deskripsi'] ?? null,
        ]);

        return $mataKuliah;
    }

    /**
     * Delete an existing course.
     */
    public function deleteMataKuliah(MataKuliah $mataKuliah): bool
    {
        return $mataKuliah->delete();
    }
}
