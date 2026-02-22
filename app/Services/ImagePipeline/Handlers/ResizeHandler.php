<?php

namespace App\Services\ImagePipeline\Handlers;

use App\Services\ImagePipeline\AbstractImageHandler;
use Intervention\Image\Image;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;

class ResizeHandler extends AbstractImageHandler
{
    protected int $width;
    protected int $height;
    protected string $key;

    public function __construct(int $width, int $height, string $key)
    {
        $this->width = $width;
        $this->height = $height;
        $this->key = $key;
    }

    public function handle(?Image $image, array $context = []): array
    {
        $manager = new ImageManager(new GdDriver);
        $image = $manager->read($this->file->getRealPath());
        $resized = $image->cover($this->width, $this->height);

        $context[$this->key] = $resized;

        return parent::handle($image, $context);
    }
}