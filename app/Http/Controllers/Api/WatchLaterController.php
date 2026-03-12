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

    public function delete(int $videoId, Request $request) {
        WatchLater::where([
            'user_id' => $request->user()->id,
            'video_id' => $videoId,
        ])->delete();

        return response()->json([
            'message' => 'Видео удалено из списка "Смотреть позже"',
        ]);
    }

    public function list(Request $request) {
        return response()->json([
            'videos' => VideoResource::collection(
                WatchLater::with('video')
                    ->where('user_id', $request->user()->id)
                    ->orderBy('sort_order')
                    ->orderBy('created_at', 'desc')
                    ->limit(50)
                    ->get()
                    ->pluck('video')
                    ->filter()
            ),
        ]);
    }

    public function updateOrder(Request $request) {
        $request->validate([
            'order' => 'required|array',
            'order.*' => 'integer|exists:videos,id',
        ]);

        $userId = $request->user()->id;
        $videoIds = $request->input('order');

        $watchLaters = WatchLater::where('user_id', $userId)
            ->whereIn('video_id', $videoIds)
            ->get()
            ->keyBy('video_id');
        
        foreach ($videoIds as $index => $videoId) {
            if (isset($watchLaters[$videoId])) {
                $watchLaters[$videoId]->sort_order = $index;
                $watchLaters[$videoId]->save();
            }
        }

        return response()->json([
            'message' => 'Порядок видео обновлен',
        ]);
    }
}
