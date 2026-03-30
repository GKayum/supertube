<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChannelController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\EntryCommentController;
use App\Http\Controllers\Api\EntryController;
use App\Http\Controllers\Api\EntryLikeController;
use App\Http\Controllers\Api\LikeController;
use App\Http\Controllers\Api\PlaylistController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\SubscribeController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\VideoController;
use App\Http\Controllers\Api\ViewController;
use App\Http\Controllers\Api\WatchLaterController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/videos', [VideoController::class, 'list']);
    Route::get('/videos/shorts', [VideoController::class, 'listShorts']);
    Route::get('/videos/search', [SearchController::class, 'filter']);

    Route::get('/entries', [EntryController::class, 'indexHome']);
    Route::get('/entries/{entry}', [EntryController::class, 'show'])->where('entry', '[1-9][0-9]*');
    Route::get('/entries/{entry}/comments', [EntryCommentController::class, 'index'])->where('entry', '[1-9][0-9]*');
    Route::get('/entries/{entry}/likes', [EntryLikeController::class, 'list'])->where('entry', '[1-9][0-9]*');
    Route::post('/entries/{entry}/like', [EntryLikeController::class, 'like'])->where('entry', '[1-9][0-9]*');
    Route::post('/entries/{entry}/dislike', [EntryLikeController::class, 'dislike'])->where('entry', '[1-9][0-9]*');

    Route::get('/shorts/viewer', [VideoController::class, 'viewerFirst']);
    Route::get('/shorts/viewer/more', [VideoController::class, 'viewerMore']);

    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    
    Route::get('/videos/{idOrHiddenHash}', [VideoController::class, 'show'])
        ->where('idOrHiddenHash', '([1-9][0-9]*|[A-Za-z0-9]{16})');
    Route::get('/videos/{id}/similar', [VideoController::class, 'similar'])->where('id', '[1-9][0-9]*');
    Route::get('/videos/{id}/comments', [CommentController::class, 'list'])->where('id', '[1-9][0-9]*');
    Route::get('/videos/{id}/likes', [LikeController::class, 'list'])->where('id', '[1-9][0-9]*');
    Route::post('/videos/{id}/like', [LikeController::class, 'like'])->where('id', '[1-9][0-9]*');
    Route::post('/videos/{id}/dislike', [LikeController::class, 'dislike'])->where('id', '[1-9][0-9]*');
    Route::post('/videos/{id}/view/increment', [ViewController::class, 'increment'])->where('id', '[1-9][0-9]*');

    Route::get('/channel/{id}', [ChannelController::class, 'show'])->where('id', '[1-9][0-9]*');
    Route::get('/channel/{id}/playlists', [ChannelController::class, 'playlists'])->where('id', '[1-9][0-9]*');
    Route::get('/channel/{id}/shorts', [ChannelController::class, 'shorts'])->where('id', '[1-9][0-9]*');
    Route::get('/channel/{id}/entries', [ChannelController::class, 'entries'])->where('id', '[1-9][0-9]*');

    Route::get('/playlist/{id}', [PlaylistController::class, 'show'])->where('id', '[1-9][0-9]*');
    Route::post('/playlists/{id}/view/increment', [PlaylistController::class, 'incrementView'])->where('id', '[1-9][0-9]*');

    Route::get('/search/filters', [SearchController::class, 'filters']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);

        Route::get('/videos/history/views', [ViewController::class, 'history']);
        Route::get('/videos/statuses', [VideoController::class, 'statuses']);
        Route::post('/videos/upload', [VideoController::class, 'upload']);
        Route::post('/videos/{id}/edit', [VideoController::class, 'edit'])->where('id', '[1-9][0-9]*');

        Route::post('/videos/{id}/comments', [CommentController::class, 'create'])->where('id', '[1-9][0-9]*');
        Route::post('/videos/{id}/watch-later', [WatchLaterController::class, 'save'])->where('id', '[1-9][0-9]*');
        Route::delete('/videos/{id}/watch-later', [WatchLaterController::class, 'delete'])->where('id', '[1-9][0-9]*');

        Route::post('/channel/{id}/subscribe', [SubscribeController::class, 'subscribe'])->where('id', '[1-9][0-9]*');
        Route::post('/channel/{id}/unsubscribe', [SubscribeController::class, 'unsubscribe'])->where('id', '[1-9][0-9]*');

        Route::post('/playlists/store', [PlaylistController::class, 'store']);
        Route::put('/playlist/{id}/update', [PlaylistController::class, 'update'])->where('id', '[1-9][0-9]*');

        Route::post('/entry/store', [EntryController::class, 'store']);
        Route::post('/entries/{entry}/comments', [EntryCommentController::class, 'store'])->where('entry', '[1-9][0-9]*');

        Route::prefix('/user')->group(function () {
            Route::get('/videos', [UserController::class, 'videos']);
            Route::get('/shorts', [UserController::class, 'shorts']);
            Route::get('/videos/{id}', [UserController::class, 'show'])->where('id', '[1-9][0-9]*');
            Route::get('/profile', [UserController::class, 'profile']);
            Route::post('/profile/update', [UserController::class, 'update']);

            Route::post('/channel/update', [ChannelController::class, 'update']);
            Route::get('/channels', [SubscribeController::class, 'channels']);
            Route::get('/playlists', [PlaylistController::class, 'index']);
            Route::get('/entries', [EntryController::class, 'index']);

            Route::get('/entries/{entry}', [EntryController::class, 'showProfile']);
            Route::post('/entries/{entry}', [EntryController::class, 'update']);

            Route::get('/watch-later', [WatchLaterController::class, 'list']);
            Route::post('/watch-later/order', [WatchLaterController::class, 'updateOrder']);

            Route::get('/liked', [LikeController::class, 'liked']);
            Route::get('/liked-entries', [EntryLikeController::class, 'liked']);
        });
    });
});