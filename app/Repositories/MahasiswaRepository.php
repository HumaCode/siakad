<?php

namespace App\Repositories;

use App\Models\Mahasiswa;
use App\Repositories\Interfaces\MahasiswaRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class MahasiswaRepository implements MahasiswaRepositoryInterface
{
    /**
     * Get all mahasiswas.
     */
    public function all(): Collection
    {
        return Mahasiswa::with(['user', 'prodi', 'dosenWali'])->get();
    }

    /**
     * Get paginated mahasiswas.
     */
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Mahasiswa::with(['user', 'prodi', 'dosenWali'])
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Find a mahasiswa by ID.
     */
    public function find(string $id): ?Mahasiswa
    {
        return Mahasiswa::with(['user', 'prodi', 'dosenWali'])->find($id);
    }

    /**
     * Find a mahasiswa by NIM.
     */
    public function findByNim(string $nim): ?Mahasiswa
    {
        return Mahasiswa::with(['user', 'prodi', 'dosenWali'])
            ->where('nim', $nim)
            ->first();
    }

    /**
     * Create a new mahasiswa record.
     */
    public function create(array $data): Mahasiswa
    {
        return Mahasiswa::create($data);
    }

    /**
     * Update an existing mahasiswa record.
     */
    public function update(string $id, array $data): Mahasiswa
    {
        $mahasiswa = Mahasiswa::findOrFail($id);
        $mahasiswa->update($data);
        return $mahasiswa;
    }

    /**
     * Delete a mahasiswa record.
     */
    public function delete(string $id): bool
    {
        $mahasiswa = Mahasiswa::findOrFail($id);
        return $mahasiswa->delete();
    }
}
