import Link from 'next/link'

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                MailMCP
            </h1>
            <p className="text-xl mb-8 text-center max-w-2xl">
                Your AI-powered email assistant. Smart replies, document search, and phishing protection.
            </p>
            <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg hover:shadow-xl"
            >
                Get Started
            </Link>
        </main>
    )
}
