import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../../services/api";

export default function MyEntries({ authorId }) {
    const [items, setItems] = useState([])
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1 })
    const [loading, setLoading] = useState(true)
    const [params, setParams] = useSearchParams()

    const page = Number(params.get('page') || 1)

    useEffect(() => {
        (async () => {
            setLoading(true)

            try {
                const { data } = await api.get('/api/v1/user/entries', { params: { page } })
                
                setItems(data.data)
                setMeta({
                    current_page: data.meta.current_page,
                    last_page: data.meta.last_page,
                })
            } finally {
                setLoading(false)
            }
        })()
    }, [authorId, page])

    if (loading) return <div className="py-10 text-center text-zinc-500">Загрузка...</div>

    return (
        <div className="space-y-4">
            {items.length === 0 && (
                <div className="rounded-xl border border-dashed p-6 text-center text-zinc-500">
                    Пока нет записей
                </div>
            )}

            {items.map((entry) => (
                <article
                    key={entry.id}
                    className="rounded-2xl border border-zinc-200 bg-white/90 p-4 shadow-sm"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold">{entry.title}</h3>
                            <p className="mt-1 line-clamp-3 text-sm text-zinc-600">
                                {entry.description}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs">
                                <StatusBadge status={entry.status} />
                                <span className="inline-flex items-center gap-1">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>
                                        <path d="M7 10v12"/>
                                    </svg>
                                    {entry.likes}
                                </span>
                                <span className="inline-flex items-center gap-1">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/>
                                        <path d="M17 14V2"/>
                                    </svg>
                                    {entry.dislikes}
                                </span>
                                <span className="inline-flex items-center gap-1">
                                    <img src="/icons/comment-dark-sm.svg" />
                                    {entry.commentsCount}
                                </span>
                                <span className="inline-flex items-center gap-1">
                                    <Link
                                        to={`/entry/${entry.id}`}
                                        className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 hover:text-blue-600 rounded-md transition"
                                        title="Редактироваться"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
                                            <path d="m15 5 4 4"/>
                                        </svg>
                                        <span>Редактировать</span>
                                    </Link>
                                </span>
                            </div>
                        </div>
                    </div>
                </article>
            ))}

            <Pagination 
                current={meta.current_page}
                last={meta.last_page}
                onChange={(p) => setParams({ page: String(p) })}
            />
        </div>
    )
}

function StatusBadge({ status }) {
    const map = {
        draft: 'bg-amber-100 text-amber-800',
        published: 'bg-emerald-100 text-emerald-800',
    }
    return (
        <span className={'rounded-md px-2 py-0.5 ' + (map[status] ?? map.hidden)}>
            {status}
        </span>
    )
}

function Pagination({ current, last, onChange }) {
    if (last <= 1) return null

    return (
        <div className="mt-2 flex items-center justify-center gap-2">
            <button
                disabled={current <= 1}
                onClick={() => onChange(current - 1)}
                className="rounded-lg border px-3 py-1 text-sm disabled:opacity-50"
            >
                Назад
            </button>
            <span className="text-sm text-zinc-600">
                {current} / {last}
            </span>
            <button
                disabled={current >= last}
                onClick={() => onChange(current + 1)}
                className="rounded-lg border px-3 py-1 text-sm disabled:opacity-50"
            >
                Вперёд
            </button>
        </div>
    )
}