'use client'

import { createClient } from '@/utils/supabase/client'

export default function Login() {
    const handleLogin = async () => {
        const supabase = createClient()
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                    scope: 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send'
                }
            },
        })
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Welcome Back</h1>
                <button
                    onClick={handleLogin}
                    className="w-full bg-black dark:bg-white text-white dark:text-black font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                    Sign in with Google
                </button>
            </div>
        </div>
    )
}
