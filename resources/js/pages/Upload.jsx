import React, { useState } from "react";
import { Link } from "react-router-dom";

import { api, handlerApiError } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import CoverValidation from "../validators/Cover"; 

export default function Upload() {
    const { user } = useAuth()
    const [file, setFile] = useState(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [message, setMessage] = useState('')
    const [isError, setIsError] = useState(false)
    const [previewUrl, setPreviewUrl] = useState(null)

    const [preview350, setPreview350] = useState(null)
    const [preview480, setPreview480] = useState(null)
    const [preview350Url, setPreview350Url] = useState(null)
    const [preview480Url, setPreview480Url] = useState(null)

    const [previewError, setPreviewError] = useState('')
    const [fileError, setFileError] = useState('')
    const [titleError, setTitleError] = useState('')
    const [error, setError] = useState('')
    const [validationErrors, setValidationErrors] = useState({})
    
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

    const handlePreview350Change = async (e) => {
        const file = e.target.files[0]

        if (file) {
            try {
                const url = await CoverValidation(file, 350, 192)

                setPreview350(file)
                setPreview350Url(url)
                setPreviewError('')
            } catch (error) {
                setPreview350(null)
                setPreview350Url(null)
                setPreviewError(error)
            }
        }
    }

    const handlePreview480Change = async (e) => {
        const file = e.target.files[0]

        if (file) {
            try {
                const url = await CoverValidation(file, 480, 240)

                setPreview480(file)
                setPreview480Url(url)
                setPreviewError('')
            } catch (error) {
                setPreview480(null)
                setPreview480Url(null)
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

        if (!preview350 || !preview480) {
            setPreviewError('Загрузите оба превью изображения.')
            hasError = true
        }

        if (hasError) {
            return
        }

        const formData = new FormData()
        formData.append('video', file)
        formData.append('title', title)
        formData.append('description', description)
        formData.append('preview350', preview350)
        formData.append('preview480', preview480)

        try {
            setUploading(true)
            setUploadProgress(0)
            setMessage('')
            setIsError(false)

            await api.get('/sanctum/csrf-cookie')
            const response = await api.post('/api/v1/videos/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    setUploadProgress(percent)
                },
            })

            setMessage(response.data.message)
            setFile(null)
            setTitle('')
            setDescription('')
            setPreviewUrl(null)
            setPreview350(null)
            setPreview480(null)
            setPreview350Url(null)
            setPreview480Url(null)
        } catch (error) {
            console.log(error);
            setMessage('Ошибка загрузки видео')
            setIsError(true)
            handlerApiError(error, { setValidationErrors, setError })
        } finally {
            setUploading(false)
        }
    }

    if (!user) {
        return (
            <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-10 text-center">
                <h2 className="text-2xl font-bold mb-4">Вы не можете добавлять видео!</h2>

                <p>Чтобы у Вас появилась возможность добавлять видео, нужно зарегистрироваться <Link to="/register" className="text-gray-600 hover:text-blue-700 transition fonte-medium">по этой ссылке</Link></p>
            </div>
        )
    }

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-4">Загрузка видео</h2>

            <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Название видео</label>
                <input 
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${titleError || validationErrors.title ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'}`}
                    placeholder="Введите название видео..."
                />
                {titleError ? (
                    <p className="text-red-500 text-sm mt-1">{titleError}</p>
                ) : (
                    <p className="text-sm mt-1 invisible">.</p>
                )}
                {validationErrors.title && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.title[0]}</p>
                )}
            </div>

            <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Описание видео</label>
                <textarea
                    rows='5'
                    value={description}
                    onChange={handleDescriptionChange}
                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${validationErrors.description ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'}`}
                    placeholder="Введите описание видео..."
                />
                {validationErrors.description && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.description[0]}</p>
                )}
            </div>

            <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Выберите файл</label>
                <input 
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className={`w-full ${fileError ? 'border-red-400' : ''}`}
                />
                {fileError ? (
                    <p className="text-red-500 text-sm mt-1">{fileError}</p>
                ) : (
                    <p className="text-sm mt-1 invisible">.</p>
                )}
                {validationErrors.video && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.video[0]}</p>
                )}
            </div>

            {previewUrl && (
                <div className="mb-4">
                    <video 
                        src={previewUrl}
                        controls
                        className="w-full rounded-lg" 
                    />
                </div>
            )}

            <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Превью обложка 350x192</label>
                <input 
                    type="file"
                    accept="image/*"
                    onChange={handlePreview350Change}
                    className="w-full"
                />

                {preview350Url && (
                    <img src={preview350Url} alt="Preview 350x192" className="mt-2 w-[350px] border rounded" />
                )}

                {validationErrors.preview350 && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.preview350[0]}</p>
                )}
            </div>

            <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Превью обложка 480x240</label>
                <input 
                    type="file"
                    accept="image/*"
                    onChange={handlePreview480Change}
                    className="w-full"
                />

                {preview480Url && (
                    <img src={preview480Url} alt="Preview 350x192" className="mt-2 w-[480px] border rounded" />
                )}

                {validationErrors.preview480 && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.preview480[0]}</p>
                )}

                {previewError && (
                    <div className="text-red-500 text-sm mt-2">{previewError}</div>
                )}
            </div>

            <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
            >
                {uploading ? 'Загрузка...' : 'Загрузить видео'}
            </button>

            {uploading && (
                <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%`}}></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{uploadProgress}%</p>
                </div>
            )}

            {error && (
                <div className="mt-4 p-2 text-center rounded-lg bg-red-100 text-red-600">
                    {error}
                </div>
            )}

            {message && (
                <div className={`mt-4 p-2 text-center rounded-lg ${isError ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {message}
                </div>
            )}
        </div>
    )
}