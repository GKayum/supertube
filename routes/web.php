<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\VideoController;
use App\Http\Controllers\MainController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('admin')->group(function () {
    Route::middleware(['auth:sanctum', 'admin'])->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('admin.home');
        Route::post('/logout', [AdminController::class, 'logout'])->name('admin.logout');

        Route::get('/videos', [VideoController::class, 'list'])->name('videos.list');
        Route::post('/videos/update/{video}', [VideoController::class, 'update'])->name('videos.update');
    });
});

Route::controller(MainController::class)->group(function () {
    Route::get('/login', 'index')->name('login');
    Route::get('/video/{video}', 'index')->name('videos.show');
    Route::get('/channel/{id}', 'index');
    Route::get('/edit/{id}', 'index');
});

Route::get('/{page}', [MainController::class, 'index'])
    ->where('page', 'login|register|settings|search|upload|channel/settings|my-videos|history|channels|watch-later');
