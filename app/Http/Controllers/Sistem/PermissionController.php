<?php

namespace App\Http\Controllers\Sistem;

use App\Http\Controllers\Controller;
use App\Http\Requests\Sistem\PermissionIndexRequest;
use App\Http\Requests\Sistem\PermissionStoreRequest;
use App\Http\Requests\Sistem\PermissionUpdateRequest;
use App\Http\Resources\Sistem\PermissionResource;
use App\Services\PermissionService;
use App\Models\Permission;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class PermissionController extends Controller
{
    protected PermissionService $permissionService;

    public function __construct(PermissionService $permissionService)
    {
        $this->permissionService = $permissionService;
    }

    /**
     * Display a listing of permissions.
     */
    public function index(PermissionIndexRequest $request): Response
    {
        $search = $request->validated('search');

        $data = $this->permissionService->getPaginatedPermissions($search, 15);

        // Transform collection using Resource while keeping paginator structure
        $permissions = $data['permissions']->through(function ($perm) {
            return (new PermissionResource($perm))->resolve();
        });

        return Inertia::render('Sistem/Permissions', [
            'permissions' => $permissions,
            'filters' => [
                'search' => $search,
            ],
            'stats' => $data['stats'],
        ]);
    }

    /**
     * Store a newly created permission.
     */
    public function store(PermissionStoreRequest $request): RedirectResponse
    {
        $this->permissionService->storePermission($request->validated());

        return redirect()->route('sistem.permissions.index')
            ->with('success', 'Permission baru berhasil disimpan');
    }

    /**
     * Update the specified permission in storage.
     */
    public function update(PermissionUpdateRequest $request, Permission $permission): RedirectResponse
    {
        if (!$permission->exists) {
            $permissionId = $request->route('permission');
            $permission = is_object($permissionId) ? $permissionId : Permission::findOrFail($permissionId);
        }

        $this->permissionService->updatePermission($permission, $request->validated());

        return redirect()->route('sistem.permissions.index')
            ->with('success', 'Perubahan permission berhasil disimpan');
    }

    /**
     * Remove the specified permission from storage.
     */
    public function destroy(Permission $permission): RedirectResponse
    {
        if (!$permission->exists) {
            $permissionId = request()->route('permission');
            $permission = is_object($permissionId) ? $permissionId : Permission::findOrFail($permissionId);
        }

        $this->permissionService->deletePermission($permission);

        return redirect()->route('sistem.permissions.index')
            ->with('success', 'Permission berhasil dihapus');
    }
}
