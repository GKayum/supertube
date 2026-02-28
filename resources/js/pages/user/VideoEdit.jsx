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
    const [previewUrl, setPreviewUrl] = useState(null)
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

    useEffect(() => {
        async function fetchVideo() {
            try {
                setLoading(true)
                const response = await api.get(`/api/v1/videos/${id}`)
                setTitle(response.data.title)
                setStatus(response.data.status)
                setDescription(response.data.description)
                setCurrentPreviewUrl(response.data.preview350 || null)
                setVideoPath(response.data.path || null)
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

    const handleTitleChange = e => setTitle(e.target.value)
    const handleDescriptionChange = e => setDescription(e.target.value)
    const handleStatusChange = e => setStatus(e.target.value)
    const handlePreviewChange = e => {
        const file = e.target.files[0]
        if (file) {
            try {
                const url = URL.createObjectURL(file)
                setPreview(file)
                setPreviewUrl(url)
            } catch (error) {
                setPreview(null)
                setPreviewUrl(null)
            }
        }
    }

    const handleSave = async () => {
        let hasError = false
        if (!title.trim()) {
            setValidationErrors({title: 'Введите название видео.'})
            hasError = true
        }
        if (hasError) return

        const formData = new FormData()
        formData.append('title', title)
        formData.append('status', status)
        formData.append('description', description)
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
                isEdit={true}
                status={status}
                onStatusChange={handleStatusChange}
                onTitleChange={handleTitleChange}
                onDescriptionChange={handleDescriptionChange}
                onPreviewChange={handlePreviewChange}
                onSubmit={handleSave}
                error={error}
                message={message}
                isError={isError}
                showFileInput={false}
                previewUrl={previewUrl}
                currentPreviewUrl={currentPreviewUrl}
            />
        </div>
    )
}