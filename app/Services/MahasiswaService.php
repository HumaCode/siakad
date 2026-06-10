<?php

namespace App\Services;

use App\Models\Mahasiswa;
use App\Models\User;
use App\Repositories\Interfaces\MahasiswaRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class MahasiswaService
{
    protected MahasiswaRepositoryInterface $mahasiswaRepository;

    public function __construct(MahasiswaRepositoryInterface $mahasiswaRepository)
    {
        $this->mahasiswaRepository = $mahasiswaRepository;
    }

    public function getPaginated(int $perPage = 15, ?string $search = null, ?string $prodiId = null, ?string $angkatan = null, ?string $status = null): LengthAwarePaginator
    {
        return $this->mahasiswaRepository->paginate($perPage, $search, $prodiId, $angkatan, $status);
    }

    private function normalizeData(array $data): array
    {
        if (isset($data['status_akademik'])) {
            $statusMap = [
                'Aktif' => 'aktif',
                'Cuti' => 'cuti',
                'Lulus' => 'lulus',
                'Drop Out' => 'do',
                'Non-Aktif' => 'non-aktif',
            ];
            $data['status_akademik'] = $statusMap[$data['status_akademik']] ?? strtolower($data['status_akademik']);
        }
        return $data;
    }

    public function createMahasiswa(array $data): Mahasiswa
    {
        $data = $this->normalizeData($data);
        return DB::transaction(function () use ($data) {
            // Create user account for mahasiswa
            $user = User::create([
                'name' => $data['nama'],
                'email' => $data['email_akademik'] ?? (strtolower(str_replace(' ', '.', $data['nama'])) . '@student.siakad.ac.id'), // Generate email if empty
                'password' => Hash::make($data['password_awal'] ?? $data['nim']), // Password defaults to NIM or custom password
            ]);

            $user->assignRole('mahasiswa');

            $data['user_id'] = $user->id;

            $mahasiswa = $this->mahasiswaRepository->create($data);

            if (isset($data['foto']) && $data['foto'] instanceof \Illuminate\Http\UploadedFile) {
                $mahasiswa->addMedia($data['foto'])->toMediaCollection('foto');
            }

            if (isset($data['ktp']) && $data['ktp'] instanceof \Illuminate\Http\UploadedFile) {
                $mahasiswa->addMedia($data['ktp'])->toMediaCollection('ktp', 'local');
            }

            if (isset($data['kk']) && $data['kk'] instanceof \Illuminate\Http\UploadedFile) {
                $mahasiswa->addMedia($data['kk'])->toMediaCollection('kk', 'local');
            }

            return $mahasiswa;
        });
    }

    public function updateMahasiswa(string $id, array $data): Mahasiswa
    {
        $data = $this->normalizeData($data);
        return DB::transaction(function () use ($id, $data) {
            $mahasiswa = $this->mahasiswaRepository->find($id);
            
            if ($mahasiswa && $mahasiswa->user) {
                $userUpdates = [];
                if (isset($data['nama'])) {
                    $userUpdates['name'] = $data['nama'];
                }
                if (isset($data['email_akademik'])) {
                    $userUpdates['email'] = $data['email_akademik'];
                }
                if (!empty($data['password_awal'])) {
                    $userUpdates['password'] = Hash::make($data['password_awal']);
                }

                if (!empty($userUpdates)) {
                    $mahasiswa->user->update($userUpdates);
                }
            }

            $updatedMahasiswa = $this->mahasiswaRepository->update($id, $data);

            if (isset($data['foto']) && $data['foto'] instanceof \Illuminate\Http\UploadedFile) {
                $updatedMahasiswa->clearMediaCollection('foto');
                $updatedMahasiswa->addMedia($data['foto'])->toMediaCollection('foto');
            }

            if (isset($data['ktp']) && $data['ktp'] instanceof \Illuminate\Http\UploadedFile) {
                $updatedMahasiswa->clearMediaCollection('ktp');
                $updatedMahasiswa->addMedia($data['ktp'])->toMediaCollection('ktp', 'local');
            }

            if (isset($data['kk']) && $data['kk'] instanceof \Illuminate\Http\UploadedFile) {
                $updatedMahasiswa->clearMediaCollection('kk');
                $updatedMahasiswa->addMedia($data['kk'])->toMediaCollection('kk', 'local');
            }

            return $updatedMahasiswa;
        });
    }

    public function deleteMahasiswa(string $id): bool
    {
        return DB::transaction(function () use ($id) {
            $mahasiswa = $this->mahasiswaRepository->find($id);
            if (!$mahasiswa) {
                return false;
            }

            $user = $mahasiswa->user;

            // Delete mahasiswa first to avoid Cascade Delete causing ModelNotFoundException in repository delete
            $deleted = $this->mahasiswaRepository->delete($id);

            // Then delete user if exists
            if ($user) {
                $user->delete();
            }

            return $deleted;
        });
    }

    public function getAngkatanList(): array
    {
        $currentYear = (int) date('Y');
        // Generate a range of years from current year down to 6 years ago (e.g. 2026 down to 2020)
        $years = range($currentYear, $currentYear - 6);
        
        // Merge with existing angkatan values from database to ensure no data is lost
        $dbYears = Mahasiswa::select('angkatan')
            ->distinct()
            ->pluck('angkatan')
            ->map(fn($y) => (int)$y)
            ->toArray();
            
        $mergedYears = array_unique(array_merge($years, $dbYears));
        rsort($mergedYears);
        
        return array_map('strval', $mergedYears);
    }
}
