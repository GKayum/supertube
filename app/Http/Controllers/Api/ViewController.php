<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ViewResource;
use App\Models\View;
use Illuminate\Http\Request;

class ViewController extends Controller
{
    public function increment(int $videoId, Request $request) {
        View::create([
            'user_id' => $request->user()?->id,
            'video_id' =>$videoId,
        ]);

        return response()->json([
            'views' => View::where('video_id', $videoId)->count(),
        ]);
    }

    public function history(Request $request) {
        $views = View::where('user_id', $request->user()->id)->orderByDesc('id')->get();

        $filteredViews = $views->reduce(function ($carry, $item) {
            if ($carry->isEmpty() || $carry->last()->video->id !== $item->video->id) {
                $carry->push($item);
            }
            return $carry;
        }, collect());

        return response()->json([
            'views' => ViewResource::collection($filteredViews),
        ]);
    }
}
