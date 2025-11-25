import React, { useState, useEffect } from 'react'
import { api } from '../api'

export default function Workouts() {

    const [workouts, setWorkouts] = useState<any[]>([])
    const [form, setForm] = useState({
        title: '',
        notes: '',
        durationMin: 30,
        caloriesBurned: 200
    })

    const [msg, setMsg] = useState('')
    useEffect(() => {
        api.request('/api/workout')
            .then(setWorkouts)
            .catch(() => setMsg('Not logged in'))
    }, [])
    const addWorkout = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const result = await api.request('/api/workout', {
                method: 'POST',
                body: JSON.stringify(form),
            })
            setWorkouts([result, ...workouts])
            setForm({ title: '', notes: '', durationMin: 30, caloriesBurned: 200 })
            setMsg('Workout added!')
        } catch {
            setMsg('Error adding workout')
        }
    }

    return (
        <div>
            <h2>Workouts</h2>
            <form onSubmit={addWorkout}>
                <input placeholder="Title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })} /><br />
                <input placeholder="Notes"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })} /> <br />
                <input type="number"
                    placeholder="Duration (min)"
                    value={form.durationMin}
                    onChange={(e) => setForm({ ...form, durationMin: Number(e.target.value) })} /> <br />
                <input type="number"
                    placeholder="Calories burned"
                    value={form.caloriesBurned}
                    onChange={(e) => setForm({ ...form, caloriesBurned: Number(e.target.value) })} /> <br />
                <button type="submit">Add workout</button>

            </form>

            <p>{msg}</p>
            <ul>
                {workouts.map((w) => (
                    <li key={w.id}>
                        {w.title} - {w.durationMin} min ({w.caloriesBurned} kcal)
                    </li>
                ))}
            </ul>
        </div>
    )
}
