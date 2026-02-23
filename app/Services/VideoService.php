<?php

namespace App\Services;

use App\Helpers\Search;
use App\Http\Requests\VideoEditRequest;
use App\Http\Requests\VideoUploadRequest;
use App\Models\Cover;
use Illuminate\Http\Request;
use App\Models\Video;
use App\Services\Contracts\CoverServiceContract;
use App\Services\Contracts\VideoServiceContract;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Arr;
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

    public function search(Request $request): LengthAwarePaginator 
    {
        $words = Search::normalize($request->input('q', ''));
        return Video::query()
            ->where(function($q) use ($words) {
                foreach ($words as $word) {
                    $q->orWhere('title', 'like', "%$word%")
                        ->orWhere('description', 'like', "%$word%");
                }
            })
            ->with('user')
            ->orderByDesc('id')
            ->paginate(20);
    }

    private function deleteCover(string $path): bool
    {
        $path = str_replace('/storage/', '', parse_url($path, PHP_URL_PATH));

        return Storage::disk('public')->delete($path);
    }
}