<?php

namespace App\Repositories;

use App\Models\Dosen;
use App\Repositories\Interfaces\DosenRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class DosenRepository implements DosenRepositoryInterface
{
    /**
     * Get all dosens.
     */
    public function all(): Collection
    {
        return Dosen::with(['user', 'prodi'])->get();
    }

    /**
     * Get paginated dosens.
     */
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Dosen::with(['user', 'prodi'])
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Find a dosen by ID.
     */
    public function find(string $id): ?Dosen
    {
        return Dosen::with(['user', 'prodi'])->find($id);
    }

    /**
     * Find a dosen by NIDN.
     */
    public function findByNidn(string $nidn): ?Dosen
    {
        return Dosen::with(['user', 'prodi'])
            ->where('nidn', $nidn)
            ->first();
    }

    /**
     * Create a new dosen record.
     */
    public function create(array $data): Dosen
    {
        return Dosen::create($data);
    }

    /**
     * Update an existing dosen record.
     */
    public function update(string $id, array $data): Dosen
    {
        $dosen = Dosen::findOrFail($id);
        $dosen->update($data);
        return $dosen;
    }

    /**
     * Delete a dosen record.
     */
    public function delete(string $id): bool
    {
        $dosen = Dosen::findOrFail($id);
        return $dosen->delete();
    }
}
