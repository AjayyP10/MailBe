'use client'

import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'

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
                    scope: 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send',
                },
            },
        })
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-black">
            <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl space-y-8">
                {/* Logo placeholder */}
                <div className="flex justify-center mb-4">
                    <Image src="/logo.svg" alt="MailBe" width={80} height={80} className="object-contain" />
                </div>
                <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
                    Welcome to MailBe
                </h1>
                <button
                    onClick={handleLogin}
                    className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                    <svg
                        className="w-5 h-5"
                        viewBox="0 0 533.5 544.3"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M533.5 278.4c0-17.7-1.6-35-4.6-51.7H272v97.9h146.9c-6.4 34.9-25.6 64.5-54.5 84.3v70.1h88.1c51.6-47.5 81.5-117.5 81.5-200.6z"
                            fill="#4285F4"
                        />
                        <path
                            d="M272 544.3c73.6 0 135.4-24.5 180.5-66.5l-88.1-70.1c-24.5 16.5-55.8 26.2-92.4 26.2-71 0-131.2-47.9-152.8-112.3H30.5v70.7C75.9 475.5 167.5 544.3 272 544.3z"
                            fill="#34A853"
                        />
                        <path
                            d="M119.2 321.6c-10.5-31.5-10.5-65.5 0-97l-88.7-70.7C7.9 191.5 0 226.5 0 272s7.9 80.5 30.5 117.9l88.7-70.7z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M272 107.7c39.9 0 75.8 13.7 104.1 40.6l78.2-78.2C418.2 24.5 356.4 0 272 0 167.5 0 75.9 68.8 30.5 166.1l88.7 70.7C140.8 155.6 201 107.7 272 107.7z"
                            fill="#EA4335"
                        />
                    </svg>
                    Sign in with Google
                </button>
            </div>
        </div>
    )
}
