<?php

namespace App\Repositories\Interfaces;

use App\Models\Dosen;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface DosenRepositoryInterface
{
    /**
     * Get all dosens.
     */
    public function all(): Collection;

    /**
     * Get paginated dosens.
     */
    public function paginate(int $perPage = 15): LengthAwarePaginator;

    /**
     * Find a dosen by ID.
     */
    public function find(string $id): ?Dosen;

    /**
     * Find a dosen by NIDN.
     */
    public function findByNidn(string $nidn): ?Dosen;

    /**
     * Create a new dosen record.
     */
    public function create(array $data): Dosen;

    /**
     * Update an existing dosen record.
     */
    public function update(string $id, array $data): Dosen;

    /**
     * Delete a dosen record.
     */
    public function delete(string $id): bool;
}
