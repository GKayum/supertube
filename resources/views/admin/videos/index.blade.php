@extends('admin.layouts.master')

@section('content')
    <div class="d-flex justify-content-between align-items-center">
        <h1 style="font-size: 1.875rem;">Видео</h1> 
    </div>
    <table class="table mt-4">
        <thead>
            <tr>
                <th>#</th>
                <th>Название</th>
                <th>Статус</th>
                <th>Действия</th>
            </tr>
        </thead>
        <tbody> 
        @foreach($videos as $video) 
            <tr>
                <td>{{ $video->id }}</td>
                <td>
                    <a href="{{ route('videos.show', ['video' => $video->id]) }}" class="text-dark link-primary link-offset-2 link-underline-opacity-0 link-underline-opacity-100-hover">{{ $video->title }}</a>
                </td>
                <td>
                    <button class="btn btn-sm btn-{{ 
                        $video->status === 'published' 
                            ? 'primary' : 
                                ($video->status === 'blocked' ? 'danger' : 
                                    ($video->status === 'private' ? 'secondary' : 'light')) }}"
                    >{{ $video->status }}</button>
                </td>
                <td>
                    <form action="{{ route('videos.update', ['video' => $video->id]) }}" method="POST" class="d-flex gap-3" style="width: max-content;">
                        @csrf
                        <select name="status" class="form-control">
                            <option value="blocked" {{ $video->status === 'blocked' ? 'selected' : '' }}>Заблокировано</option>
                            <option value="published" {{ $video->status === 'published' ? 'selected' : '' }}>Опубликовано</option>
                            <option value="private" {{ $video->status === 'private' ? 'selected' : '' }}>Приватное</option>
                        </select>
                        <input type="submit" class="btn btn-sm btn-info" value="Изменить">
                    </form>
                </td>
            </tr> 
        @endforeach 
        </tbody>
    </table> {{ $videos->links() }} 
@endsection