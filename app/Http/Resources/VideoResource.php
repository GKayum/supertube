<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class VideoResource extends JsonResource
{
    public function toArray($request)
    {
        $previews = $this->covers->keyBy('width');

        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'path' => $this->path,
            'views' => $this->views->count(),

            'preview350' => isset($previews[350]) ? $previews[350]->path : null,
            'preview480' => isset($previews[480]) ? $previews[480]->path : null,

            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'avatar' => $this->user->channel?->avatar,
            ],
        ];
    }
}
