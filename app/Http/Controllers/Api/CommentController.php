<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CommentResource;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function create(int $videoId, Request $request) {
        $validated = $request->validate([
            'text' => 'required|string|max:2048',
        ]);

        Comment::create([
            'text' => $validated['text'],
            'user_id' => $request->user()->id,
            'video_id' => $videoId,
        ]);

        return response()->json([
            'message' => 'Комментарий успешно добавлен!',
            'comments' => CommentResource::collection(
                Comment::where('video_id', $videoId)->get(),
            ),
            'count' => Comment::where('video_id', $videoId)->count(),
        ]);
    }

    public function list(int $videoId) {
        return response()->json([
            'comments' => CommentResource::collection(
                Comment::where('video_id', $videoId)->get(),
            ),
            'count' => Comment::where('video_id', $videoId)->count(),
        ]);
    }
}
