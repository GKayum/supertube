import { useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";

export default function VideoCard({ video }) {
    const [hovered, setHovered] = useState()

    return (
        <div 
            key={video.id} 
            className="flex items-center bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
        >
            <Link
                to={`/video/${video.id}`} 
                className="w-[480px] h-[240px] shrink-0 overflow-hidden group"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {hovered ? (
                    <video 
                        src={video.path}
                        controls
                        autoPlay
                        muted
                        loop
                        playsInline
                        loading="lazy"
                        preload="none"
                        className="w-full h-full object-cover" 
                    />
                ) : (
                    <img 
                        src={video.preview350} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                    />
                )}
            </Link>

            <div className="ml-6 py-4 pr-4 flex-1 min-w-0">
                <Link
                    to={`/video/${video.id}`} 
                    className="text-xl font-semibold text-gray-800 mb-2 block hover:underline truncate"
                    title={video.title}
                >
                    {video.title}
                </Link>

                <div className="flex items-center gap-4 mb-2 flex-wrap">
                    <Link
                        to={`/channel/${video.user?.id ?? 0}`}
                        className="flex items-center gap-4 group shrink-0"
                        title={video.user?.name}
                    >
                        <Avatar user={video.user} />
                        <span className="text-gray-700 text-sm font-medium group-hover:underline truncate">
                            {video.user?.name ?? 'Channel'}
                        </span>
                    </Link>

                    <span className="flex items-center gap-1 text-xs text-gray-500">
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
                        {video.views ?? 0} просмотров
                    </span>

                    <span className="flex items-center gap-1 text-xs text-gray-500">
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
                            <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/>
                            <path d="M12 11h.01"/>
                            <path d="M16 11h.01"/>
                            <path d="M8 11h.01"/>
                        </svg>
                        {video.comments ?? 0} комментариев
                    </span>

                    <span className="flex items-center gap-1 text-xs text-gray-500">
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
                        {video.timeAgo}
                    </span>
                </div>

                <p className="text-gray-600 text-sm line-clamp-6">
                    {video.description}
                </p>
            </div>
        </div>
    )
}