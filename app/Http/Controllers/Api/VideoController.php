<?php

namespace App\Http\Controllers\Api;

use App\Helpers\Search;
use App\Http\Controllers\Controller;
use App\Http\Resources\VideoResource;
use App\Models\Cover;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class VideoController extends Controller
{
    public function upload(Request $request) {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'string|max:2048',
            'video' => 'required|file|mimetypes:video/mp4,video/avi,video/mpeg,video/quicktime|max:25600',
            'preview350' => 'required|file|mimetypes:image/jpeg,image/jpg,image/png,image/webp|max:1024|dimensions:width=350,height=192',
            'preview480' => 'required|file|mimetypes:image/jpeg,image/jpg,image/png,image/webp|max:1024|dimensions:width=480,height=240',
        ]);

        $files = Arr::only($validated, ['video', 'preview350', 'preview480']);
        $paths = [];

        foreach ($files as $key => $item) {
            $filename = Str::uuid() . '.' . $item->getClientOriginalExtension();
            $paths[$key] = $item->storeAs($key === 'video' ? 'videos' : 'covers', $filename, 'public');
        }

        // Отключение автосохранения изменений, 
        // позволяет выполнить группу SQL-запросов как одно целое
        DB::beginTransaction();

        try {
            $video = Video::create([
                'user_id' => $request->user()->id,
                'title' => $validated['title'],
                'description' => $validated['description'],
                'path' => Storage::url($paths['video']),
            ]);

            $covers = Arr::only($validated, ['preview350', 'preview480']);

            foreach ($covers as $key => $cover) {
                Cover::create([
                    'video_id' => $video->id,
                    'width' => $key === 'preview350' ? 350 : 480,
                    'height' => $key === 'preview350' ? 192 : 240,
                    'path' => Storage::url($paths[$key]),
                ]);
            }

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();

            foreach ($paths as $path) {
                Storage::delete(Storage::url($path));
            }

            return response()->json([
                'message' => 'Ошибка при сохранении мета данных видео.'
            ], 500);
        }


        return response()->json([
            'message' => 'Видео успешно загружено',
        ]);
    }

    public function list() {
        $videos = Video::with('covers')->latest()->get();

        return response()->json(
            VideoResource::collection($videos)
        );
    }

    public function show(int $id) {
        $video = Video::findOrFail($id);

        return response()->json(
            new VideoResource($video)
        );
    }

    public function similar(int $id) {
        $videos = Video::where('id', '!=', $id)->take(20)->get();

        return response()->json(
            VideoResource::collection($videos)
        );
    }

    public function search(Request $request) {
        $words = Search::normalize($request->input('q', ''));
        $videos = Video::query()
            ->where(function($q) use ($words) {
                foreach ($words as $word) {
                    $q->orWhere('title', 'like', "%$word%")
                        ->orWhere('description', 'like', "%$word%");
                }
            })
            ->with('user')
            ->orderByDesc('id')
            ->paginate(20);
        
        return response()->json(
            VideoResource::collection($videos)
        );
    }
}
