<?php

namespace App\Http\Controllers\Sistem;

use App\Http\Controllers\Controller;
use App\Http\Requests\Sistem\RoleIndexRequest;
use App\Http\Resources\Sistem\RoleResource;
use App\Http\Resources\Sistem\PermissionResource;
use App\Http\Resources\Sistem\UserResource;
use App\Services\RoleService;
use Inertia\Inertia;
use Inertia\Response;

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
}
