<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'videos' => $this->videos,
            'channel' => [
                'id' => $this->channel?->id,
                'avatar' => $this->channel?->avatar,
                'title' => $this->channel?->title,
                'description' => $this->channel?->description,
            ],
        ];
    }
}
