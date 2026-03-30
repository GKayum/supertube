<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EntryCommentResource;
use App\Models\Entry;
use App\Models\EntryComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EntryCommentController extends Controller
{
    public function index(Entry $entry) {
        if ($entry->status !== 'published') {
            abort(404);
        }

        $comments = $entry->comments()
            ->with('user.channel')
            ->paginate(20);

        return response()->json([
            'comments' => EntryCommentResource::collection($comments->items()),
            'pagination' => [
                'current_page' => $comments->currentPage(),
                'last_page' => $comments->lastPage(),
                'per_page' => $comments->perPage(),
                'total' => $comments->total(),
            ]
        ]);
    }

    public function store(Request $request, Entry $entry) {
        if ($entry->status !== 'published') {
            abort(404);
        }

        $validator = Validator::make($request->all(), [
            'content' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Ошибка валидации',
                'errors' => $validator->errors()
            ], 422);
        }

        $comment = EntryComment::create([
            'entry_id' => $entry->id,
            'user_id' => $request->user()->id,
            'content' => $request->content,
        ]);

        $comment->load('user.channel');

        return response()->json([
            'message' => 'Комментарий успешно добавлен',
            'comment' => new EntryCommentResource($comment)
        ], 201);
    }
}
