<?php

namespace App\Repositories;

use App\Models\KalenderAkademik;
use App\Repositories\Interfaces\KalenderAkademikRepositoryInterface;
use Illuminate\Support\Collection;

class KalenderAkademikRepository implements KalenderAkademikRepositoryInterface
{
    public function getByTahun(string $tahun): Collection
    {
        return KalenderAkademik::where('tahun', $tahun)
            ->orderBy('tanggal_mulai')
            ->get();
    }

    public function createKalender(array $data): KalenderAkademik
    {
        return KalenderAkademik::create($data);
    }

    public function updateKalender(KalenderAkademik $kalender, array $data): KalenderAkademik
    {
        $kalender->update($data);
        return $kalender;
    }

    public function deleteKalender(KalenderAkademik $kalender): bool
    {
        return $kalender->delete();
    }
}
