import React, { useState } from 'react'
import { api } from '../api'
export default function Register() {
    const [form, setForm] = useState({
        email: '',
        password: '',
        displayName: '',
        heightCm: '',
        weightKg: '',
    })
    const [msg, setMsg] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await api.register(form)
            setMsg('Register successful!')
        }
        catch {
            setMsg('Error register!')
        }
    }

    return (

        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <img
                    className="mx-auto h-10 w-auto"
                    src="https://www.svgrepo.com/show/301692/login.svg"
                    alt="Workflow"
                />
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create a new account
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form onSubmit={handleSubmit}>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Display Name</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={form.displayName}
                                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                placeholder="user@example.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
                            <input
                                type="number"
                                placeholder="180"
                                value={form.heightCm}
                                onChange={(e) => setForm({ ...form, heightCm: e.target.value })}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                            <input
                                type="number"
                                placeholder="75"
                                value={form.weightKg}
                                onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="mt-6">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500"
                            >
                                Register
                            </button>
                        </div>
                    </form>

                    <p className="mt-4 text-center text-sm text-gray-600">{msg}</p>
                </div>
            </div>
        </div>
    )
    /*
      <div>

            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}>
                </input>
                <br></br>
                <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}></input>
                <br></br>
                <input placeholder='Display Name' value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} />
                <br></br>
                <input placeholder='Height (cm)' type='number' value={form.heightCm} onChange={(e) => setForm({ ...form, heightCm: e.target.value })} />
                <br></br>
                <input placeholder='Weight (kg)' type='number' value={form.weightKg} onChange={(e) => setForm({ ...form, weightKg: e.target.value })} />
                <br></br>
                <button type="submit">Register</button>

            </form>
            <p>{msg}</p>

        </div>
    */ 
}

