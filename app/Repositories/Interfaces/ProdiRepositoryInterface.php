<?php

namespace App\Repositories\Interfaces;

use App\Models\Prodi;
use Illuminate\Support\Collection;

interface ProdiRepositoryInterface
{
    /**
     * Get all program of studies with their faculty.
     */
    public function getAllProdis(): Collection;

    /**
     * Get paginated program of studies with search query and filters.
     */
    public function getPaginatedProdis(?string $search, ?string $fakultas, ?string $tahun, int $perPage = 6): \Illuminate\Contracts\Pagination\LengthAwarePaginator;

    /**
     * Store a new program of study.
     */
    public function createProdi(array $data): Prodi;

    /**
     * Update an existing program of study.
     */
    public function updateProdi(Prodi $prodi, array $data): Prodi;

    /**
     * Delete an existing program of study.
     */
    public function deleteProdi(Prodi $prodi): bool;
}
