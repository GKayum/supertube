<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

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
            'image'          => $this->image ? Storage::url($this->image) : null,
            'status'         => $this->status,
            'channelTitle'   => $this->user->channel?->title,
            'channelAvatar'  => $this->user->channel?->avatar,
            'channelId'      => $this->user->id,
            'likes'          => $this->likesCount(),
            'dislikes'       => $this->dislikesCount(),
            'commentsCount'  => $this->comments()->count(),
            'is_owner'       => $request->user()?->id === $this->user_id,
            'timeAgo'        => $this->created_at?->diffForHumans(),
        ];
    }
}
