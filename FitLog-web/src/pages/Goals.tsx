import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function Goals() {
    const [goal, setGoal] = useState<any>(null);

    useEffect(() => {
        api.getGoal().then(setGoal);
    }, []);
    const updateGoal = async () => {
        const updated = await api.setGoal(goal);
        setGoal(updated);
    };



    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
            <h1 className="text-3xl font-bold mb-4">Your Goals</h1>
        <label>Target Weight (kg)</label>
            <input type="number"
                className="input"
                value={goal?.targetWeight || ""}
                onChange={(e) => setGoal({...goal, targetWeight: Number(e.target.value)}) }
            >
            </input>

            <label>Target Date</label>
            <input type="date" className="input" value={goal?.targetDate?.slice(0, 10) || ""} onChange={(e) => setGoal({...goal, targetDate: e.target.value}) }></input>

            <label>Daily Calories Goal</label>
            <input type="number"
                className="input"
                value={goal?.dailyCalories || ""}
                onChange={(e) => setGoal({ ...goal, dailyCalories: Number(e.target.value) })} />

            <button onClick={updateGoal } className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Save Goal</button>
        </div>

    )
}