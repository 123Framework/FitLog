export interface Meal {
    id: number;
    dateTime: string;
    name: string;
    calories: number;
    protein: number;
    fat: number;
    carbs: number;

}
export interface Workout {
    id: number;
    title: string;
    notes: string;
    durationMin: number;
    caloriesBurned: number;
    dateTime?: string;

}
