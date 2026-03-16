<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePlaylistRequest;
use App\Http\Resources\PlaylistResource;
use App\Models\Playlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PlaylistController extends Controller
{
    public function store(StorePlaylistRequest $request) {
        $data = $request->validated();
        $attach = [];

        if (!empty($data['videos']) && is_array($data['videos'])) {
            $ordered = collect($data['videos'])->sortBy('position')->values();

            $now = now();
            foreach ($ordered as $i => $v) {
                $attach[$v['id']] = [
                    'position' => (int) $v['position'] ?? $i,
                    'added_at' => $now,
                ];
            }
        }

        $pl = DB::transaction(function () use ($request, $data, $attach) {
            $playlist = Playlist::create([
                'user_id' => $request->user()->id,
                'title' => $data['title'],
                'description' => $data['description'],
                'status' => $data['status'] ?? 'private',
            ]);

            if (!empty($attach)) {
                $playlist->videos()->attach($attach);
            }

            return $playlist->load(['user', 'videos']);
        });

        return new PlaylistResource($pl);
    }

    public function show(int $id) {
        return new PlaylistResource(
            Playlist::where('id', $id)->firstOrFail()
        );
    }
}
