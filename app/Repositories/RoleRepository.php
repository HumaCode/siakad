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

    /**
     * Create a new role with given attributes and sync permissions.
     */
    public function createRole(array $data): Role
    {
        $role = Role::create([
            'name' => $data['name'],
            'slug' => $data['slug'],
            'type_role' => $data['type_role'] ?? null,
            'color' => $data['color'] ?? null,
            'priority' => $data['priority'] ?? 0,
            'is_active' => (bool) ($data['is_active'] ?? true),
            'description' => $data['description'] ?? null,
            'guard_name' => $data['guard_name'] ?? 'web',
        ]);

        $role->syncPermissions($data['permissions'] ?? []);

        return $role;
    }

    /**
     * Update an existing role.
     */
    public function updateRole($role, array $data): Role
    {
        if (!$role instanceof Role) {
            $role = Role::findOrFail($role);
        }

        // Get current permissions (cast to integer to prevent comparison mismatches)
        $oldPermissions = array_map('intval', $role->permissions()->pluck('id')->toArray());
        $newPermissions = array_map('intval', $data['permissions'] ?? []);

        $role->update([
            'name' => $data['name'],
            'slug' => $data['slug'],
            'type_role' => $data['type_role'] ?? null,
            'color' => $data['color'] ?? null,
            'priority' => $data['priority'] ?? 0,
            'is_active' => (bool) ($data['is_active'] ?? true),
            'description' => $data['description'] ?? null,
            'guard_name' => $data['guard_name'] ?? 'web',
        ]);

        $role->syncPermissions($data['permissions'] ?? []);

        // Sort both arrays to compare their values regardless of order
        sort($oldPermissions);
        sort($newPermissions);

        // If the permissions list actually changed, clear the menu cache
        if ($oldPermissions !== $newPermissions) {
            if (function_exists('clearMenuCache')) {
                clearMenuCache();
            }
        }

        return $role;
    }

    /**
     * Delete an existing role.
     */
    public function deleteRole($role): bool
    {
        if (!$role instanceof Role) {
            $role = Role::findOrFail($role);
        }

        // Detach all permissions before deleting to prevent database integrity constraint errors
        $role->syncPermissions([]);

        return (bool) $role->delete();
    }
}
