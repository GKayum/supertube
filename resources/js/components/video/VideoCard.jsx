import { useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "../user/Avatar";

export default function VideoCard({ video }) {
    const [hovered, setHovered] = useState()

    return (
        <div 
            className="w-[258px] bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >

            <Link to={`/video/${video.id}`}>
                <div className="relative w-full h-[145px] bg-gray-200 overflow-hidden">
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
                            className="absolute inset-0 w-full h-full object-cover" 
                        />
                    ) : (
                        <img 
                            src={video.preview350} 
                            alt={video.title}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    )}
                </div>
            </Link>

            <div className="grid grid-cols-6 items-start gap-3 p-3 pb-2">
                <div className="block w-8 h-8">
                    <Avatar user={video.user} />
                </div>

                <div className="flex flex-col min-w-0 col-span-5">
                    <Link
                        to={`/video/${video.id}`}
                        className="block font-semibold text-base text-gray-900 leading-snug truncate hover:underline"
                        title={video.title}
                    >
                        {video.title}
                    </Link>
                    <Link
                        to={`/channel/${video.user?.id ?? 0}`}
                        className="block text-sm text-gray-700 font-medium truncate hover:underline mt-0"
                        title={video.user?.name}
                    >
                        {video.user?.name ?? 'Channel'}
                    </Link>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-400 mt-1 col-span-6">
                    <svg 
                        className="w-4 h-4 inline-block mr-1"
                        fill="none" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                    >
                        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
                        <circle cx="12" cy="12" r="3"/>
                    </svg>
                    <span>
                        {video.views ?? 0} просмотров
                    </span>
                    <span className="mx-1">•</span>
                    <span>{video.timeAgo}</span>
                </div>
            </div>
        </div>
    )
}