<?php

namespace App\Services;

use App\Models\MataKuliah;
use App\Repositories\Interfaces\MataKuliahRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class MataKuliahService
{
    protected MataKuliahRepositoryInterface $mataKuliahRepository;

    /**
     * MataKuliahService constructor.
     */
    public function __construct(MataKuliahRepositoryInterface $mataKuliahRepository)
    {
        $this->mataKuliahRepository = $mataKuliahRepository;
    }

    /**
     * Get all courses.
     */
    public function getAllMataKuliahs(): Collection
    {
        return $this->mataKuliahRepository->getAllMataKuliahs();
    }

    /**
     * Get paginated courses with filters.
     */
    public function getPaginatedMataKuliahs(?string $search, ?string $prodi, ?string $semester, ?string $jenis, int $perPage = 10): LengthAwarePaginator
    {
        return $this->mataKuliahRepository->getPaginatedMataKuliahs($search, $prodi, $semester, $jenis, $perPage);
    }

    /**
     * Store a new course.
     */
    public function storeMataKuliah(array $data): MataKuliah
    {
        return $this->mataKuliahRepository->createMataKuliah($data);
    }

    /**
     * Update an existing course.
     */
    public function updateMataKuliah(MataKuliah $mataKuliah, array $data): MataKuliah
    {
        return $this->mataKuliahRepository->updateMataKuliah($mataKuliah, $data);
    }

    /**
     * Delete an existing course.
     */
    public function deleteMataKuliah(MataKuliah $mataKuliah): bool
    {
        return $this->mataKuliahRepository->deleteMataKuliah($mataKuliah);
    }
}
