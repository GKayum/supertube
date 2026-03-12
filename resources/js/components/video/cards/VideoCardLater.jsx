import { Link } from "react-router-dom"
import DotsMenu from "../VideoMenu"
import { Draggable } from "@hello-pangea/dnd"

export default function VideoCardLater({ video, idx, setToast, setVideos }) {
    return (
        <Draggable key={video.id} draggableId={String(video.id)} index={idx}>
            {(provided, snapshot) => (
                <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`flex items-center bg-white rounded-xl shadow-sm hover:shadow transition group ${snapshot.isDragging ? 'ring-2 ring-red-300' : ''}`}
                >
                    <span
                        {...provided.dragHandleProps}
                        className="shrink-0 p-3 cursor-move text-gray-400 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                        </svg>
                    </span>

                    <Link
                        to={`/video/${video.id}`}
                        className="relative w-64 h-36 bg-gray-200 rounded-lg overflow-hidden block group-hover:ring-2 ring-red-400 transition mr-5"
                    >
                        <img src={video.preview480} alt={video.title} className="absolute inset-0 w-full h-full object-cover" />
                    </Link>

                    <div className="flex flex-col flex-1 min-w-0">
                        <Link
                            to={`/video/${video.id}`}
                            className="text-lg font-semibold text-gray-900 truncate hover:underline"
                            title={video.title}
                        >
                            {video.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-2">
                            <Link
                                to={`/channel/${video.user?.id}`}
                                className="text-sm text-gray-700 hover:underline truncate"
                            >
                                {video.user?.name}
                            </Link>
                        </div>
                    </div>
                    <div className="ml-4 mr-4">
                        <DotsMenu videoId={video.id} setToast={setToast} inWatchLater={true} setVideos={setVideos} />
                    </div>
                </li>
            )}
        </Draggable>
    )
}