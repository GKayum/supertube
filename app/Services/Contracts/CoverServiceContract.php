<?php

namespace App\Services\Contracts;

interface CoverServiceContract
{
    public function process($uploadedFile): array;

    public function processShort($uploadedFile): array;
}