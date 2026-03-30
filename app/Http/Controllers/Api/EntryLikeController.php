<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EntryLike;
use Illuminate\Http\Request;

class EntryLikeController extends Controller
{
    public function like(int $entryId, Request $request) {
        $userId = $request->user()?->id;
        $fingerprint = $request->post('fingerprint');

        if ($userId) {
            $exists = EntryLike::where(['entry_id' => $entryId, 'user_id' => $userId])->exists();

            if ($exists) {
                EntryLike::where(['entry_id' => $entryId, 'user_id' => $userId])->delete();
                return $this->getResponse($entryId);
            }

            EntryLike::create([
                'entry_id' => $entryId,
                'user_id' => $userId,
                'result' => 1,
            ]);
        } else {
            $exists = EntryLike::where(['entry_id' => $entryId, 'fingerprint' => $fingerprint])->exists();

            if ($exists) {
                EntryLike::where(['entry_id' => $entryId, 'fingerprint' => $fingerprint])->delete();
                return $this->getResponse($entryId);
            }

            EntryLike::create([
                'entry_id' => $entryId,
                'fingerprint' => $fingerprint,
                'result' => 1,
            ]);
        }

        return $this->getResponse($entryId);
    }

    public function dislike(int $entryId, Request $request) {
        $userId = $request->user()?->id;
        $fingerprint = $request->post('fingerprint');

        if ($userId) {
            $exists = EntryLike::where(['entry_id' => $entryId, 'user_id' => $userId])->exists();

            if ($exists) {
                EntryLike::where(['entry_id' => $entryId, 'user_id' => $userId])->delete();
                return $this->getResponse($entryId);
            }

            EntryLike::create([
                'entry_id' => $entryId,
                'user_id' => $userId,
                'result' => 0,
            ]);
        } else {
            $exists = EntryLike::where(['entry_id' => $entryId, 'fingerprint' => $fingerprint])->exists();

            if ($exists) {
                EntryLike::where(['entry_id' => $entryId, 'fingerprint' => $fingerprint])->delete();
                return $this->getResponse($entryId);
            }

            EntryLike::create([
                'entry_id' => $entryId,
                'fingerprint' => $fingerprint,
                'result' => 0,
            ]);
        }

        return $this->getResponse($entryId);
    }

    public function list(int $entryId, Request $request) {
        return $this->getResponse($entryId);
    }

    private function getResponse(int $entryId) {
        return response()->json([
            'likes' => EntryLike::where(['entry_id' => $entryId, 'result' => 1])->count() ?? 0,
            'dislikes' => EntryLike::where(['entry_id' => $entryId, 'result' => 0])->count() ?? 0,
        ]);
    }
}
