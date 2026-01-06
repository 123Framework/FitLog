import React, { useEffect, useState } from "react";
import { api } from "../api";
import { Meal, Workout } from "../types";
import {
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
    const [meals, setMeals] = useState<Meal[]>([]);
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [msg, setMsg] = useState("");



    useEffect(() => {
        async function load() {
            try {
                const m = await api.request<Meal[]>("/api/meal");
                const w = await api.request<Workout[]>("/api/workout");
                setMeals(m);
                setWorkouts(w);

            } catch {
                setMsg("Not logged in")
            }
        }
        load();
    }, []);
    const today = new Date().toISOString().slice(0, 10);
    const todayMeals = meals.filter(m => m.dateTime.slice(0, 10) === today);
    const todayWorkouts = workouts.filter(w => w.dateTime?.slice(0, 10) === today);
    const caloriesIn = todayMeals.reduce((s, m) => s + m.calories, 0);
    const protein = todayMeals.reduce((s, m) => s + m.protein, 0);
    const fat = todayMeals.reduce((s, m) => s + m.fat, 0);
    const carbs = todayMeals.reduce((s, m) => s + m.carbs, 0);
    const caloriesOut = todayWorkouts.reduce((s, w) => s + w.caloriesBurned, 0);

    const net = caloriesIn - caloriesOut;

    const last7 = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dKey = d.toISOString().slice(0, 10);
        const dayMeals = meals.filter(m => m.dateTime.slice(0, 10) === dKey);
        const cal = dayMeals.reduce((s, m) => s + m.calories, 0);


        return {
            date: d.toLocaleDateString("en-US", { weekday: "short" }),
            calories: cal,
        };
    }).reverse();

    const macroData = [
        { name: "Protein", value: protein },
        { name: "Fat", value: fat },
        { name: "Carbs", value: carbs },
    ];
    const COLORS = ["#3b82f6", "#ef4444", "#22c55e"];

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
            <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
            {msg && <p className="text-red-500">{msg}</p>}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-xl shadow text-center">
                    <p className="text-gray-500">Calories in</p>
                    <p className="text-2xl font-bold">{caloriesIn} kcal</p>
                </div>
                <div className="p-4 bg-white rounded-xl shadow text-center">
                    <p className="text-gray-500">Calories out</p>
                    <p className="text-2xl font-bold">{caloriesOut} kcal</p>
                </div>
                <div className="p-4 bg-white rounded-xl shadow text-center">
                    <p className="text-gray-500">Net</p>
                    <p className={`text-2xl font-bold ${net >= 0 ? "text-red-500" : "text-green-600"}`}>{net} kcal</p>
                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-white shadow rounded-xl">
                    <h2 className="text-xl font-semibold mb-4">Calories (last 7 days)</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={last7}>
                            <Line type="monotone" dataKey="calories" stroke="#3b82f6" strokeWidth={3} />
                            <Tooltip />
                            <Legend />

                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="p-4 bg-white shadow rounded-xl">
                    <h2 className="text-xl font-semibold mb-4">Macros Today</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={macroData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={80}
                                fill="#8884d8"
                                label>
                                {macroData.map((entry, index) => (<Cell key={index} fill={COLORS[index]} />))}
                            </Pie>
                            <Tooltip />
                            <Legend />

                        </PieChart>
                    </ResponsiveContainer>
                </div>
                {/*<div className="p-4 bg-gray-100 rounded-lg space-y-2">*/}
                {/*    <p><strong>Calories in: </strong>{caloriesIn} kcal</p>*/}
                {/*    <p><strong>Calories out: </strong>{caloriesOut} kcal</p>*/}
                {/*    <p><strong>Net Balance: </strong>{net} kcal</p>*/}
                {/*    <hr></hr>*/}
                {/*    <p><strong>Protein: </strong>{protein} g</p>*/}
                {/*    <p><strong>Fat: </strong> {fat} g</p>*/}
                {/*    <p><strong>Carbs: </strong> {carbs} g</p>*/}
                {/*</div>*/}

            </div>
        </div>

    )

}