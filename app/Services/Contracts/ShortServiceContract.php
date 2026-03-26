<?php

namespace App\Services\Contracts;

use Illuminate\Support\Collection;

interface ShortServiceContract
{
    public function firstWithRandom(int $firstId, int $limit, ?int $authorId): Collection;
    public function randomBatch(int $limit, array $exclude, ?int $authorId): Collection;
}