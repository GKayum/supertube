<?php

namespace App\Services;

use App\Services\Contracts\CoverServiceContract;
use App\Services\ImagePipeline\Handlers;

class CoverService implements CoverServiceContract
{
    public function process($uploadedFile): array
    {
        $originalTemplate = 'covers/original/{uniqid}.webp';
        $template350 = 'covers/350x192/{uniqid}.webp';
        $template480 = 'covers/480x240/{uniqid}.webp';

        $original = new Handlers\StoreOriginalHandler($originalTemplate);
        $resize350 = new Handlers\ResizeHandler(350, 192, '350x192');
        $save350 = new Handlers\StoreHandler('350x192', $template350);
        $resize480 = new Handlers\ResizeHandler(480, 240, '480x240');
        $save480 = new Handlers\StoreHandler('480x240', $template480);

        $original->setFile($uploadedFile)
            ->setNext($resize350->setFile($uploadedFile))
            ->setNext($save350)
            ->setNext($resize480->setFile($uploadedFile))
            ->setNext($save480);
        
        return $original->handle(null, []);
    }
}