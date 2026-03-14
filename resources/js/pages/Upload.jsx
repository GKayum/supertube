import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { api, handlerApiError } from '../services/api'
import FormVideo from '../components/form/FormVideo'

export default function Upload() {
    const [file, setFile] = useState(null)
    const [status, setStatus] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState('')
    const [isError, setIsError] = useState(false)
    const [preview, setPreview] = useState(null)
    const [scheduledAt, setScheduledAt] = useState('')
    const [error, setError] = useState('')
    const [validationErrors, setValidationErrors] = useState({})
    const [uploadProgress, setUploadProgress] = useState(0)
    const navigate = useNavigate()

    const handleUpload = async () => {
        const formData = new FormData()
        formData.append('video', file)
        formData.append('title', title)
        formData.append('status', status)
        formData.append('description', description)
        formData.append('preview', preview)
        formData.append('scheduledAt', scheduledAt)

        try {
            setUploading(true)
            setMessage('')
            setError('')

            await api.get('/sanctum/csrf-cookie')
            const response = await api.post('/api/v1/videos/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    setUploadProgress(percent)
                }
            })

            const videoId = response.data?.id
            setMessage(response.data.message)

            if (videoId) {
                setTimeout(() => {
                    navigate(`/edit/${videoId}`)
                }, 1000);
            }
        } catch (error) {
            setMessage('Ошибка загрузки видео')
            setIsError(true)
            handlerApiError(error, { setValidationErrors, setError })
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-4">Загрузка видео</h2>

            <FormVideo 
                title={title}
                description={description}
                validationErrors={validationErrors}
                uploading={uploading}
                isEdit={false}
                status={status}
                setStatus={setStatus}
                setTitle={setTitle}
                setDescription={setDescription}
                setPreview={setPreview}
                setFile={setFile}
                setScheduledAt={setScheduledAt}
                onSubmit={handleUpload}
                error={error}
                message={message}
                isError={isError}
                file={file}
                uploadProgress={uploadProgress}
            />
        </div>
    )
}