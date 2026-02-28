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
    const [previewUrl, setPreviewUrl] = useState(null)
    const [preview, setPreview] = useState(null)
    const [previewError, setPreviewError] = useState('')
    const [fileError, setFileError] = useState('')
    const [titleError, setTitleError] = useState('')
    const [error, setError] = useState('')
    const [validationErrors, setValidationErrors] = useState({})
    const [uploadProgress, setUploadProgress] = useState(0)
    const navigate = useNavigate()
    
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]

        if (selectedFile) {
            setFile(selectedFile)
            setPreviewUrl(URL.createObjectURL(selectedFile))
        }

        setFileError('')
        setTitleError('')
        setIsError(false)
    }

    const handleTitleChange = (e) => {
        setTitle(e.target.value)
        setTitleError('')
        setMessage('')
        setIsError(false)
    }

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value)
        setMessage('')
        setIsError(false)
    }

    const handleStatusChange = e => setStatus(e.target.value)

    const handlePreviewChange = async (e) => {
        const file = e.target.files[0]

        if (file) {
            try {
                const url = URL.createObjectURL(file)
                setPreview(file)
                setPreviewUrl(url)
                setPreviewError('')
            } catch (error) {
                setPreview(null)
                setPreviewUrl(null)
                setPreviewError(error)
            }
        }
    }

    const handleUpload = async () => {
        let hasError = false

        if (!title.trim()) {
            setTitleError('Введите название видео')
            hasError = true
        }

        if (!file) {
            setFileError('Выберите файл для загрузки')
            hasError = true
        }

        if (!preview) {
            setPreviewError('Загрузите превью изображения.')
            hasError = true
        }

        if (hasError) {
            return
        }

        const formData = new FormData()
        formData.append('video', file)
        formData.append('title', title)
        formData.append('status', status)
        formData.append('description', description)
        formData.append('preview', preview)

        try {
            setUploading(true)
            setMessage('')
            setError('')
            setIsError(false)

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
                titleError={titleError}
                validationErrors={validationErrors}
                previewError={previewError}
                uploading={uploading}
                isEdit={false}
                status={status}
                onStatusChange={handleStatusChange}
                onTitleChange={handleTitleChange}
                onDescriptionChange={handleDescriptionChange}
                onPreviewChange={handlePreviewChange}
                onFileChange={handleFileChange}
                onSubmit={handleUpload}
                error={error}
                message={message}
                isError={isError}
                fileError={fileError}
                showFileInput={true}
                file={file}
                previewUrl={previewUrl}
                uploadProgress={uploadProgress}
            />
        </div>
    )
}