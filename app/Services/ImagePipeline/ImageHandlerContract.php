<?php

namespace App\Services\ImagePipeline;

use Illuminate\Http\UploadedFile;
use Intervention\Image\Image;

interface ImageHandlerContract
{
    public function setFile(UploadedFile $file): self;
    public function setNext(ImageHandlerContract $handler): self;
    public function handle(?Image $image, array $context = []): array;
}