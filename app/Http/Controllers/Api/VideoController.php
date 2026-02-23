<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\VideoEditRequest;
use App\Http\Requests\VideoUploadRequest;
use App\Http\Resources\VideoResource;
use App\Models\Video;
use App\Services\Contracts\VideoServiceContract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class VideoController extends Controller
{
    public function __construct(private readonly VideoServiceContract $service)
    {
    }

    public function upload(VideoUploadRequest $request) {
        try {
            $result = $this->service->upload($request);
        } catch (\Throwable $e) {
            // Log::error('Video upload failed', [
            //     'error' => $e->getMessage(), 
            //     'trace' => $e->getTraceAsString()
            // ]);
            return response()->json([
                'message' => 'Ошибка при сохранении мета данных видео.'
            ], 500);
        }

        return response()->json($result);
    }

    public function edit(int $id, VideoEditRequest $request) {
        try {
            $result = $this->service->edit($id, $request);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Ошибка при редактировании мета данных видео.'
            ], 500);
        }

        return response()->json($result);
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
        return response()->json(
            VideoResource::collection(
                $this->service->search($request)
            )
        );
    }
}
