'use client'

import Image from 'next/image'
import { useState } from 'react'
import EmailList from '@/components/EmailList'
import ThreadView from '@/components/ThreadView'
import ComposeModal from '@/components/ComposeModal'

export default function Dashboard() {
    const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null)
    const [isComposeOpen, setIsComposeOpen] = useState(false)

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-100 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
                <div className="flex items-center space-x-3">
                    <Image src="/logo.svg" alt="MailBe" width={40} height={40} className="object-contain" />
                    <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">MailBe</h1>
                </div>
                <button
                    onClick={() => setIsComposeOpen(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-full transition-colors"
                >
                    + Compose
                </button>
            </header>

            <main className="flex overflow-hidden">
                {/* Sidebar / Email List */}
                <aside className="w-80 min-w-[280px] border-r border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 overflow-y-auto">
                    <EmailList onSelect={setSelectedEmailId} />
                </aside>

                {/* Thread View */}
                <section className="flex-1 bg-white dark:bg-gray-900 p-6 overflow-y-auto">
                    <ThreadView emailId={selectedEmailId} />
                </section>
            </main>

            <ComposeModal isOpen={isComposeOpen} onClose={() => setIsComposeOpen(false)} />
        </div>
    )
}
