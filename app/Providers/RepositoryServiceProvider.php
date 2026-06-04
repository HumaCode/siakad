<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Interfaces\MahasiswaRepositoryInterface;
use App\Repositories\MahasiswaRepository;
use App\Repositories\Interfaces\DosenRepositoryInterface;
use App\Repositories\DosenRepository;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(MahasiswaRepositoryInterface::class, MahasiswaRepository::class);
        $this->app->bind(DosenRepositoryInterface::class, DosenRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
