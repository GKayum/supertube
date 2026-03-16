<?php

namespace App\Services;

use App\Services\Contracts\CoverChannelServiceContract;
use App\Services\ImagePipeline\Handlers;

class CoverChannelService implements CoverChannelServiceContract
{
    public function process($uploadedFile): array
    {
        $original = new Handlers\StoreOriginalHandler('covers/channels/original_{uniqid}.webp');
        $resize = new Handlers\ResizeHandler(1200, 240, '1200x240');
        $store = new Handlers\StoreHandler('1200x240', 'covers/channels/1200x240_{uniqid}.webp');

        $original->setFile($uploadedFile)
            ->setNext($resize->setFile($uploadedFile))
            ->setNext($store);

        return $original->handle(null, []);
    }
}