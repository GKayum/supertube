<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChannelResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request)
    {
        return [
            'id' => $this->id,
            'avatar' => $this->avatar,
            'title' => $this->title,
            'description' => $this->description,
            'name' => $this->user->name,
            'user_id' => $this->user->id,
            'videos' => VideoResource::collection($this->user->videos()->orderByDesc('id')->get()),
            'subscribers' => $this->subscribers->count(),
        ];
    }
}
