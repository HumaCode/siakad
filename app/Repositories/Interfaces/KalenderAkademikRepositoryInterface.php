<?php

namespace App\Repositories\Interfaces;

use App\Models\KalenderAkademik;
use Illuminate\Support\Collection;

interface KalenderAkademikRepositoryInterface
{
    /**
     * Get kalender akademik by tahun
     */
    public function getByTahun(string $tahun): Collection;

    /**
     * Store new kalender
     */
    public function createKalender(array $data): KalenderAkademik;

    /**
     * Update existing kalender
     */
    public function updateKalender(KalenderAkademik $kalender, array $data): KalenderAkademik;

    /**
     * Delete kalender
     */
    public function deleteKalender(KalenderAkademik $kalender): bool;
}
