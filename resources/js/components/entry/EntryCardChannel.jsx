import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEntryLikes } from "../../hooks/useEntryLikes";

export default function EntryCardChannel({
    entryId,
    avatarUrl,
    channelName,
    channelUrl,
    timeAgo,
    title,
    text,
    initialExpanded = false,
    maxCollapsedChars = 120,
    likes = 0,
    dislikes = 0,
    commentsCount = 0,
    onLike,
    onDislike,
    className = '',
}) {
    const [expanded, setExpanded] = useState(initialExpanded)
    const { likesCount, dislikesCount, isLiking, handleLike, handleDislike } = useEntryLikes(likes, dislikes)
    const navigate = useNavigate()

    const isLong = (text ?? '').length > maxCollapsedChars
    const visibleText = expanded || !isLong
        ? text
        : (text ?? '').slice(0, maxCollapsedChars).replace(/\s+\S*$/, '') + '...' // (/\s+\S*$/) → поиск последнего слова + пробел (' пример')

    const handleEntryClick = () => {
        if (entryId) {
            navigate(`/blog/${entryId}`)
        }
    }

    const onLikeClick = async (e) => {
        const response = await handleLike(entryId, e)
        if (onLike) onLike(response)
    }

    const onDislikeClick = async (e) => {
        const response = await handleDislike(entryId, e)
        if (onDislike) onDislike(response)
    }
        
    return (
        <article
            className={'flex gap-3 rounded-2xl border border-zinc-200 bg-white/90 p-4 shadow-sm ' + className}
        >
            {/* Левая колонка (аватар) */}
            <div className="w-12 shrink-0">
                <a href={channelUrl} className="block" aria-label={channelName}>
                    <img
                        src={avatarUrl}
                        alt=""
                        className="h-12 w-12 rounded-full object-cover ring-1 ring-zinc-200"
                        loading="lazy"
                    />
                </a>
            </div>

            {/* Правая колонка */}
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 text-sm">
                    <a 
                        href={channelUrl}
                        className="font-medium hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:" // focus-visible: ...
                    >
                        {channelName}
                    </a>
                    <span className="text-zinc-500">• {timeAgo}</span>
                </div>

                {title && (
                    <h3 
                        className="mt-1 text-base font-semibold leading-6 cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={handleEntryClick}
                    >
                        {title}
                    </h3>
                )}

                {text && (
                    <div className="relative">
                        <p className="mt-2 whitespace-pre-wrap text-[15px] leading-6 text-zinc-800">
                            {visibleText}
                        </p>

                        {isLong && (
                            <button
                                type="button"
                                onClick={() => setExpanded((s) => !s)}
                                className="mt-2 text-sm font-medium text-indigo-600 hover:opacity-80 focus:outline-none cursor-pointer"
                            >
                                {expanded ? 'Свернуть' : 'Развернуть'}
                            </button>
                        )}
                    </div>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                    <button
                        type="button"
                        onClick={onLikeClick}
                        disabled={isLiking}
                        aria-pressed="false"
                        className="inline-flex items-center gap-1 rounded-xl px-2 py-1 ring-1 ring-zinc-200 hover:opacity-80 cursor-pointer"
                    >
                        <img src="/icons/like-dark-sm.svg" />
                        <span>{likesCount}</span>
                    </button>

                    <button
                        type="button"
                        onClick={onDislikeClick}
                        disabled={isLiking}
                        aria-pressed="false"
                        className="inline-flex items-center gap-1 rounded-xl px-2 py-1 ring-1 ring-zinc-200 hover:opacity-80 cursor-pointer"
                    >
                        <img src="/icons/dislike-dark-sm.svg" />
                        <span>{dislikesCount}</span>
                    </button>

                    <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-xl px-2 py-1 ring-1 ring-zinc-200 hover:opacity-80 cursor-pointer"
                    >
                        <img src="/icons/comment-dark-sm.svg" />
                        <span>{commentsCount}</span>
                    </button>
                </div>
            </div>
        </article>
    )
}