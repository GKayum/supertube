<ul class="nav flex-column">
    <li class="nav-item">
        <a class="nav-link text-white rounded {{ request()->path() === 'admin' ? 'bg-secondary fw-semibold' : '' }}" href="{{ route('admin.home') }}">Главная</a>
    </li>
    <li class="nav-item"> 
        <a class="nav-link text-white rounded {{ request()->path() === 'admin/videos' ? 'bg-secondary fw-semibold' : '' }}" href="{{ route('videos.list') }}">Видео</a> 
    </li>
</ul>