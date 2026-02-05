import React, { useState, useEffect } from 'react'
import { api } from '../api'
export default function Profile() {

    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        api.me()
            .then(setUser)
            .catch(() => setUser(null))
    }, [])
    if (!user) return (<div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400">Not logged in</p>
    </div>)

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-6">
            <div className="w-full max-w-sm rounded-lg bg-white/5 p-6 shadow-lg outline outline-1 outline-white/10">
                <h2 className="text-center text-2xl font-bold text-white mb-6">Profile</h2>
                <div className="space-y-3 text-sm text-white">

                    <div className="flex justify-between">
                        <span>Email</span>
                        <span className="text-white">{ user.email}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Display Name</span>
                        <span className="text-white">{ user.displayName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Height</span>
                        <span className="text-white">{ user.heightCm}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Weight</span>
                        <span className="text-white">{ user.weightKg}</span>
                    </div>
                    
                </div>
                
            </div>
        </div>
    )

}