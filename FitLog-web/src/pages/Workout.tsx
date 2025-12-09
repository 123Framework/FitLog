import React, { useState, useEffect } from 'react'
import { api } from '../api'
import '../Index.css'

export default function Workouts() {

    const [workouts, setWorkouts] = useState<any[]>([])
    const [form, setForm] = useState({
        title: '',
        notes: '',
        durationMin: 30,
        caloriesBurned: 200
    })

    const [msg, setMsg] = useState('')
    const [editing, setEditing] = useState<any | null>(null);
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
    const deleteWorkout = async (id: number) => {
        try {
            await api.request(`/api/workout/${id}`, { method: 'DELETE' })
            setWorkouts(workouts.filter(w => w.id !== id))
            setMsg("workout delete")
        }
        catch {
            setMsg('Failed to delete')
        }
    }

    const saveEdit = async () => {
        try {
            const updated = await api.request<any>(`/api/workout/${editing.id}`, {
                method: "PUT",
                body: JSON.stringify(editing),
            });
            setWorkouts(workouts.map(w => w.id === updated.id ? updated : w));
            setEditing(null);
            setMsg("Workout updated!");
        }
        catch {
            setMsg('Failed to edit')
        }
    }



    return (
       
        <div>
            <h1 className="text-4xl text-red-600">Hello Tailwind!</h1>
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
            {editing && (
                <div className="edit-modal">
                    <h3>Edit workout</h3>
                    <input placeholder="Title"
                        value={editing.title}
                        onChange={(e) => setEditing({ ...editing, title: e.target.value })} /><br />
                    <input placeholder="Notes"
                        value={editing.notes}
                        onChange={(e) => setEditing({ ...editing, notes: e.target.value })} /> <br />
                    <input type="number"
                        placeholder="Duration (min)"
                        value={editing.durationMin}
                        onChange={(e) => setEditing({ ...editing, durationMin: Number(e.target.value) })} /> <br />
                    <input type="number"
                        placeholder="Calories burned"
                        value={editing.caloriesBurned}
                        onChange={(e) => setEditing({ ...editing, caloriesBurned: Number(e.target.value) })} /> <br />
                    <button onClick={saveEdit }>Save</button>
                    <button onClick={() => setEditing(null) }>Cancel</button>
                </div>
            )}
            <p>{msg}</p>
            <ul>
                {workouts.map((w) => (
                    <li key={w.id}>

                        {w.title} - {w.durationMin} min ({w.caloriesBurned} kcal)
                        <button onClick={() => setEditing(w) }>Edit</button>
                        <button onClick={() => deleteWorkout(w.id)}>X</button>
                    </li>
                ))}
            </ul>

        </div>


    )
}
