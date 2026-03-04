import { Link } from "react-router-dom";
import Avatar from '../../user/Avatar'

export default function HistoryCard({ video }) {
    return (
        <div className="flex bg-white rounded-lg shadow hover:shadow-md overflow-hidden transition">
            <Link to={`/video/${video.id}`} className="shrink-0 w-32 h-28 bg">
                <img 
                    src={video.preview350}
                    alt={video.title}
                    className="w-full h-full object-cover"
                />
            </Link>
            <div className="flex-1 flex flex-col justify-between pl-4 py-4 min-w-0">
                <Link
                    to={`/video/${video.id}`}
                    className="font-semibold text-base text-gray-900 truncate hover:underline"
                    title={video.title}
                >
                    {video.title}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                    <Avatar user={video.user} size={6} />
                    <Link
                        to={`/channel/${video.user.id}`}
                        className="text-sm text-gray-600 hover:underline truncate"
                        title={video.title}
                    >
                        {video.user.name}
                    </Link>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                    {video.views ?? 0} просмотров • {video.timeAgo}
                </div>
            </div>
        </div>
    )
}