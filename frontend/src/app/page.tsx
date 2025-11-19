import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-cyan-500 via-teal-500 to-green-500">
            <div className="text-center space-y-10 max-w-4xl text-white">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-3xl border border-white/20">
                        <Image src="/logo.png" alt="MailBe" width={100} height={100} className="object-contain" />
                    </div>
                </div>

                {/* Hero Section */}
                <h1 className="text-6xl md:text-7xl font-bold mb-6">
                    MailBe
                </h1>

                <p className="text-2xl md:text-3xl mb-12 text-white/90 max-w-3xl mx-auto font-light">
                    Your AI-powered email assistant. Smart replies, document search, and phishing protection.
                </p>

                {/* CTA */}
                <Link
                    href="/login"
                    className="inline-block bg-white hover:bg-gray-100 text-cyan-600 font-semibold text-lg py-4 px-12 rounded-full transition-all shadow-2xl hover:shadow-3xl hover:scale-105"
                >
                    Get Started →
                </Link>

                {/* Features Preview */}
                <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/15 transition-colors">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">AI Replies</h3>
                        <p className="text-white/80">Generate smart responses instantly</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/15 transition-colors">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Document Search</h3>
                        <p className="text-white/80">Find files across cloud storage</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/15 transition-colors">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Phishing Protection</h3>
                        <p className="text-white/80">Stay safe with AI detection</p>
                    </div>
                </div>

                <div className="mt-16 text-sm text-white/60">
                    © 2025 MailBe. All rights reserved.
                </div>
            </div>
        </main>
    )
}
