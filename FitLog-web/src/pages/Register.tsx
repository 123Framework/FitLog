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
    )

}

