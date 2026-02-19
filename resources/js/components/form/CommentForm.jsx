import { useState } from "react";
import { api, handlerApiError } from "../../services/api";

export default function CommentForm({ videoId, setCommentList, setCommentsCount }) {
    const [commentText, setCommentText] = useState('')
    const [commentLoading, setCommentLoading] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [validationErrors, setValidationErrors] = useState({})

    const handleCommentSubmit = async () => {
        setCommentLoading(true)
        setError('')
        setMessage('')

        try {
            await api.get('/sanctum/csrf-cookie')
            const response = await api.post('/api/v1/videos/' + videoId + '/comments', {text: commentText})

            setMessage(response.data.message)
            setCommentList(response.data.comments)
            setCommentsCount(response.data.count)
            setCommentText('')
        } catch (error) {
            console.log('Ошибка при отправке комментария: ', error);
            handlerApiError(error, { setValidationErrors, setError })
        } finally {
            setCommentLoading(false)
        }
    }

    return (
        <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Оставить комментарий
            </h2>

            <textarea 
                className="w-full border rounded-lg p-3 text-sm resize-none focus:ring-2 focus:ring-blue-400"
                rows="4"
                placeholder="Введите текст..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {message && <p className="text-green-600 text-sm">{message}</p>}

            {validationErrors.text && (
                <ul className="text-red-500 text-sm space-y-1 mt-1">
                    {validationErrors.text.map((msg, i) => (
                        <li key={i}>{msg}</li>
                    ))}
                </ul>
            )}

            <button
                type="submit"
                onClick={handleCommentSubmit}
                disabled={commentLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded disabled:opacity-50"
            >
                {commentLoading ? 'Отправка...' : 'Отправить'}
            </button>
        </div>
    )
}