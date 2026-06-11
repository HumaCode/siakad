<?php

namespace App\Services;

use App\Models\Fakultas;
use App\Repositories\Interfaces\FakultasRepositoryInterface;
use Illuminate\Support\Collection;

class FakultasService
{
    protected FakultasRepositoryInterface $fakultasRepository;

    /**
     * FakultasService constructor.
     */
    public function __construct(FakultasRepositoryInterface $fakultasRepository)
    {
        $this->fakultasRepository = $fakultasRepository;
    }

    /**
     * Get all faculties.
     */
    public function getAllFakultas(): Collection
    {
        return $this->fakultasRepository->getAllFakultas();
    }

    /**
     * Get all faculties with their program studies count.
     */
    public function getFakultasWithProdisCount(): Collection
    {
        return $this->fakultasRepository->getFakultasWithProdisCount();
    }

    /**
     * Store a new faculty.
     */
    public function storeFakultas(array $data): Fakultas
    {
        return $this->fakultasRepository->createFakultas($data);
    }

    /**
     * Update an existing faculty.
     */
    public function updateFakultas(Fakultas $fakultas, array $data): Fakultas
    {
        return $this->fakultasRepository->updateFakultas($fakultas, $data);
    }

    /**
     * Delete an existing faculty.
     */
    public function deleteFakultas(Fakultas $fakultas): bool
    {
        return $this->fakultasRepository->deleteFakultas($fakultas);
    }
}
