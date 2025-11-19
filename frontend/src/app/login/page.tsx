'use client'

import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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
        <div className="flex min-h-screen bg-gradient-to-br from-cyan-500 via-teal-500 to-green-500">
            {/* Left Side - Hero Section */}
            <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-center text-white">
                <div>
                    <div className="flex items-center gap-3 mb-16">
                        <div className="bg-white/10 backdrop-blur-sm p-2 rounded-xl border border-white/20">
                            <Image src="/logo.png" alt="MailBe" width={40} height={40} className="object-contain" />
                        </div>
                        <h1 className="text-3xl font-bold">MailBe</h1>
                    </div>

                    <div className="max-w-md space-y-8">
                        <div>
                            <h2 className="text-5xl font-bold mb-6 leading-tight">
                                Master your inbox with AI-powered intelligence
                            </h2>
                            <p className="text-lg text-white/90">
                                Your personal AI email assistant that delivers smart replies, document search, and advanced phishing protection.
                            </p>
                        </div>

                        {/* Feature Cards */}
                        <div className="space-y-4">
                            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/15 transition-colors">
                                <CardContent className="flex items-center gap-4 p-5">
                                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">AI Smart Replies</h3>
                                        <p className="text-sm text-white/80">Context-aware email responses</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/15 transition-colors">
                                <CardContent className="flex items-center gap-4 p-5">
                                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Document Search</h3>
                                        <p className="text-sm text-white/80">Find files across cloud storage</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/15 transition-colors">
                                <CardContent className="flex items-center gap-4 p-5">
                                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Phishing Protection</h3>
                                        <p className="text-sm text-white/80">AI-powered threat detection</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-8 text-center">
                        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20 inline-block mb-4">
                            <Image src="/logo.png" alt="MailBe" width={50} height={50} className="mx-auto" />
                        </div>
                        <h1 className="text-3xl font-bold text-white">MailBe</h1>
                    </div>

                    <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-3xl font-bold text-white">Welcome back</CardTitle>
                            <CardDescription className="text-gray-400">
                                Sign in to access your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button
                                onClick={handleLogin}
                                variant="secondary"
                                size="lg"
                                className="w-full bg-white hover:bg-gray-100 text-gray-800 font-medium"
                            >
                                <svg className="w-5 h-5 mr-3" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M533.5 278.4c0-17.7-1.6-35-4.6-51.7H272v97.9h146.9c-6.4 34.9-25.6 64.5-54.5 84.3v70.1h88.1c51.6-47.5 81.5-117.5 81.5-200.6z" fill="#4285F4" />
                                    <path d="M272 544.3c73.6 0 135.4-24.5 180.5-66.5l-88.1-70.1c-24.5 16.5-55.8 26.2-92.4 26.2-71 0-131.2-47.9-152.8-112.3H30.5v70.7C75.9 475.5 167.5 544.3 272 544.3z" fill="#34A853" />
                                    <path d="M119.2 321.6c-10.5-31.5-10.5-65.5 0-97l-88.7-70.7C7.9 191.5 0 226.5 0 272s7.9 80.5 30.5 117.9l88.7-70.7z" fill="#FBBC05" />
                                    <path d="M272 107.7c39.9 0 75.8 13.7 104.1 40.6l78.2-78.2C418.2 24.5 356.4 0 272 0 167.5 0 75.9 68.8 30.5 166.1l88.7 70.7C140.8 155.6 201 107.7 272 107.7z" fill="#EA4335" />
                                </svg>
                                Continue with Google
                            </Button>

                            <p className="text-center text-sm text-gray-400">
                                By continuing, you agree to our{' '}
                                <span className="text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer">
                                    Terms of Service
                                </span>{' '}
                                and{' '}
                                <span className="text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer">
                                    Privacy Policy
                                </span>
                                .
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
