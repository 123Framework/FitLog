import React, { useState } from 'react'
import { api } from '../api'
export default function Register() {
    const [form, setForm] = useState({ username: '', password: '' })
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
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}>
                </input>
                <br></br>
                <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}></input>
                <br></br>
                <button type="submit">Register</button>
            
            </form>
            <p>{ msg}</p>
        </div>
    )

}

