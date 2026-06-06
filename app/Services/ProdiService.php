<?php

namespace App\Services;

use App\Models\Prodi;
use App\Repositories\Interfaces\ProdiRepositoryInterface;
use Illuminate\Support\Collection;

class ProdiService
{
    protected ProdiRepositoryInterface $prodiRepository;

    /**
     * ProdiService constructor.
     */
    public function __construct(ProdiRepositoryInterface $prodiRepository)
    {
        $this->prodiRepository = $prodiRepository;
    }

    /**
     * Get all program of studies.
     */
    public function getAllProdis(): Collection
    {
        return $this->prodiRepository->getAllProdis();
    }

    /**
     * Get paginated program of studies with filters.
     */
    public function getPaginatedProdis(?string $search, ?string $fakultas, ?string $tahun, int $perPage = 6): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        return $this->prodiRepository->getPaginatedProdis($search, $fakultas, $tahun, $perPage);
    }

    /**
     * Store a new program of study.
     */
    public function storeProdi(array $data): Prodi
    {
        return $this->prodiRepository->createProdi($data);
    }

    /**
     * Update an existing program of study.
     */
    public function updateProdi(Prodi $prodi, array $data): Prodi
    {
        return $this->prodiRepository->updateProdi($prodi, $data);
    }

    /**
     * Delete an existing program of study.
     */
    public function deleteProdi(Prodi $prodi): bool
    {
        return $this->prodiRepository->deleteProdi($prodi);
    }
}
