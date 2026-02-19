import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import UserForm from '../../components/form/User'
import { handlerApiError } from "../../services/api"

export default function Register() {
    const { register } = useAuth()
    const [error, setError] = useState('')
    const [validationErrors, setValidationErrors] = useState({})

    const handleRegister = async (email, name, password, passwordConfirmation) => {
        setError('')
        setValidationErrors('')

        try {
            await register(email, name, password, passwordConfirmation)
        } catch (error) {
            handlerApiError(error, { setValidationErrors, setError })
        }
    }

    return (
        <UserForm 
            error={error}
            errors={validationErrors}
            titlePage='Регистрация'
            titleButton='Зарегистрироваться'
            handler={handleRegister}
        />
    )
}