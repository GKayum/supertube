import { useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "../../user/Avatar";
import DurationBadge from "../DurationBadge";

export default function SearchCard({ video }) {
    const [hovered, setHovered] = useState(false)

    return (
        <div
            key={`block-${video.id}`} 
            className="flex gap-4 w-full h-[150px] max-w-3xl bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden items-stretch"
        >
            <Link
                to={`/video/${video.id}`}
                className="group shrink-0 relative"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <div className="relative w-[270px] h-[150px] bg-gray-200 overflow-hidden">
                    {hovered ? (
                        <video 
                            src={video.path}
                            autoPlay
                            muted
                            loop
                            playsInline
                            loading="lazy"
                            preload="none"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
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
                </div>
            </Link>

            <div className="flex flex-col justify-between flex-1 p-4 min-w-0 h-full">
                <Link
                    to={`/video/${video.id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-blue-600 line-clamp-2"
                    title={video.title}
                >
                    {video.title}
                </Link>

                <div className="flex items-center mt-1 mb-2 space-x-2">
                    <Avatar user={video.user} />
                    <span className="text-sm text-gray-700 font-medium">
                        {video.user.name}
                    </span>
                    <span className="text-xs text-gray-400">
                        {video.views} просмотров • {video.timeAgo}
                    </span>
                </div>

                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {video.description}
                </p>
            </div>
        </div>
    )
}