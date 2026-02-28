<?php

namespace App\Http\Requests;

use App\Enums\VideoStatus;
use Illuminate\Foundation\Http\FormRequest;

class VideoUploadRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:2048',
            'video' => 'required|file|mimetypes:video/mp4,video/avi,video/mpeg,video/quicktime|max:25600',
            'preview' => 'required|file|mimetypes:image/jpeg,image/jpg,image/png,image/webp|max:2048',
            'status' => ['required', 'in:' . implode(',', array_keys(VideoStatus::userAvialable()))]
        ];
    }
}
