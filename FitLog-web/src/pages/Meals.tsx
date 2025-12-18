import React, { useState, useEffect } from 'react'
import { api } from '../api'
import { Meal } from "../types";
export default function Meals() {
    const [meals, setMeals] = useState<Meal[]>([]);
    const [msg, setMsg] = useState("");
    const [editing, setEditing] = useState<Meal | null>(null);
    const [form, setForm] = useState({
        name: "",
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0,
        dateTime: new Date().toISOString().slice(0, 16), //yyyy-MM-ddTHH:mm
    })
    
    //load meals
    useEffect(() => {
        api.request<any[]>("/api/Meal")
            .then((data) => setMeals(data))
            .catch(() => setMsg("not logged in!"))
    }, []);

    const addMeal = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await api.request<Meal>("/api/Meal", {
                method: "POST",
                body: JSON.stringify(form),
            });
            setMeals([result, ...meals]);
            setMsg("Meal added!");
            setForm({
                name: "",
                calories: 0,
                protein: 0,
                fat: 0,
                carbs: 0,
                dateTime: new Date().toISOString().slice(0, 16), //yyyy-MM-ddTHH:mm
            });
        }
        catch {
            setMsg("error adding meal");
        }

        
    }

    const deleteMeal = async (id: number) => {
        try {
            await api.request(`/api/Meal/${id}`, { method: "DELETE" });
            setMeals(meals.filter(m => m.id !== id));

        } catch {
            setMsg("failed to delete")
        }
    }


    const saveEdit = async () => {
        try {
            const updated = await api.request<Meal>(`/api/Meal/${editing!.id}`, {
                method: "PUT",
                body: JSON.stringify(editing),
            });
            setMeals(meals.map(m => (m.id === updated.id ? updated : m)));
            setEditing(null);
            setMsg("Meal updated!");

        }
        catch {
            setMsg("failed to edit");
        }
    }

    const total = meals.reduce(
        (acc, m) => {
            acc.cal += m.calories;
            acc.p += m.protein;
            acc.f += m.fat;
            acc.c += m.carbs;
            return acc;
        },
        {cal: 0, p: 0, f:0, c:0}
    );

    return (
        <div>
            <h2>Meals</h2>

            <form onSubmit={addMeal}>
                <input placeholder="Meal name" value={form.name} onChange={e => setForm({...form,name:e.target.value}) }/>
                <input placeholder="100Cal" value={form.calories} onChange={e => setForm({...form,calories:+e.target.value}) }/>
                <input placeholder="protein" value={form.protein} onChange={e => setForm({...form,protein:+e.target.value}) }/>
                <input placeholder="fat" value={form.fat} onChange={e => setForm({...form,fat:+e.target.value}) }/>
                <input placeholder="carbs" value={form.carbs} onChange={e => setForm({...form,carbs:+e.target.value}) }/>
                <input type="datetime-local" value={form.dateTime} onChange={e => setForm({ ...form, dateTime: e.target.value }) } />
                <button type="submit">Add meal</button>
            </form>

            <div>
                <strong>Daily total:</strong><br />
                Calories: {total.cal} kcal <br />
                Protein: {total.p} g |
                Fat: {total.f} g |
                Carbs: {total.c } g
            </div>
            <p>{msg} </p>

            <ul>

                {meals.map(m => (
                    <li key={m.id}>
                        <strong>{m.name}</strong> - {m.calories} kcal
                        <br />
                        P:{m.protein}F:{m.fat}C:{m.carbs}
                        <br />
                        <button onClick={() => setEditing(m)}>Edit</button>
                        <button onClick={() => deleteMeal(m.id)}>X</button>


                    </li>
                )) }

            </ul>
            {editing && (
                <div>
                    <h3>Edit meal</h3>
                    <input value={editing.name} onChange={e => setEditing({...editing, name: e.target.value}) }/>
                    <input value={editing.calories} onChange={e => setEditing({...editing, calories: +e.target.value}) }/>
                    <input value={editing.protein} onChange={e => setEditing({...editing, protein: +e.target.value}) }/>
                    <input value={editing.fat} onChange={e => setEditing({...editing, fat: +e.target.value}) }/>
                    <input value={editing.carbs} onChange={e => setEditing({ ...editing, carbs: +e.target.value })} />
                    <button onClick={saveEdit}>Save</button>
                    <button onClick={()=> setEditing(null) }>Cancel</button>
                </div>
            ) }
        </div>
    )

}