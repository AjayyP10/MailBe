'use client'

import { useState } from 'react'
import EmailList from '@/components/EmailList'
import ThreadView from '@/components/ThreadView'

export default function Dashboard() {
    const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null)

    return (
        <main className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
            {/* Sidebar / Email List */}
            <div className="w-1/3 min-w-[350px] max-w-[450px] h-full flex flex-col">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-white">Inbox</h1>
                </div>
                <EmailList onSelect={setSelectedEmailId} />
            </div>

            {/* Main Content / Thread View */}
            <div className="flex-1 h-full">
                <ThreadView emailId={selectedEmailId} />
            </div>
        </main>
    )
}
