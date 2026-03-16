import React, { useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { api, handlerApiError } from "../../services/api";
import AvatarCropper from '../../components/form/AvatarCropper'
import CoverCropper from "../../components/form/channel/CoverCropper";

export default function ChannelSettings() {
    const { user, userLoading, setUser } = useAuth()

    const [title, setTitle] = useState(user?.channel?.title)
    const [description, setDescription] = useState(user?.channel?.description)
    const [avatar, setAvatar] = useState(null)
    const [cover, setCover] = useState(null)
    const avatarInput = useRef(null)

    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [validationErrors, setValidationErrors] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setMessage('')
        setValidationErrors('')

        try {
            const formData = new FormData()
            formData.append('title', title)
            formData.append('description', description)
            if (avatar) formData.append('avatar', avatar)
            if (cover) formData.append('cover', cover)

            await api.get('/sanctum/csrf-cookie')
            const response = await api.post('/api/v1/user/channel/update', formData, {
                headers: {'Content-Type' : 'multipart/form-data'}
            })
            setMessage(response.data.message || 'Канал успешно обновлен!')
            setUser(response.data)
            setTitle(response.data.channel?.title)
            setDescription(response.data.channel?.description)
            if (avatarInput.current) avatarInput.current.value = ''
            setAvatar(null)
            setCover(null)
        } catch (error) {
            handlerApiError(error, { setValidationErrors, setError })
        }
    }

    if (userLoading) {
        return <p className="text-center text-gray-500 mt-10">Загрузка...</p>
    }

    const errors = validationErrors

    return (
        <form
            className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-10"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
        >
            <h2 className="text-2xl font-bold mb-6">Редактирование канала</h2>

            {user?.channel?.cover && (
                <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Текущая обложка</div>
                    <img 
                        src={user.channel.cover}
                        alt="Текущая обложка канала"
                        className="w-full h-32 md:h-40 rounded-lg object-cover border"
                    />
                </div>
            )}

            <div className="mb-6">
                <label className="block mb-2 font-medium text-gray-700">Обложка канала</label>
                <CoverCropper onChange={blob => setCover(blob)} />
                {errors.cover && <div className="text-red-500 text-sm mt-1">{errors.cover[0]}</div>}
            </div>

            {user?.channel?.avatar && (
                <div className="mb-3">
                    <img 
                        src={user.channel.avatar} 
                        alt="Аватар"
                        className="w-20 h-20 rounded-full object-cover border"
                    />
                </div>
            )}

            <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Аватар</label>
                <AvatarCropper onChangeAvatar={blob => setAvatar(blob)} />
                {errors.avatar && <div className="text-red-500 text-sm mt-1">{errors.avatar[0]}</div>}
            </div>

            <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Название канала</label>
                <input 
                    type="text"
                    value={title}
                    maxLength={64}
                    onChange={e => setTitle(e.target.value)}
                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                        errors.title ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'    
                    }`}
                />
                {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title[0]}</div>}
            </div>

            <div className="mb-6">
                <label className="block mb-2 font-medium text-gray-700">Описание</label>
                <textarea 
                    value={description}
                    maxLength={5000}
                    onChange={e => setDescription(e.target.value)}
                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                        errors.description ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'    
                    }`}
                    rows={5}
                />
                {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description[0]}</div>}
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition disabled"
            >
                Сохранить
            </button>

            {error && (
                <div className="mt-4 p-2 text-center rounded-lg bg-red-100 text-red-600">
                    {error}
                </div>
            )}

            {message && (
                <div className="mt-4 p-2 text-center rounded-lg bg-green-100 text-green-600">
                    {message}
                </div>
            )}
        </form>
    )
}