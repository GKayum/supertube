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
            'channelId' => $this->channel->id,
            'name' => $this->name,
            'email' => $this->email,
            'videos' => $this->publishedVideos,
            'channel' => new ChannelResource($this->channel),
            'subscriptions' => $this->subscribedChannels,
        ];
    }
}
