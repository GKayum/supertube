<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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
}
