<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Interfaces\MahasiswaRepositoryInterface;
use App\Repositories\MahasiswaRepository;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(MahasiswaRepositoryInterface::class, MahasiswaRepository::class);
        // bind repository lainnya di sini...
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
