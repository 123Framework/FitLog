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
interface GeneratedWorkout {

    title: string
    exercises: {
        name: string
        sets: number
        reps: string
    }[]

}

export default function Dashboard() {

    const [meals, setMeals] = useState<Meal[]>([]);
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [weights, setWeights] = useState<WeightEntry[]>([]);
    const [goal, setGoal] = useState<any | null>(null);

    const [msg, setMsg] = useState("");
    const [newWeight, setNewWeight] = useState("");

    const [messages, setMessages] = useState<{ role: "user" | "assistant", content: string }[]>([]);
    const [input, setInput] = useState("");

    const [loadingAnalysis, setLoadingAnalysis] = useState(false);

    const [language, setLanguage] = useState<"ru" | "en">("ru");

    const [generatedWorkout, setGeneratedWorkout] = useState<GeneratedWorkout | null>(null)

    async function loadGoal() {
        try {
            const g = await api.getGoal();
            setGoal(g);
        } catch { }
    }

    async function loadWeights() {
        try {
            const w = await api.request<WeightEntry[]>("/api/weight");
            setWeights(w);
        } catch { }
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
            date: key,
            label: d.toLocaleDateString("en-US", { weekday: "short" }),
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

    let weightProgress = 0;
    let weightLeft = 0;

    let mode: "lose" | "gain" | null = null;

    if (startWeight !== null && currentWeight !== null && targetWeight !== null) {
        const lose = targetWeight < startWeight;
        const total = Math.abs(startWeight - targetWeight);
        const done = Math.abs(startWeight - currentWeight);
        mode = targetWeight < startWeight ? "lose" : "gain";
        weightLeft = Math.abs(currentWeight - targetWeight);
        weightProgress = Math.min(100, Math.max(0, (done / total) * 100));
    }

    const weightTrend = sortedWeights.map(w => ({
        date: new Date(w.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric"
        }),
        weight: w.weightKg
    }));



    const runWeeklyAnalysis = async () => {
        setLoadingAnalysis(true);

        const context = {
            weightTrend,
            last7Calories,
            dailyCaloriesOut: last7Calories.map(day =>
                workouts
                    .filter(w => w.dateTime?.slice(0, 10) === day.date)
                    .reduce((s, w) => s + w.caloriesBurned, 0)
            ),
            goal: goal || null,
            mealsLast7Days: meals.filter(m => new Date(m.dateTime) >= sevenDaysAgo),
            workoutsLast7Days: workouts.filter(w => new Date(w.dateTime!) >= sevenDaysAgo)
        };

        const systemLang = language === "ru" ? "Отвечай на русском языке." : "answer in english";

        const res = await fetch("https://localhost:7061/api/ai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: `
You are an AI Fitness Coach.
Provide a detailed WEEKLY fitness analysis:

1. Weekly performance summary  
2. Nutrition review  
3. Training review  
4. Weight goal progress  
5. Specific recommendations  
6. Estimated time to reach goal  
7. Encouraging summary
${systemLang}
`
                    },
                    {
                        role: "system",
                        content: "DATA: " + JSON.stringify(context)
                    },
                    { role: "user", content: "Give me a full weekly fitness analysis." }
                ]
            })
        });

        const data = await res.json();

        setMessages(prev => [...prev, {
            role: "assistant",
            content: data.reply
        }]);

        setLoadingAnalysis(false);
    };


    async function sendMessage() {
        if (!input.trim()) return;

        const msgs = [...messages, { role: "user" as const, content: input }];
        setMessages(msgs);
        setInput("");

        const systemLang = language === "ru" ? "Отвечай на русском языке." : "answer in english";

        const res = await fetch("https://localhost:7061/api/ai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: systemLang },
                    ...msgs
                ]
            }),
        });

        const data = await res.json();

        setMessages(prev => [
            ...prev,
            { role: "assistant", content: data.reply }
        ]);
    }
    async function generateWorkout() {
        const goalType = goal?.targetWeight && currentWeight && goal.targetWeight < currentWeight ? "fat loss" : "muscle gain";
        const systemLang = language === "ru" ? "Отвечай на русском языке" : "Answer in english";
        const res = await fetch("https://localhost:7061/api/ai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: `
                        You re a professional fitness trainer
                       Generate a workout in JSON format
                       Format:
                       {
                           "title":"",
                           "exercises":[{"name":"", "sets":0, "reps":""}]

                       }
                       Goal: ${goalType}

                        ${systemLang}
                        `

                    },
                    {
                        role: "user",
                        content: "Generate today's workout"
                    }
                ]
            })
        })
        const data = await res.json();

        try {
            let clean = data.reply
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();
            const workout = JSON.parse(data.reply)
            setGeneratedWorkout(workout)

        }
        catch {
            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: data.reply
                }
            ]);
        }


    }


    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
            <h1 className="text-4xl font-bold mb-4">Dashboard</h1>

            {msg && <p className="text-red-500">{msg}</p>}

            <div className="mb-4 flex gap-3">
                <button onClick={() => setLanguage("ru")} className={`px-3 py-1 rounded ${language === "ru" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                    Русский
                </button>
                <button onClick={() => setLanguage("en")} className={`px-3 py-1 rounded ${language === "en" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                    English
                </button>
            </div>

            <button
                onClick={runWeeklyAnalysis}
                className="w-full bg-purple-600 text-white py-2 rounded mb-4 hover:bg-purple-500"
            >
                Run Weekly AI Analysis
            </button>
            <button
                onClick={generateWorkout} className="w-full bg-green-600 text-white py-2 rounded mb-4 hover:bg-green-500"
            >Ai workout generator</button>
            {loadingAnalysis && (
                <p className="text-center text-gray-600 mb-4">Analyzing last 7 days...</p>
            )}


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
                            <span className={`inline-block px-3 py-2 rounded-lg${m.role === "user" ? "bg-blue-200" : "bg-green-200"
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
                <button onClick={runWeeklyAnalysis} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-500 w-full mt-4">
                    Weekly AI Analysis</button>
            </div>
            {generatedWorkout && (
                <div className="bg-white shadow rounded-xl p-4 mt-6">

                    <h2 className="text-xl font-bold mb-3">{generatedWorkout.title}</h2>
                    <div className="space-y-2">
                        {generatedWorkout.exercises.map((ex, i) => (
                            <div key={i} className="flex justify-between border p-2 rounded">

                                <span>{ex.name}</span>
                                <span>{ex.sets}X{ex.reps}</span>

                            </div>
                        ))}
                    </div>
                    <button onClick={async () => {
                        const newWorkout =  await api.request<Workout>("/api/workout", {
                            method: "POST",
                            body: JSON.stringify({
                                title: generatedWorkout.title,
                                notes: "AI generated workout",
                                durationMin: 30,
                                caloriesBurned: 200,
                                dateTime: new Date().toISOString()
                            })
                        })
                        setWorkouts(prev => [newWorkout, ...prev]);
                        setGeneratedWorkout(null);
                        setMsg("Workout saved!");
                    }
                    }
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded w-full">Save workout
                    </button>

                </div>
            )}

        </div>

    )
}

