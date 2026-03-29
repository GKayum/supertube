<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EntryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'title'          => $this->title,
            'description'    => $this->description,
            'status'         => $this->status,
            'channelTitle'   => $this->user->channel?->title,
            'channelId'      => $this->user->id,
            'likes'          => 0,
            'dislikes'       => 0,
            'commentsCount'  => 0,
            'is_owner'       => $request->user()?->id === $this->user_id,
            'timeAgo'        => $this->created_at?->diffForHumans(),
        ];
    }
}
