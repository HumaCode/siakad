<?php

namespace App\Repositories\Interfaces;

use App\Models\Mahasiswa;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface MahasiswaRepositoryInterface
{
    /**
     * Get all mahasiswas.
     */
    public function all(): Collection;

    /**
     * Get paginated mahasiswas with filters.
     */
    public function paginate(int $perPage = 15, ?string $search = null, ?string $prodiId = null, ?string $angkatan = null, ?string $status = null): LengthAwarePaginator;

    /**
     * Find a mahasiswa by ID.
     */
    public function find(string $id): ?Mahasiswa;

    /**
     * Find a mahasiswa by NIM.
     */
    public function findByNim(string $nim): ?Mahasiswa;

    /**
     * Create a new mahasiswa record.
     */
    public function create(array $data): Mahasiswa;

    /**
     * Update an existing mahasiswa record.
     */
    public function update(string $id, array $data): Mahasiswa;

    /**
     * Delete a mahasiswa record.
     */
    public function delete(string $id): bool;
}
