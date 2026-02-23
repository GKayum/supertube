<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscriber;
use Illuminate\Http\Request;

class SubscribeController extends Controller
{
    public function subscribe(int $channelId, Request $request) {
        $exists = Subscriber::where('user_id', $request->user()->id)
            ->where('channel_id', $channelId)
            ->exists();
        
        if ($exists) {
            return response()->json([
                'message' => 'Вы уже подписаны на этот канал!',
            ], 409);
        }

        Subscriber::create([
            'user_id' => $request->user()->id,
            'channel_id' => $channelId,
        ]);

        return response()->json([
            'message' => 'Вы подписались на канал!',
            'subscribers' => Subscriber::where('channel_id', $channelId)->count(),
        ]);
    }

    public function unsubscribe(int $channelId, Request $request) {
        Subscriber::where('user_id', $request->user()->id)
            ->where('channel_id', $channelId)
            ->delete();
        
        return response()->json([
            'message' => 'Вы отписались от канала!',
            'subscribers' => Subscriber::where('channel_id', $channelId)->count(),
        ]);
    }
}
