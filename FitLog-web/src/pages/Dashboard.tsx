import React, { useEffect, useState } from "react";
import { api } from "../api";
import { Meal, WeightEntry, Workout } from "../types";

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
    const [weights, setWeights] = useState<WeightEntry[]>([]);
    const [goal, setGoal] = useState<any | null>(null);

    const [msg, setMsg] = useState("");
    const [newWeight, setNewWeight] = useState("");

    async function loadGoal() {
        try {
            const g = await api.getGoal();
            setGoal(g);
        } catch {
            console.log("No goal set");
        }
    }

    async function loadWeights() {
        try {
            const w = await api.request<WeightEntry[]>("/api/weight");
            setWeights(w);
        } catch { }
    }

    interface ChatMessage {
        role: "user" | "assistant";
        content: string;
    }
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");

    async function sendMessage() {
        if (!input.trim()) return;

        const newMessages: ChatMessage[] = [
            ...messages,
            { role: "user", content: input }
        ];
        setMessages(newMessages);
        setInput("");

        const contextInfo = `
        User current stats:
        - Today calories: ${caloriesIn}
        - Today protein: ${protein}g, fat: ${fat}g, carbs: ${carbs}g
        - Calories out today: ${caloriesOut}
        - Weight: start ${startWeight ?? "?"}kg, now ${currentWeight ?? "?"}kg, target ${targetWeight ?? "?"}kg
        - Weight progress: ${weightProgress.toFixed(1) }%

        Goals:
        - Daily calories goal: ${goal?.dailyCalories ?? "not set"}
        - Weight direction: ${mode ?? "unknown"}
        `;

        const apiKey = import.meta.env.VITE_OPENAI_KEY;

        const res = await fetch("https://localhost:7061/api/ai", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
                
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "Ты фитнес-ассистент. Давай простые, полезные советы без медицинских диагнозов." },
                    { role: "system", content: contextInfo },
                    ...newMessages
                ]
            }),

        });

        const data = await res.json();
        const aiReply = data.reply ?? "Error";

        setMessages([
            ...newMessages,
            { role: "assistant", content: aiReply }
        ]);
    }


    useEffect(() => {
        async function load() {
            try {
                const m = await api.request<Meal[]>("/api/meal");
                const w = await api.request<Workout[]>("/api/workout");

                setMeals(m);
                setWorkouts(w);
            } catch {
                setMsg("Not logged in");
            }
        }

        load();
        loadWeights();
        loadGoal();
    }, []);

    const today = new Date().toISOString().slice(0, 10);

    const todayMeals = meals.filter(m => m.dateTime.slice(0, 10) === today);
    const todayWorkouts = workouts.filter(w => w.dateTime?.slice(0, 10) === today);

    const caloriesIn = todayMeals.reduce((s, m) => s + m.calories, 0);
    const protein = todayMeals.reduce((s, m) => s + m.protein, 0);
    const fat = todayMeals.reduce((s, m) => s + m.fat, 0);
    const carbs = todayMeals.reduce((s, m) => s + m.carbs, 0);
    const caloriesOut = todayWorkouts.reduce((s, w) => s + w.caloriesBurned, 0);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const caloriesIn7 = meals
        .filter(m => new Date(m.dateTime) >= sevenDaysAgo)
        .reduce((s, m) => s + m.calories, 0);

    const caloriesOut7 = workouts
        .filter(w => new Date(w.dateTime ?? "") >= sevenDaysAgo)
        .reduce((s, w) => s + w.caloriesBurned, 0);

    const net7 = caloriesIn7 - caloriesOut7;

    const last7Calories = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);

        const key = d.toISOString().slice(0, 10);
        const mealsDay = meals.filter(m => m.dateTime.slice(0, 10) === key);
        const cal = mealsDay.reduce((s, m) => s + m.calories, 0);

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

    const sortedWeights = [...weights].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const startWeight = sortedWeights.length ? sortedWeights[0].weightKg : null;
    const currentWeight = sortedWeights.length ? sortedWeights[sortedWeights.length - 1].weightKg : null;
    const targetWeight = goal?.targetWeight ?? null;

    let mode: "lose" | "gain" | null = null;
    let weightProgress = 0;
    let weightLeft = 0;

    //if (startWeight !== null && targetWeight !== null) {
    //    mode = targetWeight < startWeight ? "lose" : "gain";
    //}

    if (startWeight === null || currentWeight === null || targetWeight === null) {
        weightLeft = 0;
        weightProgress = 0;

    }
    else {
        const mode: "lose" | "gain" =
            targetWeight < startWeight ? "lose" : "gain";

        if (mode === "lose" && currentWeight !== null) {
            const total = startWeight - targetWeight;
            const done = startWeight - currentWeight;

            weightLeft = currentWeight - targetWeight;
            weightProgress = Math.min(100, Math.max(0, (done / total) * 100));
        }

        if (mode === "gain" && currentWeight !== null) {
            const total = targetWeight - startWeight;
            const done = currentWeight - startWeight;

            weightLeft = targetWeight - currentWeight;
            weightProgress = Math.min(100, Math.max(0, (done / total) * 100));
        }
    }

    const weightTrend = sortedWeights.map(w => ({
        date: new Date(w.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric"
        }),
        weight: w.weightKg
    }));

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
            <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
            {msg && <p className="text-red-500">{msg}</p>}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-xl shadow text-center">
                    <p className="text-gray-500">Calories in (7 days)</p>
                    <p className="text-2xl font-bold">{caloriesIn7} kcal</p>
                </div>
                <div className="p-4 bg-white rounded-xl shadow text-center">
                    <p className="text-gray-500">Calories out</p>
                    <p className="text-2xl font-bold">{caloriesOut7} kcal</p>
                </div>
                <div className="p-4 bg-white rounded-xl shadow text-center">
                    <p className="text-gray-500">Net</p>
                    <p className={`text-2xl font-bold ${net7 >= 0 ? "text-red-500" : "text-green-600"}`}>
                        {net7} kcal
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="p-4 bg-white shadow rounded-xl">
                    <h2 className="text-xl font-semibold mb-4">Calories (last 7 days)</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={last7Calories}>
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
                            <Pie
                                data={macroData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={80}
                                label
                            >
                                {macroData.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="p-4 bg-white shadow rounded-xl col-span-2">
                    <h2 className="text-xl font-semibold mb-4">Weight Trend</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={weightTrend}>
                            <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={3} />
                            <Tooltip />
                        </LineChart>
                    </ResponsiveContainer>
                </div>


                <div className="p-4 bg-white shadow rounded-xl flex items-center gap-3 col-span-2">
                    <input
                        type="number"
                        step="0.1"
                        className="border p-2 rounded w-32"
                        placeholder="Weight (kg)"
                        value={newWeight}
                        onChange={(e) => setNewWeight(e.target.value)}
                    />
                    <button
                        onClick={async () => {
                            await api.request("/api/weight", {
                                method: "POST",
                                body: JSON.stringify({
                                    weightKg: Number(newWeight),
                                    date: new Date().toISOString(),
                                }),
                            });
                            setNewWeight("");
                            loadWeights();
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Save
                    </button>
                </div>

                {/* CALORIES PROGRESS BAR */}
                {goal?.dailyCalories && (
                    <div className="col-span-2">
                        <p>Calories progress:</p>
                        <div className="w-full bg-gray-200 h-3 rounded">
                            <div
                                className="bg-green-500 h-3 rounded"
                                style={{
                                    width: `${Math.min(100, (caloriesIn / goal.dailyCalories) * 100)}%`,
                                }}
                            />
                        </div>
                        <p>{((caloriesIn / goal.dailyCalories) * 100).toFixed(1)}%</p>
                    </div>

             
                )}

                {goal?.targetWeight && currentWeight !== null && (
                    <div className="p-4 bg-white shadow rounded-xl col-span-2">
                        <h2 className="text-xl font-semibold mb-2">
                            {mode === "lose" ? "Weight Loss Progress" : "Weight Gain Progress"}
                        </h2>

                        <p className="text-gray-600">
                            Start: {startWeight} kg — Now: {currentWeight} kg — Target: {targetWeight} kg
                        </p>

                        <div className="w-full bg-gray-200 h-4 rounded mt-2">
                            <div
                                className="bg-blue-600 h-4 rounded transition-all"
                                style={{ width: `${weightProgress}%` }}
                            />
                        </div>

                        <p className="mt-2 font-semibold">
                            Progress: {weightProgress.toFixed(1)}%
                            <span className="text-gray-500 ml-2">
                                ({weightLeft.toFixed(1)} kg remaining)
                            </span>
                        </p>
                    </div>
                )}

                <div className="p-4 bg-white shadow rounded-xl col-span-2 mt-6">
                    <h2 className="text-xl font-semibold mb-2">AI Fitness Assistant</h2>
                    <div className="h-60 overflow-y-auto border p-3 rounded bg-gray-50 mb-4 space-y-3">
                        {messages.map((m, i) => (
                            <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                                <span className={`inline-block px-3 py-2 rounded-lg${
                                    m.role === "user" ? "bg-blue-200" : "bg-green-200"
                                    }`}>{m.content}</span>
                                    </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input className="border p-2 rounded flex-1"
                            placeholder="Ask AI about your progress"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()} />

                        <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 rounded">
                        Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
