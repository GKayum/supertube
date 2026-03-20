import { useState } from "react";
import { Link } from "react-router-dom";
import DurationBadge from "../DurationBadge";

export default function ChannelVideoCard({ video }) {
    const [hovered, setHovered] = useState(false)

    return (
        <div 
            className="rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition border border-gray-100 group"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <Link
                to={`/video/${video.id}`}
                className="block relative w-full aspect-video bg-gray-200 overflow-hidden"
                tabIndex={0}
            >
                {hovered ? (
                    <video 
                        src={video.path}
                        autoPlay
                        muted
                        loop
                        playsInline
                        loading="lazy"
                        preload="none"
                        className="absolute inset-0 w-full object-cover"
                    ></video>
                ) : (
                    <>
                    <img 
                        src={video.preview350}
                        alt={video.title}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <DurationBadge seconds={video.duration} />
                    </>
                )}
            </Link>

            <div className="px-4 py-3">
                <Link
                    to={`/video/${video.id}`}
                    className="block focus:outline-none"
                    title={video.title}
                >
                    {video.title}
                </Link>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                    <svg 
                        className="w-4 h-4 mr-1 text-gray-400"
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
                    <span>{video.views ?? 0} просмотров</span>
                    <span className="mx-1">•</span>
                    <span>{video.timeAgo}</span>
                </div>
            </div>
        </div>
    )
}