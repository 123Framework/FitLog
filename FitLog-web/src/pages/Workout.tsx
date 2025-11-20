import React, { useState, useEffect } from 'react'
import { api } from '../api'

export default function Workouts() {

    const [workouts, setWorkouts] = useState<any[]>([])
    const [form, setForm] = userState({
        title: '',
        notes: '',
        durationMin: 30,
        caloriesBurned:200
    })

    const [msg, setMsg] = useState('')
    useEffect(() => {
        api.request('/api/workout')
            .then(setWorkouts)
            .catch(()=>setMsg('Not logged in'))
    }, [])

}
