<?php

namespace App\Services\Contracts;

use App\Http\Requests\VideoEditRequest;
use App\Http\Requests\VideoUploadRequest;
use App\Http\Resources\VideoResource;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

interface VideoServiceContract {
    public function upload(VideoUploadRequest $request): array;
    public function edit(int $id, VideoEditRequest $request): array;
    public function show(string $idOrHiddenHash): VideoResource;
    public function search(Request $request): LengthAwarePaginator;
}