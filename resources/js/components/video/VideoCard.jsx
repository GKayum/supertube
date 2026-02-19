import { useState } from "react";
import { Link } from "react-router-dom";

export default function VideoCard({ video }) {
    const [hovered, setHovered] = useState()

    return (
        <Link to={`/video/${video.id}`}>
            <div 
                className="w-[258px] bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >

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

                <div className="flex flex-row items-start gap-3 p-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-medium text-gray-900 truncate">{video.title}</h3>
                        <div className="text-xs text-gray-400 mt-0.5">
                            {video.views ?? 0} просмотров &middot;
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}