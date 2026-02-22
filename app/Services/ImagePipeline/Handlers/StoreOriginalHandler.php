<?php

namespace App\Services\ImagePipeline\Handlers;

use App\Services\ImagePipeline\AbstractImageHandler;
use App\Services\ImagePipeline\Image as ImageDTO;
use Illuminate\Http\UploadedFile;
use Intervention\Image\Image;
use Intervention\Image\ImageManager;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Encoders\WebpEncoder;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;

class StoreOriginalHandler extends AbstractImageHandler
{
    protected string $pathTemplate;

    public function __construct(string $pathTemplate)
    {
        $this->pathTemplate = $pathTemplate;
    }

    public function handle(?Image $image, array $context = []): array
    {
        $manager = new ImageManager(new GdDriver);
        $original = $manager->read($this->file->getRealPath());
        $path = str_replace('{uniqid}', uniqid('image_'), $this->pathTemplate);
        Storage::disk('public')->put(
            $path,
            (string) $original->encode(new WebpEncoder(quality: 90)),
        );
        $context['original'] = new ImageDTO($path, basename($path), $original->width(), $original->height());

        return parent::handle($image, $context);
    }
}