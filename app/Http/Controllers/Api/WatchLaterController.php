<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\VideoResource;
use App\Models\WatchLater;
use Illuminate\Http\Request;

class WatchLaterController extends Controller
{
    public function save(int $videoId, Request $request) {
        $watchLater = WatchLater::firstOrCreate([
            'user_id' => $request->user()->id,
            'video_id' => $videoId,
        ]);

        return response()->json([
            'message' => 'Видео добавлено в список "Смотреть позже"',
        ]);
    }

    public function list(Request $request) {
        return response()->json([
            'videos' => VideoResource::collection(
                WatchLater::with('video')->where('user_id', $request->user()->id)->latest()->get(),
            ),
        ]);
    }
}
