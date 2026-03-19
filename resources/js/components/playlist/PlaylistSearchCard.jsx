import { useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "../user/Avatar";

/** 
 * Входные данные:
 * playlist = {
 *  id, title, description, cover, videoCount, timeAgo,
 *  user: { id, name, avatar }
 * }
*/
export default function PlaylistSearchCard({ playlist }) {
    const [hovered, setHovered] = useState(false)

    return (
        <div className="flex items-center bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <Link
                to={`/video/${playlist.firstVideoId}?list=${playlist.id}`}
                className="w-[480px] h-[240px] shrink-0 overflow-hidden block group relative"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                title={playlist.title}
            >
                <img 
                    src={playlist.cover} 
                    alt={playlist.title}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                />

                <span className="absolute top-2 left-2 text-[11px] uppercase tracking-wide bg-black/70 text-white px-2 py-1 rounded">
                    Плейлист
                </span>

                <span className="absolute bottom-2 right-2 text-xs bg-black/70 text-white px-2 py-1 rounded">
                    {playlist.videoCount ?? 0} видео
                </span>

                <div className={`absolute inset-0 transition ${hovered ? 'bg-black/10' : 'bg-transparent'}`}/>
            </Link>

            <div className="ml-6 py-4 pr-4 flex-1 min-w-0">
                <Link
                    to={`/video/${playlist.firstVideoId}?list=${playlist.id}`}
                    className="text-xl font-semibold text-gray-900 mb-2 block hover:underline truncate"
                    title={playlist.title}
                >
                    {playlist.title}
                </Link>

                <div className="flex items-center gap-4 mb-2 flex-wrap">
                    <div className="flex items-center gap-2 shrink-0">
                        <Avatar user={playlist.user} />
                        <Link
                            to={`/channel/${playlist.user?.id ?? 0}`}
                            className="text-gray-700 text-sm font-medium hover:underline truncate"
                            title={playlist.user?.name}
                        >
                            {playlist.user?.name ?? 'Канал'}
                        </Link>
                    </div>

                    {/* Разделитель */}
                    <span className="text-gray-300 select-none">•</span>

                    <span className="flex items-center gap-1 text-xs text-gray-600">
                        {/* SVG */}
                        {playlist.videoCount ?? 0} видео
                    </span>

                    {/* Разделитель */}
                    <span className="text-gray-300 select-none">•</span>

                    <span className="flex items-center gap-1 text-xs text-gray-500">
                        {/* SVG */}
                        {playlist.timeAgo}
                    </span>
                </div>

                {playlist.description && (
                    <p className="text-gray-600 text-sm line-clamp-2">
                        {playlist.description}
                    </p>
                )}

                <div className="mt-3">
                    <Link
                        to={`/video/${playlist.firstVideoId}?list=${playlist.id}`}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition"
                    >
                        {/* SVG */}
                        Смотреть плейлист
                    </Link>
                </div>
            </div>
        </div>
    )
}