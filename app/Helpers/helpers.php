<?php

use App\Models\Konfigurasi\Menu;
use App\Repositories\MenuRepository;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Collection;

if (!function_exists('filterKata')) {
    /**
     * Filter string (returns string as is to match the exact DB permissions).
     *
     * @param string $str
     * @return string
     */
    function filterKata($str)
    {
        return $str;
    }
}

if (!function_exists('menus')) {
    /**
     * Get active menus grouped by category, filtered by gate permissions.
     *
     * @return array
     */
    function menus()
    {
        $userId = auth()->id();
        $version = Cache::rememberForever('menu_cache_version', function () {
            return time();
        });
        $key = "menus_raw_{$userId}_{$version}";

        if (!Cache::has($key)) {
            $menus = (new MenuRepository())->getMenus();

            // Filter berdasarkan gate dan convert ke raw array
            $filtered = [];
            foreach ($menus as $menu) {
                if (Gate::allows('read ' . filterKata($menu->url))) {
                    $item = [
                        'id' => $menu->id,
                        'name' => $menu->name,
                        'url' => $menu->url,
                        'category' => $menu->category,
                        'icon' => $menu->icon,
                        'sub_menus' => []
                    ];

                    foreach ($menu->subMenus as $subMenu) {
                        if (Gate::allows('read ' . filterKata($subMenu->url))) {
                            $item['sub_menus'][] = [
                                'id' => $subMenu->id,
                                'name' => $subMenu->name,
                                'url' => $subMenu->url,
                                'icon' => $subMenu->icon,
                            ];
                        }
                    }

                    // Group by category manually
                    $category = $menu->category ?? 'General';
                    $filtered[$category][] = $item;
                }
            }

            Cache::put($key, $filtered, now()->addHours(1));
        }

        return Cache::get($key) ?? [];
    }
}

if (!function_exists('urlMenu')) {
    /**
     * Get all URLs of the allowed menus and their submenus.
     *
     * @return array
     */
    function urlMenu()
    {
        $userId = auth()->id() ?? 'guest';
        $key = "url_menu_{$userId}";

        if (!Cache::has($key)) {
            $menus = menus();

            $url = [];
            foreach ($menus as $category => $items) {
                foreach ($items as $mm) {
                    $url[] = $mm['url'];
                    foreach ($mm['sub_menus'] as $sm) {
                        $url[] = $sm['url'];
                    }
                }
            }

            Cache::put($key, $url, now()->addHours(1));
        } else {
            $url = Cache::get($key);
        }

        return $url;
    }
}

if (!function_exists('clearMenuCache')) {
    /**
     * Clear all cached menu states.
     *
     * @return void
     */
    function clearMenuCache()
    {
        Cache::forever('menu_cache_version', time());
        Cache::forget('menus');
        Cache::forget('menus_web');
        Cache::forget('urlMenu');
    }
}
