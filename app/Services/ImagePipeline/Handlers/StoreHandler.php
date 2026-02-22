<?php

namespace App\Services\ImagePipeline\Handlers;

use App\Services\ImagePipeline\AbstractImageHandler;
use App\Services\ImagePipeline\Image as ImageDTO;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Encoders\WebpEncoder;
use Intervention\Image\Image;

class StoreHandler extends AbstractImageHandler
{
    protected string $key;
    protected string $pathTemplate;

    public function __construct(string $key, string $pathTemplate)
    {
        $this->key = $key;
        $this->pathTemplate = $pathTemplate;
    }

    public function handle(?Image $image, array $context = []): array
    {
        if (!isset($context[$this->key])) {
            return parent::handle($image, $context);
        }

        $path = str_replace('{uniqid}', uniqid('image_'), $this->pathTemplate);
        Storage::disk('public')->put($path, (string) $image->encode(new WebpEncoder(quality: 90)));
        $context[$this->key] = new ImageDTO($path, basename($path), $image->width(), $image->height());

        return parent::handle($image, $context);
    }
}