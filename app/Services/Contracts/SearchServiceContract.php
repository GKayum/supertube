<?php

namespace App\Services\Contracts;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

interface SearchServiceContract
{
    public function filter(Request $request): JsonResource;
}