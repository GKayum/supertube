import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Protected() {
    const { user, userLoading } = useAuth()

    if (userLoading) {
        return <p className='text-center text-gray-500 mt-10'>Загрузка...</p>
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}