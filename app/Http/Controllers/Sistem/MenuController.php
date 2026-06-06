<?php

namespace App\Http\Controllers\Sistem;

use App\Http\Controllers\Controller;
use App\Http\Requests\Sistem\MenuIndexRequest;
use App\Http\Requests\Sistem\MenuStoreRequest;
use App\Http\Requests\Sistem\MenuUpdateRequest;
use App\Http\Resources\Sistem\MenuResource;
use App\Models\Konfigurasi\Menu;
use App\Models\Permission;
use App\Services\MenuService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MenuController extends Controller
{
    protected MenuService $menuService;

    public function __construct(MenuService $menuService)
    {
        $this->menuService = $menuService;
    }

    /**
     * Display a listing of the menus.
     */
    public function index(MenuIndexRequest $request): Response
    {
        $search = $request->validated('search');

        $data = $this->menuService->getPaginatedMenus($search, 15);

        // Transform paginated menus using Resource
        $menus = $data['menus']->through(function ($menu) {
            return (new MenuResource($menu))->resolve();
        });

        // Get all parent menus for the dropdown
        $parentMenus = $this->menuService->getParentMenus()->map(function ($menu) {
            return [
                'id' => $menu->id,
                'name' => $menu->name,
            ];
        });

        // Get all permissions for selecting required permissions
        $permissions = Permission::orderBy('name')->get()->map(function ($perm) {
            return [
                'id' => $perm->id,
                'name' => $perm->name,
            ];
        });

        return Inertia::render('Sistem/Menus', [
            'menus' => $menus,
            'filters' => [
                'search' => $search,
            ],
            'stats' => $data['stats'],
            'parentMenus' => $parentMenus,
            'permissionsList' => $permissions,
        ]);
    }

    /**
     * Store a newly created menu.
     */
    public function store(MenuStoreRequest $request): RedirectResponse
    {
        $this->menuService->storeMenu($request->validated());

        return redirect()->route('sistem.menu.index')
            ->with('success', 'Menu baru berhasil disimpan');
    }

    /**
     * Update the specified menu in storage.
     */
    public function update(MenuUpdateRequest $request, Menu $menu): RedirectResponse
    {
        if (!$menu->exists) {
            $menuId = $request->route('menu');
            $menu = is_object($menuId) ? $menuId : Menu::findOrFail($menuId);
        }

        $this->menuService->updateMenu($menu, $request->validated());

        return redirect()->route('sistem.menu.index')
            ->with('success', 'Perubahan menu berhasil disimpan');
    }

    /**
     * Remove the specified menu from storage.
     */
    public function destroy(Menu $menu): RedirectResponse
    {
        if (!$menu->exists) {
            $menuId = request()->route('menu');
            $menu = is_object($menuId) ? $menuId : Menu::findOrFail($menuId);
        }

        $this->menuService->deleteMenu($menu);

        return redirect()->route('sistem.menu.index')
            ->with('success', 'Menu berhasil dihapus');
    }
}
