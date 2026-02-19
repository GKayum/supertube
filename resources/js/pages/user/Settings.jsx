import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

import UserForm from '../../components/form/User'
import { api, handlerApiError } from "../../services/api";

export default function Settings({ onLogin }) {
    const { user, userLoading, setUser } = useAuth()
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [validationErrors, setValidationErrors] = useState({})

    const clickHandler = async (email, name, password, passwordConfirmation) => {
        setError('')
        setValidationErrors({})

        try {
            const data = {email, name}

            if (password) {
                data.password = password
                data.password_confirmation = passwordConfirmation
            }

            await api.get('/sanctum/csrf-cookie')
            const response = await api.post('/api/v1/user/profile/update', data)
            setMessage(response.data.message)
            setUser(response.data.user)
        } catch (error) {
            handlerApiError(error, { setValidationErrors, setError })
        }
    }

    if (userLoading) {
        return <p className="text-center text-gray-500 mt-10">Загрузка данных...</p>
    }

    return (
        <UserForm 
            error={error}
            errors={validationErrors}
            titlePage='Редактирование профиля'
            titleButton='Редактировать'
            emailUser={user.email}
            nameUser={user.name}
            handler={clickHandler}
            message={message}
        />
    )
}