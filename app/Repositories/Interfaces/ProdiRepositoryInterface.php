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
     * Store a new program of study.
     */
    public function createProdi(array $data): Prodi;

    /**
     * Update an existing program of study.
     */
    public function updateProdi(Prodi $prodi, array $data): Prodi;
}
