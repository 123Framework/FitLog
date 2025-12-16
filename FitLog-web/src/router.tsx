import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Register from './pages/Register'
import Workouts from './pages/Workout'
import Meals from './pages/Meals'

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login></Login>} />
                <Route path="/login" element={<Login></Login>} />
                <Route path="/register" element={<Register></Register>} />
                <Route path="/profile" element={<Profile></Profile>} />
                <Route path="/workout" element={<Workouts></Workouts>} />
                <Route path="/meals" element={<Meals></Meals> }/>
            </Routes>
        </BrowserRouter>
    )

}
