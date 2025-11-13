import React, { useState,useEffect } from 'react'
import { api } from '../api'
export default function Profile() {

    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        api.me()
            .then(setUser)
            .catch(() => setUser(null))
    }, [])
    if (!user) return <p>Not logged in</p>
    
    return (
        <div>
            <h2>Profile</h2>
            <p>?? Username: {user.email}</p>
            <p>Display name:{ user.displayName}</p>
            <p>Height:{ user.heightCm}cm</p>
            <p>Weight:{ user.weightKg}kg</p>
        </div>
    )

}