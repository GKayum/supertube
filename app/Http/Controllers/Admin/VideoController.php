<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\VideoResource;
use App\Models\Video;
use Illuminate\Http\Request;

class VideoController extends Controller
{
    public function list() {
        $videos = Video::with('covers')->latest()->paginate(20);

        $context = [
            'videos' => VideoResource::collection($videos),
        ];

        return view('admin.videos.index', $context);
    }

    public function update(Request $request, Video $video) {
        $request->validate([
            'status' => 'required',
        ]);

        $video->update([
            'status' => $request['status'],
        ]);

        return back();
    }
}
