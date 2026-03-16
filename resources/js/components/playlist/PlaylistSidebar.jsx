export default function PlaylistSidebar({ playlist, currentVideoId, loading, onSelectVideo }) {
    return (
        <div>
            {loading ? (
                <p className="text-gray-500">Загрузка плейлиста...</p>
            ) : (
                <div className="bg-gray-900 text-white rounded-lg overflow-hidden shadow-lg mb-4">
                    {/* Заголовок плейлиста */}
                    <div className="px-4 py-3 border-b border-gray-800">
                        <h3 className="text-lg font-semibold">{playlist.title}</h3>
                        <p className="text-sm text-gray-400">{playlist.videos.length} видео</p>
                    </div>

                    {/* Список видео */}
                    <div className="max-h-[65vh] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-500"
                    >
                        {playlist.videos.map((v, index) => (
                            <button
                                key={v.id}
                                onClick={() => onSelectVideo(v.id)}
                                className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors cursor-pointer ${
                                    v.id === currentVideoId
                                        ? 'bg-gray-800 text-blue-400 font-medium'
                                        : 'hover:bg-gray-800 text-gray-300'
                                }`}
                            >
                                {/* Номер */}
                                <span className="text-sm text-gray-400 w-6 shrink-0">{index + 1}</span>

                                {/* Превью */}
                                <div className="w-20 h-12 shrink-0 bg-black rounded overflow-hidden">
                                    <img 
                                        src={v.preview350} 
                                        alt={v.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Текст */}
                                <div className="flex-1 truncate">
                                    <p className="text-sm truncate">{v.title}</p>
                                    <p className="text-xs text-gray-400">{v.user?.name}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}