<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public $bindings = [
        \App\Services\Contracts\SearchServiceContract::class => \App\Services\SearchService::class,
        \App\Services\Contracts\VideoServiceContract::class => \App\Services\VideoService::class,
        \App\Services\Contracts\CoverServiceContract::class => \App\Services\CoverService::class,
        \App\Services\Contracts\CoverChannelServiceContract::class => \App\Services\CoverChannelService::class,
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
        //
    }
}
