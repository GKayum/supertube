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
    public function index(Request $request) {
        return PlaylistResource::collection(Playlist::where('user_id', $request->user()->id)->get());
    }

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

    public function update(int $id, StorePlaylistRequest $request) {
        $data = $request->validated();
        $attach = $this->buildPivotData($data);

        $playlist = Playlist::query()
            ->whereKey($id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();
        
        $pl = DB::transaction(function () use ($playlist, $data, $attach) {
            $playlist->fill([
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'status' => $data['status'] ?? 'private',
            ])->save();

            $playlist->videos()->sync($attach);

            return $playlist->load([
                'user',
                'videos' => fn ($q) => $q->orderBy('playlist_videos.position'),
            ]);
        });

        return new PlaylistResource($pl);
    }

    public function show(int $id) {
        return new PlaylistResource(
            Playlist::where('id', $id)->firstOrFail()
        );
    }

    private function buildPivotData(array $data): array
    {
        $attach = [];

        if (!empty($data['videos']) && is_array($data['videos'])) {
            // Преобразование массива 'videos' в коллекцию Laravel (collect()),
            // сортировка по полю 'position' от меньшего к большему (sortBy()),
            // и сброс ключей массива после сортировки, чтобы индексы шли по порядку (values())
            $ordered = collect($data['videos'])
                ->sortBy('position')
                ->values();
            
            $now = now();
            foreach ($ordered as $i => $v) {
                $vid = (int) ($v['id'] ?? 0);
                if ($vid <= 0) {
                    continue;
                }
                $attach[$vid] = [
                    'position' => (int) (($v['position'] ?? $i)),
                    'added_at' => $now,
                ];
            }
        }

        return $attach;
    }
}
