<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChannelResource;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ChannelController extends Controller
{
    public function show(int $userId, Request $request) {
        $channelOwn = User::query()->findOrFail($userId);

        return response()->json(
            new ChannelResource($channelOwn->channel)
        );
    }

    public function update(Request $request) {
        $channelOwn = $request->user();
        $data = $request->all();

        $validator = Validator::make($data, [
            'avatar' => 'image|mimetypes:image/jpg,image/png,image/webp|max:4096',
            'title' => 'string|max:64',
            'description' => 'string|max:5000',
        ]);

        $validated = $validator->validated();

        if ($request->hasFile('avatar')) {
            $filename = Str::uuid() . '.' . $request->file('avatar')->getClientOriginalExtension();
            $path = $request->file('avatar')->storeAs('avatars', $filename, 'public');
            $validated['avatar'] = Storage::url($path);
        }

        $channelOwn->channel()->updateOrCreate(
            ['user_id' => $channelOwn->id],
            $validated,
        );

        return response()->json(
            new UserResource($channelOwn)
        );
    }
}
