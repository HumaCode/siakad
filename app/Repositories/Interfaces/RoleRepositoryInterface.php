<?php

namespace App\Repositories\Interfaces;

use Illuminate\Support\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface RoleRepositoryInterface
{
    /**
     * Get all roles with their permissions loaded and count of users.
     */
    public function getAllRolesWithPermissionsAndUserCount(): Collection;

    /**
     * Get all permissions.
     */
    public function getAllPermissions(): Collection;

    /**
     * Get paginated users filtered by search query and role.
     */
    public function getPaginatedUsers(?string $search, ?string $roleFilter, int $perPage = 10): LengthAwarePaginator;

    /**
     * Get the total count of users in the system.
     */
    public function getTotalUsersCount(): int;

    /**
     * Get the count of active users in the system.
     */
    public function getActiveUsersCount(): int;

    /**
     * Create a new role with given attributes and sync permissions.
     */
    public function createRole(array $data): \App\Models\Role;

    /**
     * Update an existing role.
     */
    public function updateRole($role, array $data): \App\Models\Role;

    /**
     * Delete an existing role.
     */
    public function deleteRole($role): bool;
}
