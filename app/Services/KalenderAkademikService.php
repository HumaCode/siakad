<?php

namespace App\Services;

use App\Models\KalenderAkademik;
use App\Repositories\Interfaces\KalenderAkademikRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class KalenderAkademikService
{
    protected KalenderAkademikRepositoryInterface $kalenderRepository;

    public function __construct(KalenderAkademikRepositoryInterface $kalenderRepository)
    {
        $this->kalenderRepository = $kalenderRepository;
    }

    public function getByTahun(string $tahun): Collection
    {
        $dbData = $this->kalenderRepository->getByTahun($tahun);
        
        $holidays = Cache::remember("national_holidays_id_{$tahun}", 604800, function () use ($tahun) {
            try {
                $response = Http::get("https://date.nager.at/api/v3/PublicHolidays/{$tahun}/ID");
                if ($response->successful()) {
                    return $response->json();
                }
            } catch (\Exception $e) {
                // Ignore API failure
            }
            return [];
        });

        foreach ($holidays as $h) {
            $holidayModel = new KalenderAkademik([
                'tahun' => $tahun,
                'kategori' => 'agenda',
                'jenis' => 'libur',
                'judul' => $h['localName'],
                'deskripsi' => $h['name'],
                'warna' => '#f59e0b',
                'ikon' => 'bi-star-fill',
            ]);
            $holidayModel->id = (string) \Illuminate\Support\Str::ulid();
            $holidayModel->tanggal_mulai = \Carbon\Carbon::parse($h['date']);
            
            $dbData->push($holidayModel);
        }

        return $dbData->sortBy('tanggal_mulai')->values();
    }

    public function createKalender(array $data): KalenderAkademik
    {
        return $this->kalenderRepository->createKalender($data);
    }

    public function updateKalender(KalenderAkademik $kalender, array $data): KalenderAkademik
    {
        return $this->kalenderRepository->updateKalender($kalender, $data);
    }

    public function deleteKalender(KalenderAkademik $kalender): bool
    {
        return $this->kalenderRepository->deleteKalender($kalender);
    }
}
