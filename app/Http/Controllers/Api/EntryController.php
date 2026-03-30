<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEntryRequest;
use App\Http\Resources\EntryResource;
use App\Models\Entry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class EntryController extends Controller
{
    public function store(StoreEntryRequest $request) {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
            $imagePath = $image->storeAs('entries', $imageName, 'public');
            $data['image'] = $imagePath;
        }

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

        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($entry->image && Storage::disk('public')->exists($entry->image)) {
                Storage::disk('public')->delete($entry->image);
            }

            $image = $request->file('image');
            $imageName = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
            $imagePath = $image->storeAs('entries', $imageName, 'public');
            $data['image'] = $imagePath;
        }

        $entry->fill($data);
        $entry->save();

        // (fresh()) для получения нового экземпляра той же модели с актуальными данными напрямую из БД
        return (new EntryResource($entry->fresh()))->response();
    }

    public function showProfile(Request $request, Entry $entry) {
        if ($request->user()->id !== $entry->user_id) {
            abort(403);
        }

        return (new EntryResource($entry))->response();
    }

    public function indexHome(Request $request) {
        return EntryResource::collection(
            Entry::query()->latest('id')->limit(4)->get()
        );
    }

    public function show(Entry $entry) {
        if ($entry->status !== 'published') {
            abort(404);
        }

        $entry->load(['user.channel']);

        return (new EntryResource($entry))->response();
    }
}
