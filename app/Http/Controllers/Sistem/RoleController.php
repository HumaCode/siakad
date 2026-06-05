<?php

namespace App\Http\Controllers\Sistem;

use App\Http\Controllers\Controller;
use App\Http\Requests\Sistem\RoleIndexRequest;
use App\Http\Requests\Sistem\RoleStoreRequest;
use App\Http\Requests\Sistem\RoleUpdateRequest;
use App\Http\Resources\Sistem\RoleResource;
use App\Http\Resources\Sistem\PermissionResource;
use App\Http\Resources\Sistem\UserResource;
use App\Services\RoleService;
use App\Models\Role;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class RoleController extends Controller
{
    protected RoleService $roleService;

    /**
     * RoleController constructor.
     */
    public function __construct(RoleService $roleService)
    {
        $this->roleService = $roleService;
    }

    /**
     * Display a listing of roles and permissions.
     */
    public function index(RoleIndexRequest $request): Response
    {
        $search = $request->validated('search');
        $roleFilter = $request->validated('role');

        $data = $this->roleService->getRolesDashboardData($search, $roleFilter);

        // Transform collection of roles and permissions using Resources and resolve to raw arrays
        $roles = RoleResource::collection($data['roles'])->resolve();
        $permissions = PermissionResource::collection($data['permissions'])->resolve();

        // Transform paginated users while keeping paginator's root attributes
        $users = $data['users']->through(function ($user) {
            return new UserResource($user);
        });

        return Inertia::render('Sistem/Roles', [
            'roles' => $roles,
            'permissions' => $permissions,
            'users' => $users,
            'filters' => [
                'search' => $search,
                'role' => $roleFilter,
            ],
            'stats' => $data['stats'],
        ]);
    }

    /**
     * Store a newly created role.
     */
    public function store(RoleStoreRequest $request): RedirectResponse
    {
        $this->roleService->storeRole($request->validated());

        return redirect()->route('sistem.roles.index')
            ->with('success', 'Role baru berhasil disimpan');
    }

    /**
     * Update the specified role in storage.
     */
    public function update(RoleUpdateRequest $request, Role $role): RedirectResponse
    {
        if (!$role->exists) {
            $roleId = $request->route('role');
            $role = is_object($roleId) ? $roleId : Role::findOrFail($roleId);
        }

        $this->roleService->updateRole($role, $request->validated());

        return redirect()->route('sistem.roles.index')
            ->with('success', 'Perubahan role berhasil disimpan');
    }

    /**
     * Remove the specified role from storage.
     */
    public function destroy(Role $role): RedirectResponse
    {
        // Handle route model binding fallback for testing environments
        if (!$role->exists) {
            $roleId = request()->route('role');
            $role = is_object($roleId) ? $roleId : Role::findOrFail($roleId);
        }

        // Prevent deleting crucial roles (super_admin)
        if ($role->name === 'super_admin') {
            return redirect()->route('sistem.roles.index')
                ->with('error', 'Role super_admin tidak dapat dihapus');
        }

        $this->roleService->deleteRole($role);

        return redirect()->route('sistem.roles.index')
            ->with('success', 'Role berhasil dihapus');
    }
}
