<?php

namespace App\Repositories;

use App\Models\Fakultas;
use App\Repositories\Interfaces\FakultasRepositoryInterface;
use Illuminate\Support\Collection;

class FakultasRepository implements FakultasRepositoryInterface
{
    /**
     * Get all faculties ordered by name.
     */
    public function getAllFakultas(): Collection
    {
        return Fakultas::orderBy('nama')->get();
    }

    /**
     * Get all faculties with their program studies count.
     */
    public function getFakultasWithProdisCount(): Collection
    {
        return Fakultas::withCount('prodis')->orderBy('nama')->get();
    }

    /**
     * Create a new faculty.
     */
    public function createFakultas(array $data): Fakultas
    {
        return Fakultas::create([
            'kode' => $data['kode'],
            'nama' => $data['nama'],
            'dekan' => $data['dekan'] ?? null,
        ]);
    }

    /**
     * Update an existing faculty.
     */
    public function updateFakultas(Fakultas $fakultas, array $data): Fakultas
    {
        $fakultas->update([
            'kode' => $data['kode'],
            'nama' => $data['nama'],
            'dekan' => $data['dekan'] ?? null,
        ]);

        return $fakultas;
    }

    /**
     * Delete an existing faculty.
     */
    public function deleteFakultas(Fakultas $fakultas): bool
    {
        return $fakultas->delete();
    }
}
