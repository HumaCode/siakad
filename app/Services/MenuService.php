<?php

namespace App\Services;

use App\Models\Konfigurasi\Menu;
use Illuminate\Pagination\LengthAwarePaginator;

class MenuService
{
    /**
     * Get paginated menus with parent relationship, permissions, and statistics.
     */
    public function getPaginatedMenus(?string $search, int $perPage = 15): array
    {
        $query = Menu::with(['mainMenu', 'permissions'])->withCount('subMenus');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('url', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%");
            });
        }

        $menus = $query->orderBy('main_menu_id', 'asc') // show parent menus near each other
                       ->orderBy('orders', 'asc')
                       ->paginate($perPage)
                       ->withQueryString();

        $totalMenus = Menu::count();
        $parentMenusCount = Menu::whereNull('main_menu_id')->count();
        $subMenusCount = Menu::whereNotNull('main_menu_id')->count();
        $activeMenus = Menu::where('active', true)->count();

        return [
            'menus' => $menus,
            'stats' => [
                'total_menus' => $totalMenus,
                'parent_menus' => $parentMenusCount,
                'sub_menus' => $subMenusCount,
                'active_menus' => $activeMenus,
            ]
        ];
    }

    /**
     * Get all parent menus (for the parent menu selection dropdown).
     */
    public function getParentMenus()
    {
        return Menu::whereNull('main_menu_id')->orderBy('orders')->get();
    }

    /**
     * Store a new menu.
     */
    public function storeMenu(array $data): Menu
    {
        $menu = Menu::create([
            'name' => $data['name'],
            'url' => $data['url'],
            'category' => $data['category'] ?? null,
            'icon' => $data['icon'] ?? null,
            'active' => (bool) ($data['active'] ?? true),
            'orders' => (int) ($data['orders'] ?? 0),
            'main_menu_id' => $data['main_menu_id'] ?? null,
        ]);

        if (isset($data['permissions'])) {
            $menu->permissions()->sync($data['permissions']);
        }

        if (function_exists('clearMenuCache')) {
            clearMenuCache();
        }

        return $menu;
    }

    /**
     * Update an existing menu.
     */
    public function updateMenu(Menu $menu, array $data): Menu
    {
        $menu->update([
            'name' => $data['name'],
            'url' => $data['url'],
            'category' => $data['category'] ?? null,
            'icon' => $data['icon'] ?? null,
            'active' => (bool) ($data['active'] ?? true),
            'orders' => (int) ($data['orders'] ?? 0),
            'main_menu_id' => $data['main_menu_id'] ?? null,
        ]);

        if (isset($data['permissions'])) {
            $menu->permissions()->sync($data['permissions']);
        } else {
            $menu->permissions()->detach();
        }

        if (function_exists('clearMenuCache')) {
            clearMenuCache();
        }

        return $menu;
    }

    /**
     * Delete a menu.
     */
    public function deleteMenu(Menu $menu): bool
    {
        $menu->permissions()->detach();
        $deleted = (bool) $menu->delete();

        if (function_exists('clearMenuCache')) {
            clearMenuCache();
        }

        return $deleted;
    }
}
