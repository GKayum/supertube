<?php

namespace App\Services;

use App\Enums\VideoStatus;
use App\Helpers\Search;
use App\Http\Resources\PlaylistResource;
use App\Http\Resources\VideoResource;
use App\Models\Playlist;
use App\Models\Video;
use App\Services\Contracts\SearchServiceContract;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SearchService implements SearchServiceContract
{
    public function filter(Request $request): JsonResource
    {
        $type = $request->input('type', 'video');
        $words = Search::normalize($request->input('q', ''));

        if ($type === 'playlist') {
            $playlists = Playlist::query()
                ->where(function ($q) use ($words) {
                    foreach ($words as $word) {
                        $q->orWhere('title', 'like', "%$word%")
                        ->orWhere('description', 'like', "%$word%");
                    }
                })
                ->where('status', 'public')
                ->with(['user'])
                ->withCount('videos')
                ->orderByDesc('created_at')
                ->paginate(20);

            return PlaylistResource::collection($playlists);
        }

        $videos = Video::query()
            ->where(function ($q) use ($words) {
                foreach ($words as $word) {
                    $q->orWhere('title', 'like', "%$word%")
                        ->orWhere('description', 'like', "%$word%");
                }
            })
            ->where('status', VideoStatus::Published->value)
            ->when($request->has('duration'), function ($q) use ($request) {
                if ($request->get('duration') === 'short') {
                    $q->where('duration', '<', 10);
                }
                if ($request->get('duration') === 'medium') {
                    $q->where('duration', '>=', 10)
                        ->where('duration', '<=', 60);
                }
                if ($request->get('duration') === 'long') {
                    $q->where('duration', '>', 60);
                }
            })
            ->with('user')
            ->orderByDesc('created_at')
            ->paginate(20);

        return VideoResource::collection($videos);
    }
}