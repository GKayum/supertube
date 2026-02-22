<?php

namespace App\Services\ImagePipeline;

class Image
{
    public function __construct(
        public string $path,
        public string $name,
        public int $width,
        public int $height,
    )
    {
    }
}