<?php

use App\Models\Konfigurasi\Menu;

if (!function_exists('urlMenu')) {
    function urlMenu()
    {
        return Menu::where('active', true)->pluck('url')->toArray();
    }
}
