<?php

namespace App\Services\Contracts;

interface CoverChannelServiceContract
{
    public function process($uploadedFile): array;
}