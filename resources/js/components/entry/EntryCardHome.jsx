import { Link } from "react-router-dom";

export default function EntryCardHome({ entry }) {
    return (
        <article className="rounded-2xl border border-zinc-200 bg-white/90 p-4 shadow-sm">
            <div>
                <Link
                    to={`/channel/${entry.channelId}`}
                    className="font-medium hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200"
                >
                    {entry.channelTitle}
                </Link>
                <div className="mt-0.5 text-xs text-zinc-500">
                    {entry.timeAgo}
                </div>
            </div>

            {entry.title && (
                <h3 className="mt-1 text-base font-semibold leading-6 line-clamp-1">{entry.title}</h3>
            )}

            {entry.description && (
                <p className="mt-2 whitespace-pre-wrap text-[15px] leading-6 text-zinc-800 line-clamp-4">
                    {entry.description}
                </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <div className="inline-flex items-center gap-1 rounded-xl px-2 py-1 ring-1 ring-zinc-200 hover:opacity-80 cursor-pointer">
                    <img src="/icons/like-dark-sm.svg" />
                    <span>{entry.likes ?? 0}</span>
                </div>

                <div className="inline-flex items-center gap-1 rounded-xl px-2 py-1 ring-1 ring-zinc-200 hover:opacity-80 cursor-pointer">
                    <img src="/icons/dislike-dark-sm.svg" />
                    <span>{entry.dislikes ?? 0}</span>
                </div>

                <a href="#" className="inline-flex items-center gap-1 rounded-xl px-2 py-1 ring-1 ring-zinc-200 hover:opacity-80">
                    <img src="/icons/comment-dark-sm.svg" />
                    <span>{entry.commentsCount ?? 0}</span>
                </a>
            </div>
        </article>
    )
}