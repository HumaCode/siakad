<?php

namespace App\Repositories\Interfaces;

use App\Models\Fakultas;
use Illuminate\Support\Collection;

interface FakultasRepositoryInterface
{
    /**
     * Get all faculties ordered by name.
     */
    public function getAllFakultas(): Collection;

    /**
     * Get all faculties with their program studies count.
     */
    public function getFakultasWithProdisCount(): Collection;

    /**
     * Create a new faculty.
     */
    public function createFakultas(array $data): Fakultas;

    /**
     * Update an existing faculty.
     */
    public function updateFakultas(Fakultas $fakultas, array $data): Fakultas;

    /**
     * Delete an existing faculty.
     */
    public function deleteFakultas(Fakultas $fakultas): bool;
}
