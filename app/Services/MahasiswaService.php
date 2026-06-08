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

    public function createMahasiswa(array $data): Mahasiswa
    {
        return DB::transaction(function () use ($data) {
            // Create user account for mahasiswa
            $user = User::create([
                'name' => $data['nama'],
                'email' => strtolower(str_replace(' ', '.', $data['nama'])) . '@student.siakad.ac.id', // Generate email
                'password' => Hash::make($data['nim']), // Password defaults to NIM
            ]);

            $user->assignRole('mahasiswa');

            $data['user_id'] = $user->id;

            return $this->mahasiswaRepository->create($data);
        });
    }

    public function updateMahasiswa(string $id, array $data): Mahasiswa
    {
        return DB::transaction(function () use ($id, $data) {
            $mahasiswa = $this->mahasiswaRepository->find($id);
            
            if ($mahasiswa && $mahasiswa->user) {
                // Also update user name if nama changes
                if (isset($data['nama'])) {
                    $mahasiswa->user->update(['name' => $data['nama']]);
                }
            }

            return $this->mahasiswaRepository->update($id, $data);
        });
    }

    public function deleteMahasiswa(string $id): bool
    {
        return DB::transaction(function () use ($id) {
            $mahasiswa = $this->mahasiswaRepository->find($id);
            if ($mahasiswa && $mahasiswa->user) {
                $mahasiswa->user->delete(); // Soft delete user
            }
            return $this->mahasiswaRepository->delete($id);
        });
    }

    public function getAngkatanList(): array
    {
        return Mahasiswa::select('angkatan')
            ->distinct()
            ->orderBy('angkatan', 'desc')
            ->pluck('angkatan')
            ->toArray();
    }
}
