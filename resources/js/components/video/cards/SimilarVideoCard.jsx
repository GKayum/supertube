import { Link } from "react-router-dom";

export default function SimilarVideoCard({ video }) {
    return (
        <Link to={`/video/${video.id}`}>
            <div className="flex space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded">
                <img src={video.preview350} alt="thumb" className="w-35 h-19 object-cover rounded" />
                <div className="flex flex-col">
                    <p className="font-medium text-gray-800 leading-snug line-clamp-2">
                        {video.title}
                    </p>
                    <p className="text-sm text-gray-500">
                        {video.user.name} • {video.views} просмотров
                    </p>
                </div>
            </div>
        </Link>
    )
}