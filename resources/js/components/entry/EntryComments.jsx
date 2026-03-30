import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../services/api'
import Toast from '../form/Toast'

export default function EntryComment({ entryId }) {
    const { user } = useAuth()
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [newComment, setNewComment] = useState('')
    const [toast, setToast] = useState({ visible: false, message: '', type: 'info' })

    useEffect(() => {
        fetchComments()
    }, [entryId])

    const fetchComments = async () => {
        try {
            const response = await api.get(`/api/v1/entries/${entryId}/comments`)
            setComments(response.data.comments || [])
        } catch (error) {
            console.error('Ошибка при загрузке комментариев:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            setToast({ 
                visible: true,
                message: 'Необходимо войти в систему',
                type: 'error' 
            })
            return
        }

        if (!newComment.trim()) {
            setToast({ 
                visible: true,
                message: 'Введите текст комментария',
                type: 'error' 
            })
            return
        }
        
        setSubmitting(true)

        try {
            await api.get('/sanctum/csrf-cookie')

            const response = await api.post(`/api/v1/entries/${entryId}/comments`, {
                content: newComment.trim()
            })

            setComments(prev => [response.data.comment, ...prev])
            setNewComment('')

            setToast({ 
                visible: true,
                message: 'Комментарий добавлен',
                type: 'success' 
            })
        } catch (error) {
            setToast({ 
                visible: true,
                message: error.response?.data?.message || 'Ошибка при добавлении комментария',
                type: 'error'
            })
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Комментарии</h2>
                <div className="text-center text-gray-500 py-8">Загрузка комментариев...</div>
            </div>
        )
    }

    return (
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Toast 
                {...toast}
                onClose={() => setToast(t => ({...t, visible: false}))}
            />

            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Комментарии ({comments.length})
            </h2>

            {/* Форма добавления комментария */}
            {user && (
                <form onSubmit={handleSubmit} className="mb-6">
                    <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            {user.channel?.avatar ? (
                                <img 
                                    src={user.channel.avatar}
                                    className="w-full h-full rounded-full object-cover" 
                                />
                            ) : (
                                user.name?.charAt(0).toUpperCase() || '👤'
                            )}
                        </div>
                        <div className="flex-1">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Введите комментарий"
                                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                rows={3}
                                maxLength={1000}
                            />
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-sm text-gray-500">
                                    {newComment.length}/1000
                                </span>
                                <button
                                    type="submit"
                                    disabled={submitting || !newComment.trim()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                                >
                                    {submitting ? 'Отправка...' : 'Отправить'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            )}

            {/* Список комментариев */}

            <div className="space-y-4">
                {comments.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">Пока нет комментариев</div>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                {comment.user?.avatar ? (
                                    <img 
                                        src={comment.user.avatar}
                                        className="w-full h-full rounded-full object-cover" 
                                    />
                                ) : (
                                    comment.user?.name?.charAt(0)?.toUpperCase() || '👤'
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-gray-900">
                                        {comment.user?.name || 'Аноним'}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {comment.timeAgo}
                                    </span>
                                </div>
                                <p className="text-gray-800 whitespace-pre-wrap">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

        </div>
    )
}