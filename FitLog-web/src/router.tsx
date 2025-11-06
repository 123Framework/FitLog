import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Register from './pages/Register'

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login></Login>} />
                <Route path="/login" element={<Login></Login>} />
                <Route path="/register" element={<Register></Register>} />
                <Route path="/profile" element={<Profile></Profile>} />
            </Routes>
        </BrowserRouter>
    )
}
