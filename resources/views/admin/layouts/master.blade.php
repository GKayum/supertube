<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>SuperTube | Админ-панель</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    @stack('style')
</head>
<body>
    <div class="container-fluid" style="height: 100%;">
        <div class="row" style="height: 100%;"> 
            <nav id="sidebar" class="p-3 bg-dark d-flex flex-column col-2" style="height: 100vh;"> 
                @include('admin.layouts.sidebar')
                <form action="{{ route('admin.logout') }}" method="POST" style="margin-top: auto;">
                    @csrf
                    <button type="submit" class="btn btn-danger w-100">Выйти</button>
                </form>
            </nav> 
            <div id="content" class="col" style="height: 100vh; overflow-y: auto;"> 
                @include('admin.layouts.nav') 
                <div class="container-fluid mt-4 mb-4"> 
                    @if(Session::has('global')) 
                        <div class="alert alert-success"> 
                            {{ Session::get('global') }}
                        </div>
                    @endif
                    @yield('content')
                </div>
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
@stack('scripts')
</body>
</html>