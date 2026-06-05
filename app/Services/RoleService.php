<?php

namespace App\Services;

use App\Repositories\Interfaces\RoleRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class RoleService
{
    protected RoleRepositoryInterface $roleRepository;

    /**
     * RoleService constructor.
     */
    public function __construct(RoleRepositoryInterface $roleRepository)
    {
        $this->roleRepository = $roleRepository;
    }

    /**
     * Get all data needed for the Roles & Permissions dashboard index page.
     *
     * @param string|null $search
     * @param string|null $roleFilter
     * @param int $perPage
     * @return array
     */
    public function getRolesDashboardData(?string $search, ?string $roleFilter, int $perPage = 10): array
    {
        $roles = $this->roleRepository->getAllRolesWithPermissionsAndUserCount();
        $permissions = $this->roleRepository->getAllPermissions();
        $users = $this->roleRepository->getPaginatedUsers($search, $roleFilter, $perPage);

        $totalRoles = $roles->count();
        $totalPermissions = $permissions->count();
        $totalUsers = $this->roleRepository->getTotalUsersCount();
        $activeUsers = $this->roleRepository->getActiveUsersCount();
        $inactiveUsers = $totalUsers - $activeUsers;

        return [
            'roles' => $roles,
            'permissions' => $permissions,
            'users' => $users,
            'stats' => [
                'total_roles' => $totalRoles,
                'total_permissions' => $totalPermissions,
                'total_users' => $totalUsers,
                'active_users' => $activeUsers,
                'inactive_users' => $inactiveUsers,
            ],
        ];
    }

    /**
     * Store a new role.
     */
    public function storeRole(array $data): \App\Models\Role
    {
        return $this->roleRepository->createRole($data);
    }

    /**
     * Update an existing role.
     */
    public function updateRole($role, array $data): \App\Models\Role
    {
        return $this->roleRepository->updateRole($role, $data);
    }

    /**
     * Delete an existing role.
     */
    public function deleteRole($role): bool
    {
        return $this->roleRepository->deleteRole($role);
    }
}
