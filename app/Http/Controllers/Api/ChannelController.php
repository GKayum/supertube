<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChannelResource;
use App\Http\Resources\EntryResource;
use App\Http\Resources\PlaylistResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\VideoResource;
use App\Models\CoverChannel;
use App\Models\User;
use App\Services\Contracts\CoverChannelServiceContract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Throwable;

class ChannelController extends Controller
{
    public function __construct(
        private readonly CoverChannelServiceContract $coverChannelService
    ) {
    }

    public function show(int $userId, Request $request) {
        $channelOwn = User::query()->findOrFail($userId);

        return response()->json(
            new ChannelResource($channelOwn->channel)
        );
    }

    public function update(Request $request) {
        $channelOwn = $request->user();
        $data = $request->all();
        $paths = [];

        $validator = Validator::make($data, [
            'avatar' => 'image|mimetypes:image/jpg,image/png,image/webp|max:4096',
            'title' => 'string|max:64',
            'description' => 'string|max:5000',
            'cover' => 'image|mimetypes:image/jpg,image/jpeg,image/png,image/webp|max:20480',
        ]);

        $validated = $validator->validated();

        if ($request->hasFile('avatar')) {
            $filename = Str::uuid() . '.' . $request->file('avatar')->getClientOriginalExtension();
            $path = $request->file('avatar')->storeAs('avatars', $filename, 'public');
            $validated['avatar'] = Storage::url($path);
            $paths[] = $path;
        }

        DB::beginTransaction();

        try {
            $channel = $channelOwn->channel()->updateOrCreate(
                ['user_id' => $channelOwn->id],
                $validated,
            );

            if ($request->hasFile('cover')) {
                $channel->covers()->delete();
                $images = $this->coverChannelService->process($validated['cover']);

                foreach ($images as $image) {
                    $paths[] = $image->path;
                    CoverChannel::create([
                        'channel_id' => $channel->id,
                        'width' => $image->width,
                        'height' => $image->height,
                        'path' => Storage::url($image->path),
                    ]);
                }
            }

            DB::commit();
        } catch (Throwable $e) {
            DB::rollBack();

            return response()->json([
                'message' => $e->getMessage(),
            ]);
        }

        return response()->json(
            new UserResource($channelOwn)
        );
    }

    public function playlists(int $userId, Request $request) {
        $channelOwn = User::query()->findOrFail($userId);

        return PlaylistResource::collection($channelOwn->playlists);
    }

    public function shorts(int $userId, Request $request) {
        $channelOwn = User::query()->findOrFail($userId);

        return VideoResource::collection($channelOwn->publishedShorts);
    }

    public function entries(int $userId, Request $request) {
        $channelOwn = User::query()->findOrFail($userId);

        return EntryResource::collection($channelOwn->publishedEntries()->orderByDesc('id')->get());
    }
}
