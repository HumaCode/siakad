<?php

namespace App\Repositories\Interfaces;

use App\Models\MataKuliah;
use Illuminate\Support\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface MataKuliahRepositoryInterface
{
    /**
     * Get all courses.
     */
    public function getAllMataKuliahs(): Collection;

    /**
     * Get paginated courses with filters.
     */
    public function getPaginatedMataKuliahs(?string $search, ?string $prodi, ?string $semester, ?string $jenis, int $perPage = 10): LengthAwarePaginator;

    /**
     * Store a new course.
     */
    public function createMataKuliah(array $data): MataKuliah;

    /**
     * Update an existing course.
     */
    public function updateMataKuliah(MataKuliah $mataKuliah, array $data): MataKuliah;

    /**
     * Delete an existing course.
     */
    public function deleteMataKuliah(MataKuliah $mataKuliah): bool;
}
