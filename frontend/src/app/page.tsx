import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-black">
            <div className="text-center space-y-8 max-w-4xl">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <Image src="/logo.svg" alt="MailBe" width={120} height={120} className="object-contain" />
                </div>

                {/* Hero Section */}
                <h1 className="text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                    MailBe
                </h1>

                <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                    Your AI-powered email assistant. Smart replies, document search, and phishing protection.
                </p>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-6 my-12">
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">AI Replies</h3>
                        <p className="text-gray-600 dark:text-gray-400">Generate smart email responses with AI</p>
                    </div>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Document Search</h3>
                        <p className="text-gray-600 dark:text-gray-400">Search across your cloud documents</p>
                    </div>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Phishing Protection</h3>
                        <p className="text-gray-600 dark:text-gray-400">Stay safe with AI-powered detection</p>
                    </div>
                </div>

                {/* CTA */}
                <Link
                    href="/login"
                    className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-10 rounded-full transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                >
                    Get Started
                </Link>
            </div>
        </main>
    )
}
