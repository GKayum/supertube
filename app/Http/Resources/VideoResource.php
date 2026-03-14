<?php

namespace App\Http\Resources;

use App\Enums\VideoStatus;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class VideoResource extends JsonResource
{
    public function toArray($request)
    {
        $previews = $this->covers->keyBy('width');

        $data = [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'path' => $this->path,
            'status' => $this->status,
            'scheduledAt' => $this->scheduled_at?->format('Y-m-d\TH:i'),
            'views' => $this->views->count(),
            'comments' => $this->comments->count(),
            'timeAgo' => $this->scheduled_at
                ? $this->scheduled_at->diffForHumans()
                : $this->created_at->diffForHumans(),

            'preview350' => isset($previews[350]) ? $previews[350]->path : null,
            'preview480' => isset($previews[480]) ? $previews[480]->path : null,

            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'avatar' => $this->user->channel?->avatar,
            ],

            'channel' => [
                'id' => $this->user->channel?->id,
                'subscribers' => $this->user->channel?->subscribers->count() ?? 0,
                'isSubscribed' => $this->user->channel?->subscribers()->where('user_id', Auth::id())->exists(),
            ],
        ];

        if (
            $request->user()?->id === $this->user_id &&
            $this->status === VideoStatus::Hidden->value
        ) {
            $data['hiddenLink'] = url('/video/' . $this->hidden_hash);
        }

        return $data;
    }
}
