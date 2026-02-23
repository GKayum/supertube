import { useState } from "react"

export default function User({
    error,
    errors,
    titlePage,
    titleButton,
    emailUser,
    nameUser,
    handler,
    message,
}) {
    const [email, setEmail] = useState(emailUser)
    const [name, setName] = useState(nameUser)
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')

    const clickHandler = () => {
        handler(email, name, password, passwordConfirmation)
    }

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-4">{titlePage}</h2>

            <div className="mb-4">
                <label htmlFor="email" className="block mb-2 font-medium text-gray-700">E-Mail</label>
                <input 
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-Mail"
                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${errors.email ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'}`}
                />
                {errors.email && (
                    <div className="text-red-500 text-sm mt-1">{errors.email[0]}</div>
                )}
            </div>

            <div className="mb-4">
                <label htmlFor="name" className="block mb-2 font-medium text-gray-700">Имя</label>
                <input
                    id="name" 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Имя"
                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${errors.name ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'}`}
                />
                {errors.name && (
                    <div className="text-red-500 text-sm mt-1">{errors.name[0]}</div>
                )}
            </div>

            <div className="mb-4">
                <label htmlFor="password" className="block mb-2 font-medium text-gray-700">Пароль</label>
                <input
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Пароль"
                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${errors.password ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'}`}
                />
                {errors.password && (
                    <div className="text-red-500 text-sm mt-1">{errors.password[0]}</div>
                )}
            </div>

            <div className="mb-4">
                <label htmlFor="passwordConfirmation" className="block mb-2 font-medium text-gray-700">Повторите пароль</label>
                <input 
                    id="passwordConfirmation"
                    type="password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    placeholder="Повторите пароль"
                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${errors.passwordConfirmation ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'}`}
                />
                {/* {errors.passwordConfirmation && (
                    <div className="text-red-500 text-sm mt-1">{errors.passwordConfirmation[0]}</div>
                )} */}
            </div>

            <button
                onClick={clickHandler}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
            >
                {titleButton}
            </button>

            {error && (
                <div className="mt-4 p-2 text-center rounded-lg bg-red-100 text-red-600">
                    {error}
                </div>
            )}

            {message && (
                <div className="mt-2 p-2 text-center rounded-lg bg-green-100 text-green-600">
                    {message}
                </div>
            )}
        </div>
    )
}