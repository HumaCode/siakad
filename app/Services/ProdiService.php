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
     * Store a new program of study.
     */
    public function storeProdi(array $data): Prodi
    {
        return $this->prodiRepository->createProdi($data);
    }
}
