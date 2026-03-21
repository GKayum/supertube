import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, handlerApiError } from "../../services/api";
import NotFound from '../404'
import FormVideo from "../../components/form/FormVideo";

export default function VideoEdit() {
    const { id } = useParams()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [preview, setPreview] = useState(null)
    const [scheduledAt, setScheduledAt] = useState('')
    const [currentPreviewUrl, setCurrentPreviewUrl] = useState(null)
    const [videoPath, setVideoPath] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [validationErrors, setValidationErrors] = useState({})
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [isError, setIsError] = useState(false)
    const [notVideo, setNotVideo] = useState(false)
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState('')
    const [hiddenLink, setHiddenLink] = useState(null)

    useEffect(() => {
        async function fetchVideo() {
            try {
                setLoading(true)
                const response = await api.get(`/api/v1/user/videos/${id}`)
                setTitle(response.data.title)
                setStatus(response.data.status)
                setDescription(response.data.description)
                setCurrentPreviewUrl(response.data.preview350 || null)
                setVideoPath(response.data.path || null)
                setHiddenLink(response.data.hiddenLink || null)

                if (response.data.status === 'scheduled') {
                    setScheduledAt(response.data.scheduledAt || '')
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setNotVideo(true)
                }
                setError('Не удалось загрузить видео')
            } finally {
                setLoading(false)
            }
        }
        fetchVideo()
    }, [id])

    const handleSave = async () => {
        const formData = new FormData()
        formData.append('title', title)
        formData.append('status', status)
        formData.append('description', description)
        formData.append('scheduledAt', scheduledAt)
        if (preview) formData.append('preview', preview)

        try {
            setUploading(true)
            setMessage('')
            setIsError(false)
            setValidationErrors({})
            await api.get('/sanctum/csrf-cookie')
            await api.post(`/api/v1/videos/${id}/edit`, formData, {
                headers: {
                    'Content-Type' : 'multipart/form-data',
                }
            })
            setMessage('Видео успешно обновлено!')
        } catch (error) {
            setMessage('Ошибка при обновлении')
            setIsError(true)
            handlerApiError(error, { setValidationErrors, setError })
        } finally {
            setUploading(false)
        }
    }

    if (loading) {
        return <p className="text-center text-gray-500 mt-10">Загрузка данных...</p>
    }

    if (notVideo) {
        return <NotFound />
    }

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
            {videoPath && (
                <div className="mb-6">
                    <video 
                        src={videoPath}
                        controls
                        className="w-full rounded-xl"
                        poster={currentPreviewUrl || undefined}
                    />
                </div>
            )}
            <FormVideo 
                title={title}
                description={description}
                validationErrors={validationErrors}
                uploading={uploading}
                scheduledAt={scheduledAt}
                isEdit={true}
                status={status}
                setStatus={setStatus}
                setTitle={setTitle}
                setDescription={setDescription}
                setPreview={setPreview}
                setScheduledAt={setScheduledAt}
                onSubmit={handleSave}
                error={error}
                message={message}
                isError={isError}
                showFileInput={false}
                currentPreviewUrl={currentPreviewUrl}
                hiddenLink={hiddenLink}
            />
        </div>
    )
}