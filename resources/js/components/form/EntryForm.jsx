import { useEffect, useState } from "react";
import { api } from "../../services/api"

/**
 * Данные:
 * - entry?: { id: number|string, title: string, description: string, hiddenLink?: string }
 * - isEdit?: boolean (default: false)
 * - onSuccess?: (data) => void // колбэк после успешного создания/сохранения
 */
export default function EntryForm({ entry = null, isEdit = false, onSuccess }) {
    const [title, setTitle] = useState(entry?.title ?? '')
    const [description, setDescription] = useState(entry?.description ?? '')
    const [image, setImage] = useState(entry?.image ?? '')
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(entry?.image ?? '')
    const [status, setStatus] = useState(entry?.status ?? 'draft')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [validationErrors, setValidationErrors] = useState({})

    // Нужно проверить, при переключении формы
    useEffect(() => {
        if (entry) {
            setTitle(entry.title ?? '')
            setDescription(entry.description ?? '')
            setImage(entry.image ?? '')
            setImagePreview(entry.image ?? '')
            setStatus(entry.status ?? 'draft')
        }
    }, [entry])

    const handleTitleChange = (e) => {
        setTitle(e.target.value)
        if (validationErrors.title) {
            setValidationErrors((v) => ({...v, title: null}))
        }
    }

    const handleStatusChange = (e) => {
        setStatus(e.target.value)
    }

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value)
        if (validationErrors.description) {
            setValidationErrors((v) => ({ ...v, description: null }))
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)

            const reader = new FileReader()
            reader.onload = (e) => {
                setImagePreview(e.target.result)
            }
            reader.readAsDataURL(file)

            if (validationErrors.image) {
                setValidationErrors((v) => ({...v, image: null}))
            }
        }
    }

    const submit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')
        setValidationErrors({})

        try {
            const formData = new FormData()
            formData.append('title', title)
            formData.append('description', description)
            formData.append('status', status)

            if (imageFile) {
                formData.append('image', imageFile)
            }

            let res

            if (isEdit && entry?.id) {
                res = await api.put(`/api/v1/user/entries/${entry.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                })
                setMessage('Изменения сохранены.')
            } else {
                res = await api.post('/api/v1/entry/store', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                })
                setMessage('Запись успешно добавлена!')
                setTitle('')
                setDescription('')
                setImage('')
                setImageFile(null)
                setImagePreview('')
            }

            if (onSuccess) onSuccess()
        } catch (error) {
            const errors = error?.response?.data?.errors
            if (errors) setValidationErrors(errors)
            setMessage('Ошибка при сохранении записи.')
            console.error(error);
        } finally {
            setLoading(false)
        }
    }

    return (
        <form 
            onSubmit={submit}
            className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow"
        >
            <h2 className="text-xl font-semibold text-zinc-800 mb-4">
                {isEdit ? 'Редактировать запись' : 'Добавить запись'}
            </h2>

            {message && (
                // <p className="mb-4 text-sm text-center text-zinc-700">
                //     {message}
                // </p>
                <div className={`mb-4 p-2 text-sm text-center rounded-lg ${Object.keys(validationErrors).length !== 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {message}
                </div>
            )}

            <div className="mb-4">
                <label htmlFor="title" className="block mb-2 font-medium text-gray-700">
                    Заголовок
                </label>
                <input
                    id="title" 
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    required
                    placeholder="Введите название..."
                    className={`w-full border rounded-lg px-4 py-2 bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-2 ${
                        validationErrors?.title ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'    
                    }`}
                />
                {validationErrors?.title && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.title[0]}</p>
                )}
            </div>

            <div className="mb-4">
                <label htmlFor="description" className="block mb-2 font-medium text-gray-700">
                    Описание
                </label>
                <textarea
                    id="description" 
                    name="description"
                    rows="5"
                    placeholder="Введите описание..."
                    value={description}
                    onChange={handleDescriptionChange}
                    className={`w-full border rounded-lg px-4 py-2 bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-2 
                        [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-zinc-400 [&::-webkit-scrollbar-thumb]:rounded-2xl [&::-webkit-scrollbar-track]:bg-none ${
                        validationErrors?.description ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'    
                    }`}
                />
                {validationErrors?.description && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.description[0]}</p>
                )}
            </div>

            <div className="mb-4">
                <label htmlFor="image" className="block mb-2 font-medium text-gray-700">
                    Обложка
                </label>
                <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={`w-full border rounded-lg px-4 py-2 bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-2 
                        [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-zinc-400 [&::-webkit-scrollbar-thumb]:rounded-2xl [&::-webkit-scrollbar-track]:bg-none ${
                        validationErrors?.image ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'    
                    }`}
                />
                {validationErrors?.image && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.image[0]}</p>
                )}

                {imagePreview && (
                    <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">Предварительный просмотр:</p>
                        <img 
                            src={imagePreview}
                            alt="Предварительный просмотр"
                            className="max-w-full h-48 object-cover rounded-lg border border-gray-200"
                        />
                    </div>
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
                        validationErrors.status ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'    
                    }`}
                >
                    <option key="status-draft" value="draft">Черновик</option>
                    <option key="status-published" value="published">Опубликовано</option>
                </select>
                {validationErrors.status && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.status[0]}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
            >
                {loading
                    ? (isEdit ? 'Сохраняем...' : 'Сохраняем...')
                    : (isEdit ? 'Сохранить измененния' : 'Добавить запись')}
            </button>
        </form>
    )
}