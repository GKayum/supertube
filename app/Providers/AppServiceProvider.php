<?php

namespace App\Providers;

use Illuminate\Pagination\Paginator;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public $bindings = [
        \App\Services\Contracts\VideoServiceContract::class => \App\Services\VideoService::class,
        \App\Services\Contracts\CoverServiceContract::class => \App\Services\CoverService::class,
    ];

    /**
     * Register any application services.
     */
    public function register(): void
    {
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Paginator::useBootstrapFive();
    }
}
