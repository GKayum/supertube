<?php

namespace App\Services\ImagePipeline;

use Illuminate\Http\UploadedFile;
use Intervention\Image\Image;

abstract class AbstractImageHandler implements ImageHandlerContract
{
    protected ?ImageHandlerContract $next = null;
    protected UploadedFile $file;

    public function setNext(ImageHandlerContract $handler): ImageHandlerContract
    {
        $this->next = $handler;

        return $handler;
    }

    public function setFile(UploadedFile $file): self
    {
        $this->file = $file;

        return $this;
    }

    public function handle(?Image $image, array $context = []): array
    {
        if ($this->next) {
            return $this->next->handle($image, $context);
        }

        return $context;
    }
}