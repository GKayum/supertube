import { useCallback, useEffect, useState } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext"

export default function CommentPanel({ videoId, isOpen, onClose }) {
    const [loading, setLoading] = useState(false)
    const [posting, setPosting] = useState(false)
    const [comments, setComments] = useState([])
    const [text, setText] = useState('')
    const { user } = useAuth()

    const fetchComments = useCallback(async () => {
        if (!videoId) return

        try {
            setLoading(true)
            const { data } = await api.get(`/api/v1/videos/${videoId}/comments`)

            setComments(data?.comments || [])
        } catch (error) {
            console.error('Не удалось загрузить комментарии', error)
        } finally {
            setLoading(false)
        }
    }, [videoId])

    useEffect(() => {
        if (isOpen) fetchComments()
    }, [isOpen, fetchComments])

    useEffect(() => {
        if (!isOpen) return

        const onKey = (e) => e.key === 'Escape' && onClose()
        window.addEventListener('keydown', onKey)

        return () => window.removeEventListener('keydown', onKey)
    }, [isOpen, onClose])

    const submit = async (e) => {
        e?.preventDefault?.()

        if (!text.trim() || !videoId) return

        try {
            setPosting(true)
            const { data } = await api.post(`/api/v1/videos/${videoId}/comments`, { body: text.trim() })
            setComments((prev) => [data?.data || data, ...prev])
            setText('')
        } catch (error) {
            console.error('Не удалось отправить комментарий', error)
        } finally {
            setPosting(false)
        }
    }

    return (
        <>
            <div
                onClick={onClose}
                className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
            />
            <aside
                className={`fixed right-0 top-0 z-50 h-dvh w-full max-w-md bg-zinc-950 text-white shadow-2xl
                    transition-transform duration-300 ease-out flex flex-col
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
                role="dialog" aria-label="Комментарий"
            >
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                    <div className="font-semibold">Комментарии</div>
                    <button onClick={onClose} className="text-white/70 hover:text-white" aria-label="Закрыть">x</button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                    {loading ? (
                        <div className="text-white/70 mt-4">Загрузка...</div>
                    ) : !videoId ? (
                        <div className="text-white/70 mt-4">Видео не выбрано</div>
                    ) : comments.length === 0 ? (
                        <div className="text-white/70 mt-4">Пока нет комментариев</div>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} className="flex items-start gap-3">
                                {comment.user?.avatar ? (
                                    <img src={comment.user.avatar} alt={comment.user?.name || 'User'} className="h-8 w-8 rounded-full object-cover bg-white/20 text-sm"/>
                                ) : (
                                    <div className="h-8 w-8 rounded-full object-cover bg-white/20 flex items-center justify-center text-sm">😊</div>
                                )}
                                <div className="min-w-0">
                                    <div className="text-sm font-medium truncate">{comment.user?.name || 'Пользователь'}</div>
                                    <div className="text-sm text-white/90 whitespace-pre-wrap break-words">{comment.body}</div>
                                    {comment.created_at && <div className="text-xs text-white/50 mt-1">{new Date(comment.created_at).toLocaleString()}</div>}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="border-t border-white/10 p-3">
                    {user ? (
                        <form onSubmit={submit} className="flex items-end gap-2">
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Введите комментарий..."
                                className="flex-1 resize-none rounded-xl bg-zinc-900 outline-none p-3 text-sm placeholder-white/40"
                                rows={1}
                                onInput={(e) => {
                                    const ta = e.currentTarget
                                    ta.style.height = "auto"
                                    ta.style.height = Math.min(ta.scrollHeight, 6 * 24) + "px"
                                }} 
                            />
                            <button
                                type="submit"
                                disabled={posting || !text.trim()}
                                className="px-3 py-2 rounded-xl bg-white text-black text-sm font-semibold disabled:opacity-50"
                            >
                                Отправить
                            </button>
                        </form>
                    ) : (
                        <div className="text-sm text-white/70">Чтобы написать комментарий, <a href="/login" className="underline">войдите.</a></div>
                    )}
                </div>
            </aside>
        </>
    )
}