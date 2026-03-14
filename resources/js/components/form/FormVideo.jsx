import { useEffect, useState } from 'react'
import { api } from '../../services/api'

export default function FormVideo({
    title,
    description,
    currentPreviewUrl,
    status,
    scheduledAt,
    validationErrors,
    uploading,
    isEdit = false,
    setTitle,
    setDescription,
    setPreview,
    setFile,
    setStatus,
    setScheduledAt,
    file,
    onSubmit,
    error,
    message,
    isError,
    uploadProgress,
    hiddenLink = ''
}) {
    const [statusOptions, setStatusOptions] = useState([])
    const [previewUrl, setPreviewUrl] = useState(null)
    
    const handleFileChange = (e) => setFile(e.target.files[0])
    const handleTitleChange = (e) => setTitle(e.target.value)
    const handleDescriptionChange = (e) => setDescription(e.target.value)
    const handleStatusChange = e => setStatus(e.target.value)

    const handlePreviewChange = async (e) => {
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

    useEffect(() => {
        api.get('/api/v1/videos/statuses').then(res => {
            setStatusOptions(res.data)
        })
    }, [])

    return (
        <>
            <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Название видео</label>
                <input 
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${validationErrors.title ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'}`}
                    placeholder="Введите название видео..."
                />
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

            {!isEdit && (
                <div className="mb-4">
                    <label className="block mb-2 font-medium text-gray-700">Выберите файл</label>
                    <input 
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        className={`w-full ${validationErrors.video ? 'border-red-400' : ''}`}
                    />
                    {validationErrors.video && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.video[0]}</p>
                    )}
                </div>
            )}

            {(file && !isEdit) && (
                <div className="mb-4">
                    <video 
                        src={URL.createObjectURL(file)}
                        controls
                        className="w-full rounded-lg" 
                    />
                </div>
            )}

            <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Превью обложка</label>
                <input 
                    type="file"
                    accept="image/*"
                    onChange={handlePreviewChange}
                    className="w-full"
                />

                {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="mt-2 w-[480px] border rounded" />
                ) : currentPreviewUrl ? (
                    <img src={currentPreviewUrl} alt="Preview" className="mt-2 w-[480px] border rounded" />
                ) : null}

                {validationErrors.preview && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.preview[0]}</p>
                )}
            </div>

            <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">
                    Статус видео
                </label>
                <select
                    value={status}
                    onChange={handleStatusChange}
                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                        validationErrors.status
                            ? 'border-red-400 focus:ring-red-400'    
                            : 'border-gray-300 focus:ring-blue-500'    
                    }`}
                >
                    {Object.entries(statusOptions).map(([key, label]) => (
                        <option key={key} value={key} disabled={isEdit && key === 'scheduled'}>
                            {label}
                        </option>
                    ))}
                </select>
                {validationErrors.status && (
                    <p className="text-red-500 text-sm mt-1">
                        {validationErrors.status[0]}
                    </p>
                )}
            </div>

            {status === 'scheduled' && (
                <div className="mb-4">
                    <label className="block mb-2 font-medium text-gray-700">
                        Дата и время публикации
                    </label>
                    <input 
                        type="datetime-local"
                        value={scheduledAt}
                        onChange={e => setScheduledAt(e.target.value)}
                        className="border rounded p-2 w-full"
                        min={new Date().toString().slice(0, 16)}
                    />
                    {validationErrors?.scheduledAt && (
                        <p className="text-red-500 text-sm mt-1">
                            {validationErrors.scheduledAt[0]}
                        </p>
                    )}
                </div>
            )}

            {hiddenLink && (
                <div className="mb-4 px-4 py-3 bg-blue-50 border border-blue-300 rounded-lg flex items-center gap-2 text-blue-800 text-sm">
                    {/* svg */}
                    <span>
                        Видео доступно <b>по ссылке</b>: {" "}
                        <a 
                            href={hiddenLink}
                            className='underline break-all text-blue-700 hover:text-blue-900 transition'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            {hiddenLink}
                        </a>
                    </span>
                </div>
            )}

            <button
                onClick={onSubmit}
                disabled={uploading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
            >
                {uploading 
                    ? (isEdit ? 'Сохраняем...' : 'Загрузка...')
                    : (isEdit ? 'Сохранить изменения' : 'Загрузить видео')
                }
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
        </>
    )
}