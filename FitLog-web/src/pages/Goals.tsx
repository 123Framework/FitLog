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
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-6">
            <div className="w-full max-w-sm rounded-lg bg-white/5 p-6 shadow-lg outline outline-1 outline-white/10">

                <h1 className="text-center text-2xl font-bold text-white mb-6">
                    Your Goals
                </h1>

                <div className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-300">
                            Target Weight (kg)
                        </label>
                        <input
                            type="number"
                            value={goal?.targetWeight || ""}
                            onChange={(e) =>
                                setGoal({ ...goal, targetWeight: Number(e.target.value) })
                            }
                            className="mt-1 w-full rounded-md bg-white/5 px-3 py-2 text-white outline-1 outline-white/10 focus:outline-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300">
                            Target Date
                        </label>
                        <input
                            type="date"
                            value={goal?.targetDate?.slice(0, 10) || ""}
                            onChange={(e) =>
                                setGoal({ ...goal, targetDate: e.target.value })
                            }
                            className="mt-1 w-full rounded-md bg-white/5 px-3 py-2 text-white outline-1 outline-white/10 focus:outline-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300">
                            Daily Calories Goal
                        </label>
                        <input
                            type="number"
                            value={goal?.dailyCalories || ""}
                            onChange={(e) =>
                                setGoal({ ...goal, dailyCalories: Number(e.target.value) })
                            }
                            className="mt-1 w-full rounded-md bg-white/5 px-3 py-2 text-white outline-1 outline-white/10 focus:outline-indigo-500"
                        />
                    </div>

                    <button
                        onClick={updateGoal}
                        className="mt-4 w-full rounded-md bg-indigo-500 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
                    >
                        Save Goal
                    </button>
                </div>
            </div>
        </div>
    );
}