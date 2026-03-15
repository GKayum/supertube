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
            'cover' => $this->videos->first()?->covers->first()?->path,
            'user' => new UserResource($this->whenLoaded('user')),
            'videos' => VideoResource::collection($this->whenLoaded('videos')),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
