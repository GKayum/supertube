import { Link } from "react-router-dom"
import DotsMenu from "../VideoMenu"

export default function VideoCardLiked({ video, setToast }) {
    return (
        <li className="flex items-center bg-white rounded-xl shadow-sm hover:shadow transition group">
            <Link to={`/video/${video.id}`} className="relative w-64 h-36 bg-gray-200 rounded-lg overflow-hidden block group-hover:ring-2 ring-red-400 transition mr-5">
                <img src={video.preview350} alt={video.title} className="absolute inset-0 w-full h-full object-cover" />
            </Link>

            <div className="flex flex-col flex-1 min-w-0">
                <Link to={`/video/${video.id}`} className="text-lg font-semibold text-gray-900 truncate hover:underline" title={video.title}>
                    {video.title}
                </Link>
                <div className="flex items-center gap-2 mt-2">
                    <Link to={`/channel/${video.user?.id}`} className="text-sm text-gray-700 hover:underline truncate">
                        {video.user?.name}
                    </Link>
                </div>
                <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                    <span>{video.timeAgo}</span>
                    <span className="mx-1">•</span>
                    <span>{video.views ?? 0} просмотров</span>
                </div>
            </div>
            <div className="mx-4">
                <DotsMenu videoId={video.id} setToast={setToast} />
            </div>
        </li>
    )
}