<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChannelController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\LikeController;
use App\Http\Controllers\Api\SubscribeController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\VideoController;
use App\Http\Controllers\Api\ViewController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/videos', [VideoController::class, 'list']);
    Route::get('/videos/search', [VideoController::class, 'search']);

    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    
    Route::get('/videos/{id}', [VideoController::class, 'show'])->where('id', '[1-9][0-9]*');
    Route::get('/videos/{id}/similar', [VideoController::class, 'similar'])->where('id', '[1-9][0-9]*');
    Route::get('/videos/{id}/comments', [CommentController::class, 'list'])->where('id', '[1-9][0-9]*');
    Route::get('/videos/{id}/likes', [LikeController::class, 'list'])->where('id', '[1-9][0-9]*');
    Route::post('/videos/{id}/view/increment', [ViewController::class, 'increment'])->where('id', '[1-9][0-9]*');

    Route::get('/channel/{id}', [ChannelController::class, 'show'])->where('id', '[1-9][0-9]*');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/videos/upload', [VideoController::class, 'upload']);

        Route::post('/videos/{id}/comments', [CommentController::class, 'create'])->where('id', '[1-9][0-9]*');
        Route::post('/videos/{id}/like', [LikeController::class, 'like'])->where('id', '[1-9][0-9]*');
        Route::post('/videos/{id}/dislike', [LikeController::class, 'dislike'])->where('id', '[1-9][0-9]*');

        Route::post('/channel/{id}/subscribe', [SubscribeController::class, 'subscribe'])->where('id', '[1-9][0-9]*');
        Route::post('/channel/{id}/unsubscribe', [SubscribeController::class, 'unsubscribe'])->where('id', '[1-9][0-9]*');

        Route::prefix('/user')->group(function () {
            Route::get('/profile', [UserController::class, 'profile']);
            Route::get('/videos', [UserController::class, 'videos']);
            Route::post('/profile/update', [UserController::class, 'update']);

            Route::post('/channel/update', [ChannelController::class, 'update']);
        });
    });
});