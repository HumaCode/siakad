<?php

namespace App\Repositories;

use App\Models\Role;
use App\Models\Permission;
use App\Models\User;
use App\Repositories\Interfaces\RoleRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class RoleRepository implements RoleRepositoryInterface
{
    /**
     * Get all roles with their permissions loaded and count of users.
     */
    public function getAllRolesWithPermissionsAndUserCount(): Collection
    {
        return Role::with('permissions')
            ->withCount('users')
            ->orderBy('priority')
            ->get();
    }

    /**
     * Get all permissions.
     */
    public function getAllPermissions(): Collection
    {
        return Permission::all();
    }

    /**
     * Get paginated users filtered by search query and role.
     */
    public function getPaginatedUsers(?string $search, ?string $roleFilter, int $perPage = 10): LengthAwarePaginator
    {
        $query = User::with(['roles', 'mahasiswa', 'dosen']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhereHas('mahasiswa', function ($sub) use ($search) {
                        $sub->where('nim', 'like', "%{$search}%");
                    })
                    ->orWhereHas('dosen', function ($sub) use ($search) {
                        $sub->where('nidn', 'like', "%{$search}%");
                    });
            });
        }

        if ($roleFilter) {
            $query->whereHas('roles', function ($q) use ($roleFilter) {
                $q->where('name', $roleFilter);
            });
        }

        return $query->paginate($perPage)->withQueryString();
    }

    /**
     * Get the total count of users in the system.
     */
    public function getTotalUsersCount(): int
    {
        return User::count();
    }

    /**
     * Get the count of active users in the system.
     */
    public function getActiveUsersCount(): int
    {
        return User::where(function ($query) {
            $query->whereHas('mahasiswa', function ($q) {
                $q->where('status_akademik', 'aktif');
            })
            ->orWhereHas('dosen', function ($q) {
                $q->where('status_dosen', 'tetap');
            })
            ->orWhereDoesntHave('mahasiswa')
            ->whereDoesntHave('dosen');
        })->count();
    }
}
