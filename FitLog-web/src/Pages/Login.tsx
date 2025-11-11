import React, { useState } from 'react'
import { api } from '../api'
export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' })
    const [msg, setMsg] = useState('')


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await api.login(form)
            setMsg('Loggin successfully!!')
        }
        catch {
            setMsg("Invalid Login")
        }
    }
    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}></input>
                <br></br>
                <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}></input>
                <br></br>
                <button type="submit">Login</button>
            </form>
            <p>{msg}</p>
        </div>
    )
}
