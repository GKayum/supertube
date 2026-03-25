<?php

namespace App\Http\Controllers\Api;

use App\Enums\VideoStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Http\Resources\VideoResource;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function videos(Request $request) {
        $videos = $request->user()->videos()->where('is_short', false)->with('covers')->latest()->get();
        return response()->json(
            VideoResource::collection($videos)
        );
    }

    public function show(int $id, Request $request) {
        $video = $request->user()->videos()->where('id', $id)->firstOrFail();

        return response()->json(
            new VideoResource($video)
        );
    }

    public function profile(Request $request) {
        return response()->json(
            new UserResource($request->user())
        );
    }

    public function update(Request $request) {
        $data = $request->all();
        $user = $request->user();

        if (isset($data['email']) && $data['email'] === $user->email) {
            unset($data['email']);
        }

        $validator = Validator::make($data, [
            'name' => 'string|max:30',
            'email' => 'email|max:255|unique:users,email',
            'password' => 'min:6|confirmed',
        ]);

        $validated = $validator->validated();

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user = Auth::user();
        $user->fill($validated)->save();

        return response()->json([
            'message' => 'Настройки успешно сохранены!',
            'user' => $user,
        ]);
    }

    public function shorts(Request $request) {
        $user = $request->user();
        $perPage = (int) $request->integer('per_page', 50);

        $query = Video::query()
            ->where('user_id', $user->id)
            ->shorts()
            ->with(['user'])
            ->orderByDesc('created_at');
        
        $paginator = $query->paginate($perPage);

        return VideoResource::collection($paginator);
    }
}
