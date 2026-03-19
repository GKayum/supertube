<?php

namespace App\Services;

use App\Enums\VideoStatus;
use App\Http\Requests\VideoEditRequest;
use App\Http\Requests\VideoUploadRequest;
use App\Http\Resources\VideoResource;
use App\Models\Cover;
use App\Models\Video;
use App\Services\Contracts\CoverServiceContract;
use App\Services\Contracts\VideoServiceContract;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class VideoService implements VideoServiceContract 
{
    public function __construct(
        private readonly CoverServiceContract $coverService,
    ) {
    }

    public function upload(VideoUploadRequest $request): array 
    {
        $validated = $request->validated();

        $filename = Str::uuid() . '.' . $validated['video']->getClientOriginalExtension();
        $videoPath = $validated['video']->storeAs('videos', $filename, 'public');
        $paths = [$videoPath];
        $covers = $this->coverService->process($validated['preview']);

        // Отключение автосохранения изменений, 
        // позволяет выполнить группу SQL-запросов как одно целое
        DB::beginTransaction();

        try {
            $video = Video::create([
                'user_id' => $request->user()->id,
                'title' => $validated['title'],
                'description' => $validated['description'],
                'path' => Storage::url($videoPath),
                'status' => $validated['status'],
                'scheduled_at' => $validated['scheduledAt'] ?? null,
                'hidden_hash' => Str::random(16),
            ]);

            foreach ($covers as $cover) {
                Cover::create([
                    'video_id' => $video->id,
                    'width' => $cover->width,
                    'height' => $cover->height,
                    'path' => Storage::url($cover->path),
                ]);
            }

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();

            foreach ($paths as $path) {
                $this->deleteCover($path);
            }

            throw $e;
        }

        return [
            'message' => 'Видео успешно загружено',
            'id' => $video->id,
        ];
    }

    public function edit(int $id, VideoEditRequest $request): array
    {
        $video = Video::where('user_id', $request->user()->id)->findOrFail($id);
        $validated = $request->validated();
        $paths = [];
        $hasCover = !empty($validated['preview']);

        if ($hasCover) {
            $covers = $this->coverService->process($validated['preview']);
        }

        DB::beginTransaction();
        
        try {
            $video->fill([
                'title' => $validated['title'],
                'description' => $validated['description'],
                'status' => $validated['status'],
                'scheduled_at' => $validated['scheduledAt'] ?? null,
                'hidden_hash' => Str::random(16),
            ])->save();

            if ($hasCover) {
                $oldPaths = $video->covers->pluck('path');
                $video->covers()->delete();

                foreach ($covers as $cover) {
                    $paths[] = $cover->path;
                    Cover::create([
                        'video_id' => $video->id,
                        'width' => $cover->width,
                        'height' => $cover->height,
                        'path' => Storage::url($cover->path),
                    ]);
                }

                foreach ($oldPaths as $path) {
                    $this->deleteCover($path);
                }
            }

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();

            foreach ($paths as $path) {
                $this->deleteCover($path);
            }

            throw $e;
        }

        return [
            'message' => 'Видео успешно отредактировано!',
        ];
    }

    public function show(string $idOrHiddenHash): VideoResource
    {
        // $user = Auth::user();
        $user = auth()->user();
        $isHash = !is_numeric($idOrHiddenHash) || strlen($idOrHiddenHash) === 16;

        if ($isHash) {
            $video = Video::where('hidden_hash', $idOrHiddenHash)
                ->where('status', VideoStatus::Hidden->value)
                ->firstOrFail();
            
            return new VideoResource($video);
        }

        $video = Video::findOrFail($idOrHiddenHash);

        if ($video->status === VideoStatus::Published->value) {
            return new VideoResource($video);
        }

        // Возвращать видео, если является владельцем видео
        if ($user?->id === $video->user_id) {
            return new VideoResource($video);
        }

        abort(404);
    }

    private function deleteCover(string $path): bool
    {
        $path = str_replace('/storage/', '', parse_url($path, PHP_URL_PATH));

        return Storage::disk('public')->delete($path);
    }
}