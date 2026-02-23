<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Like;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function like(int $videoId, Request $request) {
        $exists = Like::where(['video_id' => $videoId, 'fingerprint' => $request->post('fingerprint')])->exists();

        if ($exists) {
            Like::where(['video_id' => $videoId, 'fingerprint' => $request->post('fingerprint')])->delete();

            return $this->getResponse($videoId);
        }

        Like::create([
            'video_id' => $videoId,
            'user_id' => $request->user()?->id,
            'fingerprint' => $request->post('fingerprint'),
            'result' => 1,
        ]);

        return $this->getResponse($videoId);
    }

    public function dislike(int $videoId, Request $request) {
        $exists = Like::where(['video_id' => $videoId, 'fingerprint' => $request->post('fingerprint')])->exists();

        if ($exists) {
            Like::where(['video_id' => $videoId, 'fingerprint' => $request->post('fingerprint')])->delete();

            return $this->getResponse($videoId);
        }

        Like::create([
            'video_id' => $videoId,
            'user_id' => $request->user()?->id,
            'fingerprint' => $request->post('fingerprint'),
            'result' => 0,
        ]);

        return $this->getResponse($videoId);
    }

    public function list(int $videoId, Request $request) {
        return $this->getResponse($videoId);
    }

    private function getResponse(int $videoId) {
        return response()->json([
            'likes' => Like::where(['video_id' => $videoId, 'result' => 1])->count() ?? 0,
            'dislikes' => Like::where(['video_id' => $videoId, 'result' => 0])->count() ?? 0, 
        ]);
    }
}
