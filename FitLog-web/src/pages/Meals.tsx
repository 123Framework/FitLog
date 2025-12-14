import React, { useState, useEffect } from 'react'
import { api } from '../api'

export default function Meals() {
    const [meals, setMeals] = useState<any[]>([]);
    const [msg, setMsg] = useState("");

    const [form, setForm] = useState({
        name: "",
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0,
        dateTime: new Date().toISOString().slice(0, 16), //yyyy-MM-ddTHH:mm
    })
    const [editing, setEditing] = useState<any | null>(null);
    //load meals
    useEffect(() => {
        api.request<any[]>("/api/meal")
            .then((data) => setMeals(data))
            .catch(() => setMsg("not logged in!"))
    }, []);

    const addMeal = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await api.request("/api/meal", {
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
            await api.request(`/api/meal/${id}`, { method: "DELETE" });
            setMeals(meals.filter(m => m.id !== id));

        } catch {
            setMsg("failed to delete")
        }
    }


    const saveEdit = async () => {
        try {
            const updated = await api.request(`/api/meal/${editing.id}`, {
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
}