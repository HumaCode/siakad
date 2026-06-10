<?php

namespace App\Services;

use App\Models\Dosen;
use App\Models\User;
use App\Repositories\Interfaces\DosenRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Collection;

class DosenService
{
    protected DosenRepositoryInterface $dosenRepository;

    public function __construct(DosenRepositoryInterface $dosenRepository)
    {
        $this->dosenRepository = $dosenRepository;
    }

    public function getAll(): Collection
    {
        return $this->dosenRepository->all();
    }

    public function getPaginated(int $perPage = 15): LengthAwarePaginator
    {
        return $this->dosenRepository->paginate($perPage);
    }

    public function createDosen(array $data): Dosen
    {
        return DB::transaction(function () use ($data) {
            // Create user account for dosen
            $user = User::create([
                'name' => $data['nama'],
                'email' => $data['email'] ?? (strtolower(str_replace(' ', '.', $data['nama'])) . '@siakad.ac.id'),
                'password' => Hash::make($data['password'] ?? $data['nidn']),
            ]);

            $user->assignRole('dosen');

            $dosenData = [
                'user_id' => $user->id,
                'nidn' => $data['nidn'],
                'nama' => $data['nama'],
                'gelar_depan' => $data['gelar_depan'] ?? null,
                'gelar_belakang' => $data['gelar_belakang'] ?? null,
                'prodi_id' => $data['prodi_id'],
                'status_dosen' => $data['status_dosen'] ?? 'tetap',
                'jabatan' => $data['jabatan'] ?? 'Tenaga Pengajar',
            ];

            return $this->dosenRepository->create($dosenData);
        });
    }

    public function updateDosen(string $id, array $data): Dosen
    {
        return DB::transaction(function () use ($id, $data) {
            $dosen = $this->dosenRepository->find($id);
            if (!$dosen) {
                abort(404, 'Dosen not found');
            }

            $user = $dosen->user;
            if ($user) {
                $userUpdate = [];
                if (isset($data['nama'])) {
                    $userUpdate['name'] = $data['nama'];
                }
                if (isset($data['email'])) {
                    $userUpdate['email'] = $data['email'];
                }
                if (isset($data['password']) && !empty($data['password'])) {
                    $userUpdate['password'] = Hash::make($data['password']);
                }
                if (!empty($userUpdate)) {
                    $user->update($userUpdate);
                }
            }

            $dosenData = array_intersect_key($data, array_flip([
                'nidn', 'nama', 'gelar_depan', 'gelar_belakang', 'prodi_id', 'status_dosen', 'jabatan'
            ]));

            return $this->dosenRepository->update($id, $dosenData);
        });
    }

    public function deleteDosen(string $id): bool
    {
        return DB::transaction(function () use ($id) {
            $dosen = $this->dosenRepository->find($id);
            if (!$dosen) {
                abort(404, 'Dosen not found');
            }

            return $this->dosenRepository->delete($id);
        });
    }
}
