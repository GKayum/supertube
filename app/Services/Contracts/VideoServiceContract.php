<?php

namespace App\Services\Contracts;

use App\Http\Requests\VideoEditRequest;
use App\Http\Requests\VideoUploadRequest;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

interface VideoServiceContract {
    public function upload(VideoUploadRequest $request): array;
    public function edit(int $id, VideoEditRequest $request): array;
    public function search(Request $request): LengthAwarePaginator;
}