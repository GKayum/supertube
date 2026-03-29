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

    public function index(Request $request) {
        $entries = Entry::query()
            ->where('user_id', $request->user()->id)
            ->latest('id')
            ->paginate(12);

        return EntryResource::collection($entries);
    }

    public function update(StoreEntryRequest $request, Entry $entry) {
        if ($request->user()->id !== $entry->user_id) {
            abort(403);
        }

        $entry->fill($request->validated());
        $entry->save();

        // (fresh()) для получения нового экземпляра той же модели с актуальными данными напрямую из БД
        return (new EntryResource($entry->fresh()))->response();
    }

    public function show(Request $request, Entry $entry) {
        if ($request->user()->id !== $entry->user_id) {
            abort(403);
        }

        return (new EntryResource($entry))->response();
    }
}
