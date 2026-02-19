import { useEffect, useState } from "react";
import Avatar from "../../components/user/Avatar";
import { useParams } from "react-router-dom";
import { api, handlerApiError } from '../../services/api'
import NotFound from '../404'

export default function Channel() {
    const { id } = useParams()
    const [channel, setChannel] = useState({})
    const [loading, setLoading] = useState(true)
    const [notChannel, setNotChannel] = useState(false)
    const [showFullDescription, setShowFullDescription] = useState(false)

    useEffect(() => {
        fetchChannel()
    }, [id])

    const fetchChannel = async () => {
        try {
            const response = await api.get('/api/v1/channel/' + id)
            setChannel(response.data)
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setNotChannel(true)
            }

            console.log('Ошибка при загрузке данных канала: ', error);
            handlerApiError(error, {setValidationErrors: () => {}, setError: () => {}})
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <p className="text-center text-gray-500 mt-10">Загрузка данных...</p>
    }

    if (notChannel) {
        return <NotFound />
    }

    const description = channel.description || ''
    const isLongDescription = description.length > 500
    const shortDescription = isLongDescription ? description.slice(0, 500) + '...' : description
    
    return (
        <main className="bg-white rounded shadow">

            <div className="relative h-48 md:h-60 bg-gray-200 overflow-hidden">
                <img src="/" alt="Обложка канала" className="w-full h-full object-cover"/>
            </div>

            <div className="relative px-4">
                <div className="absolute -top-12 md:-top-16 left-4 flex items-end">
                    <Avatar user={channel} text={'text-8xl'} classes={'md:w-32 md:h-32 border-4 border-black shadow'} />
                    <div className="ml-4 mb-2">
                        <h1 className="text-2xl md:text-3xl font-bold">{channel.title}</h1>
                        <p className="text-gray-600">456 тыс. подписчиков</p>
                    </div>
                </div>
                <div className="pt-16 md:pt-20"></div>
            </div>

            <div className="px-4">
                <div id="description" className="text-gray-700 overflow-hidden transition-all duration-300">
                    {isLongDescription
                        ? shortDescription
                            ? description
                            : shortDescription
                        : description}
                </div>
                {isLongDescription && (
                    <button
                        onClick={() => setShowFullDescription(v => !v)}
                        className="text-blue-600 mt-2 hover:underline"
                    >
                        {showFullDescription ? 'Скрыть' : 'Показать полностью'}
                    </button>
                )}
            </div>

            <nav className="border-b mt-4">
                <ul className="flex gap-6 px-4 overflow-x-auto">
                    <li><a href="#" className="block py-4 font-semibold border-b-2 border-red-600">Видео</a></li>
                    <li><a href="#" className="block py-4 hover:text-red-600">Плейлисты</a></li>
                    <li><a href="#" className="block py-4 hover:text-red-600">Шортсы</a></li>
                    <li><a href="#" className="block py-4 hover:text-red-600">Записи</a></li>
                    <li><a href="#" className="block py-4 hover:text-red-600">Трансляции</a></li>
                </ul>
            </nav>

            <section className="px-4 py-8">
                <div className="text-gray-500">Здесь будет контент вкладки...</div>
            </section>


        </main>
    )
}