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

        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
            <h1 className="text-4xl text-red-600">Hello Tailwind!</h1>
            <h2 className="text-3xl font-bold mb-6">Workouts</h2>
            <form className="space-y-3 mb-6" onSubmit={addWorkout}>
                <input className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400" placeholder="Title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })} /><br />
                <input className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400" placeholder="Notes"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })} /> <br />
                <input className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400" type="number"
                    placeholder="Duration (min)"
                    value={form.durationMin}
                    onChange={(e) => setForm({ ...form, durationMin: Number(e.target.value) })} /> <br />
                <input className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400" type="number"
                    placeholder="Calories burned"
                    value={form.caloriesBurned}
                    onChange={(e) => setForm({ ...form, caloriesBurned: Number(e.target.value) })} /> <br />
                <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700" type="submit">Add workout</button>

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
                    <button onClick={saveEdit}>Save</button>
                    <button onClick={() => setEditing(null)}>Cancel</button>
                </div>
            )}
            <p>{msg}</p>
            <ul className="space-y-4">
                {workouts.map((w) => (
                    <li className="p-4 bg-gray-100 rounded-lg shadow flex justify-between items-center" key={w.id}>
                        <p className="font-semibold text-lg">{w.title}</p>
                        <p className="text-sm text-gray-600">{w.durationMin} min ({w.caloriesBurned} kcal)</p>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600" onClick={() => setEditing(w)}>Edit</button>
                            <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700" onClick={() => deleteWorkout(w.id)}>X</button>
                        </div>
                    </li>
                ))}
            </ul>

        </div>


    )
}
