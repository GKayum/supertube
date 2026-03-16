import { Link } from "react-router-dom"

export default function PlaylistCard({ playlist, needShowChannel = false }) {
    const { id, title, videoCount, timeAgo, cover, user, firstVideoId } = playlist

    return (
        <div className="group rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition border border-gray-100">
            <Link
                to={`/video/${firstVideoId}?list=${id}`}
                className="relative block w-full aspect-video bg-gray-200 overflow-hidden"
            >
                <img 
                    src={cover}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                />

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />
                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition">
                    <div className="w-full bg-white/95 text-gray-900 text-sm font-medium rounded-md py-2 text-center">
                        ▶ Смотреть плейлист
                    </div>
                </div>

                <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-xs font-semibold">
                    {videoCount} видео
                </div>
            </Link>

            <div className="p-3">
                <Link
                    to={`/video/${firstVideoId}?list=${id}`}
                    className="block text-base font-semibold text-gray-900 leading-snug line-clamp-2 hover:text-red-600 transition"
                    title={title}
                >
                    {title}
                </Link>

                <div className="mt-2 flex items-start gap-3">
                    {needShowChannel && (
                        <Link to={`/channel/${user.channel?.id ?? 0}`} className="shrink-0">
                            <img 
                                src={user.channel?.avatar}
                                alt={user.channel?.title}
                                className="w-9 h-9 rounded-full object-cover border border-gray-200"
                                loading="lazy"
                            />
                        </Link>
                    )}

                    <div className="min-w-0 flex-1">
                        {needShowChannel && (
                            <Link
                                to={`/channel/${user.channel?.id ?? 0}`}
                                className="block text-sm text-gray-700 font-medium truncate hover:underline"
                                title={user.channel?.title}
                            >
                                {user.channel?.title}
                            </Link>
                        )}

                        <div className="text-xs text-gray-500 mt-0.5">
                            Обновлён {timeAgo}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}