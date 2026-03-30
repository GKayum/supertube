<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EntryCommentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $timeAgo = $this->created_at->diffForHumans();

        if ($timeAgo === '0 секунд назад') {
            $timeAgo = 'только что';
        }

        return [
            'id' => $this->id,
            'content' => $this->content,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'avatar' => $this->user->channel?->avatar,
            ],
            'timeAgo' => $timeAgo,
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
