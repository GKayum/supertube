import { useRef } from "react";
import { Link } from "react-router-dom";
import VideoMenu from "../video/VideoMenu";

export default function ShortCard({ id, title, coverUrl, videoUrl, views, source = 'home' }) {
    const videoRef = useRef(null)

    const playPreview = () => {
        if (videoRef.current) {
            videoRef.current.currentTime = 0
            videoRef.current.play().catch(() => {})
        }
    }
    const stopPreview = () => {
        if (videoRef.current) {
            videoRef.current.pause()
            videoRef.current.currentTime = 0
        }
    }

    return (
        <div
            key={`short-${id}`} 
            className="group isolate relative flex aspect-9/16 flex-col gap-2 w-[180px] min-w-0"
            onMouseEnter={playPreview}
            onMouseLeave={stopPreview}
            onFocus={playPreview}
            onBlur={stopPreview}
        >
            <Link to={`/shorts/${id}?list=${source}`} className="block overflow-hidden rounded-xl bg-black shadow">
                <div className="relative z-0 aspect-9/16">
                    <img 
                        src={coverUrl}
                        alt={title}
                        className={
                            ["absolute inset-0 h-full w-full object-cover transition-opacity duration-200",
                            videoUrl ? "opacity-100 group-hover:opacity-0" : ''].join(" ")}
                        loading="lazy"
                    />
                    {videoUrl && (
                        <video
                            ref={videoRef}
                            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity group-hover:opacity-100" 
                            src={videoUrl}
                            muted
                            playsInline
                            preload="none"
                            loop
                            aria-hidden="true"
                        />
                    )}
                </div>
            </Link>
            
            <div className="relative flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1 z-20">
                    <Link to={`/shorts/${id}?list=${source}`} className="block">
                        <h3
                            className="text-sm font-medium leading-snug text-zinc-900 text-dark line-clamp-2"
                            style={{
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                            }}
                            title={title}
                        >
                            {title}
                        </h3>
                    </Link>
                    <div className="mt-0.5 text-xs text-zinc-600 text-dark">
                        {typeof views === "number" ? `${views} просмотров` : ""}
                    </div>
                </div>

                <div className="relative z-20 flex items-start justify-end">
                    <VideoMenu videoId={id} setToast={() => {}} forShort={true} />
                </div>
            </div>
        </div>
    )
}