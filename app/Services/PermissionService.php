<?php

namespace App\Services;

use App\Models\Permission;
use Illuminate\Pagination\LengthAwarePaginator;

class PermissionService
{
    /**
     * Get paginated permissions with search and stats.
     */
    public function getPaginatedPermissions(?string $search, int $perPage = 15): array
    {
        $query = Permission::withCount('roles');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('guard_name', 'like', "%{$search}%");
            });
        }

        $permissions = $query->orderBy('name')->paginate($perPage)->withQueryString();

        $totalPermissions = Permission::count();
        $activePermissions = Permission::where('is_active', true)->count();
        $inactivePermissions = $totalPermissions - $activePermissions;

        return [
            'permissions' => $permissions,
            'stats' => [
                'total_permissions' => $totalPermissions,
                'active_permissions' => $activePermissions,
                'inactive_permissions' => $inactivePermissions,
            ]
        ];
    }

    /**
     * Store a new permission.
     */
    public function storePermission(array $data): Permission
    {
        return Permission::create([
            'name' => $data['name'],
            'guard_name' => $data['guard_name'] ?? 'web',
            'is_active' => (bool) ($data['is_active'] ?? true),
        ]);
    }

    /**
     * Update an existing permission.
     */
    public function updatePermission(Permission $permission, array $data): Permission
    {
        $permission->update([
            'name' => $data['name'],
            'guard_name' => $data['guard_name'] ?? 'web',
            'is_active' => (bool) ($data['is_active'] ?? true),
        ]);

        return $permission;
    }

    /**
     * Delete a permission.
     */
    public function deletePermission(Permission $permission): bool
    {
        // Detach from roles (Spatie permission handles roles via belongsToMany)
        $permission->roles()->detach();
        return (bool) $permission->delete();
    }
}
