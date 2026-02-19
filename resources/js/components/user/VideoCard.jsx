import { useState } from "react";
import { Link } from "react-router-dom";

export default function VideoCard({ video }) {
    const [hovered, setHovered] = useState()

    return (
        <Link to={`/video/${video.id}`} className="block">
            <div 
                key={video.id} 
                className="flex items-center bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
                <div 
                    className="w-[480px] h-[240px] flex-shrink-0 overflow-hidden"
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
                </div>

                <div className="ml-6 py-4 pr-4 flex-1">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{video.title}</h2>

                    <p className="text-gray-600 text-sm">
                        {video.description}
                    </p>
                </div>
            </div>
        </Link>
    )
}