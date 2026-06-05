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
     * @return Collection
     */
    function menus()
    {
        $userId = auth()->id();
        $version = Cache::rememberForever('menu_cache_version', function () {
            return time();
        });
        $key = "menus_raw_{$userId}_{$version}";

        if (!Cache::has($key)) {
            $menus = (new MenuRepository())->getMenus()->groupBy('category');

            // Filter berdasarkan gate
            $filtered = $menus->map(function ($menuGroup) {
                return collect($menuGroup)->filter(function ($item) {
                    return Gate::allows('read ' . filterKata($item->url));
                });
            })->filter(function ($menuGroup) {
                return $menuGroup->isNotEmpty();
            });

            Cache::put($key, $filtered, now()->addHours(1)); // atau Cache::forever
        }

        return Cache::get($key);
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
        if (!Cache::has('urlMenu')) {
            $menus = menus()->flatMap(fn($item) => $item);

            $url = [];
            foreach ($menus as $mm) {
                $url[] = $mm->url;
                foreach ($mm->subMenus as $sm) {
                    $url[] = $sm->url;
                }
            }

            Cache::forever('urlMenu', $url);
        } else {
            $url = Cache::get('urlMenu');
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
