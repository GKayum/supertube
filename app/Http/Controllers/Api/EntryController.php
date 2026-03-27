<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEntryRequest;
use App\Http\Resources\EntryResource;
use App\Models\Entry;
use Illuminate\Http\Request;

class EntryController extends Controller
{
    public function store(StoreEntryRequest $request) {
        $data = $request->validated();

        $entry = new Entry($data);
        $entry->user_id = $request->user()->id;

        $entry->save();

        return (new EntryResource($entry))
            ->response()
            ->setStatusCode(201);
    }
}
