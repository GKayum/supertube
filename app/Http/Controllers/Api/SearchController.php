<?php

namespace App\Http\Controllers\Api;

use App\Enums\SearchFilter;
use App\Http\Controllers\Controller;
use App\Services\Contracts\SearchServiceContract;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function __construct(
        private readonly SearchServiceContract $service,
    ) {

    }

    public function filter(Request $request) {
        return response()->json(
            $this->service->filter($request)
        );
    }

    public function filters(): JsonResponse
    {
        return response()->json(SearchFilter::lists());
    }
}
