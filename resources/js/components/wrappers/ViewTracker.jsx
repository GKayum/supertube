import { useCallback, useEffect, useState } from "react";
import { api, handlerApiError } from "../../services/api";

export default function ViewTracker({ videoId, initialViews = 0, children }) {
    const [views, setViews] = useState(0)
    const [sent, setSent] = useState(0)

    const handlePlay = useCallback(async () => {
        // Проверка, чтобы при перезапуске видео просмотр не учитывался
        if (sent) return
        setSent(true)

        try {
            await api.get('/sanctum/csrf-cookie')
            const response = await api.post(`/api/v1/videos/${videoId}/view/increment`)
            setViews(response.data.views)
        } catch (error) {
            handlerApiError(error, { setValidationErrors: () => {}, setError: () => {} })
        }
    }, [videoId, sent])

    useEffect(() => {
        setViews(initialViews)
        setSent(false)
    }, [initialViews, videoId])

    return children({ views, handlePlay })
}