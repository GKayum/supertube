import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { handlerApiError } from '../../services/api'

export default function Login() {
    const { login } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [validationErrors, setValidationErrors] = useState({})

    const handleSubmit = async () => {
        setError('')
        setValidationErrors('')

        try {
            await login(email, password)
        } catch (error) {
            handlerApiError(error, { setValidationErrors, setError })
        }
    }

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-4">Войти</h2>

            <div className="mb-4">
                <label htmlFor="email" className="block mb-2 font-medium text-gray-700">E-Mail</label>
                <input
                    id='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='E-Mail'
                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${validationErrors.email ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'}`}
                />
                {validationErrors.email && (
                    <div className="text-red-500 text-sm mt-1">{validationErrors.email[0]}</div>
                )}
            </div>

            <div className="mb-4">
                <label htmlFor="password" className="block mb-2 font-medium text-gray-700">Пароль</label>
                <input 
                    id='password'
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Пароль'
                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${validationErrors.password ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'}`}
                />
                {validationErrors.password && (
                    <div className="text-red-500 text-sm mt-1">{validationErrors.password[0]}</div>
                )}
            </div>

            <button
                onClick={handleSubmit}
                type='button'
                className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50'
            >
                Войти
            </button>

            {error && (
                <div className="mt-4 p-2 text-center rounded-lg bg-red-100 text-red-600">
                    {error}
                </div>
            )}
        </div>
    )
}