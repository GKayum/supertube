import { Link } from "react-router-dom"

export default function PlaylistMyCard({ playlist }) {
    const pl = playlist || {}

    return (
        <div className="flex items-center bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <Link
                to={`/video/${pl.firstVideoId}?list=${pl.id}`}
                className="w-[320px] h-[180px] shrink-0 overflow-hidden block group"
                title={pl.title}
            >
                {pl.cover ? (
                    <img 
                        src={pl.cover} 
                        alt={pl.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 grid place-items-center text-gray-400">
                        {/* SVG */}
                    </div>
                )}
            </Link>

            <div className="ml-6 py-4 pr-4 flex-1 min-w-0">
                <Link
                    to={`/video/${pl.firstVideoId}?list=${pl.id}`}
                    className="text-lg font-semibold text-gray-800 mb-2 block hover:underline truncate"
                    title={pl.title}
                >
                    {pl.title}
                </Link>

                {/* Счетчики */}
                <div className="flex items-center gap-4 mb-2 flex-wrap text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                        <svg
                            className="w-4 h-4"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        >
                            <rect width="18" height="18" x="3" y="3" rx="2" />
                            <path d="M7 7v10" />
                            <path d="M11 7v10" />
                            <path d="m15 7 2 10" />
                        </svg>
                        {pl.videoCount ?? 0} видео
                    </span>

                    <span className="flex items-center gap-1">
                        <svg 
                            className="w-4 h-4"
                            fill="none" 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor" 
                            strokeWidth="1.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                        >
                            <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                        {pl.videosViews ?? 0} просмотров видео
                    </span>

                    <span className="flex items-center gap-1">
                        <svg
                            className="w-4 h-4"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                        >
                            <path d="M21 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2" />
                            <path d="M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2" />
                            <circle cx="12" cy="12" r="1" />
                            <path d="M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0" />
                        </svg>
                        {pl.views ?? 0} просмотров плейлиста
                    </span>

                    {pl.timeAgo && (
                        <span className="flex items-center gap-1">
                            <svg 
                                width="24" 
                                height="24" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="1.5" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className="w-4 h-4"
                            >
                                <path d="M12 6v6l4 2"/>
                                <circle cx="12" cy="12" r="10"/>
                            </svg>
                            {pl.timeAgo}
                        </span>
                    )}
                </div>

                {pl.description && (
                    <p className="text-gray-600 text-sm line-clamp-2">
                        {pl.description}
                    </p>
                )}

                <div className="mt-3">
                    <Link
                        to={`/playlist/${pl.id}`}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-blue-600 transition"
                        title="Редактировать"
                    >
                        <svg
                            className="w-4 h-4"
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth={2} 
                        >
                            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
                            <path d="m15 5 4 4"/>
                        </svg>
                        <span>Редактировать</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}