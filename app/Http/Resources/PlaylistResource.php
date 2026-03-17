<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlaylistResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'cover' => $this->publishedVideos()->orderBy('position')->first()?->covers->first()?->path,
            'user' => new UserResource($this->user),
            'videos' => VideoResource::collection($this->publishedVideos),
            'timeAgo' => $this->updated_at?->diffForHumans(),
            'videoCount' => $this->publishedVideos->count(),
            'firstVideoId' => $this->publishedVideos()->orderBy('position')->first()->id,
            'views' => $this->views()->count(),
            'videosViews' => $this->publishedVideos->loadCount('views')->sum('views_count'),
        ];
    }
}
