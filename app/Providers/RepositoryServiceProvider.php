<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Interfaces\MahasiswaRepositoryInterface;
use App\Repositories\MahasiswaRepository;
use App\Repositories\Interfaces\DosenRepositoryInterface;
use App\Repositories\DosenRepository;
use App\Repositories\Interfaces\RoleRepositoryInterface;
use App\Repositories\RoleRepository;
use App\Repositories\Interfaces\ProdiRepositoryInterface;
use App\Repositories\ProdiRepository;
use App\Repositories\Interfaces\MataKuliahRepositoryInterface;
use App\Repositories\MataKuliahRepository;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(MahasiswaRepositoryInterface::class, MahasiswaRepository::class);
        $this->app->bind(DosenRepositoryInterface::class, DosenRepository::class);
        $this->app->bind(RoleRepositoryInterface::class, RoleRepository::class);
        $this->app->bind(ProdiRepositoryInterface::class, ProdiRepository::class);
        $this->app->bind(MataKuliahRepositoryInterface::class, MataKuliahRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
