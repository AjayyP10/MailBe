'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { format } from 'date-fns'
import { Reply, MoreVertical, ShieldAlert } from 'lucide-react'

interface EmailDetail {
    id: string
    subject: string
    from_address: string
    to_addresses: string[]
    body_html: string
    body_text: string
    received_at: string
    is_phishing: boolean
    phishing_reason: string
}

export default function ThreadView({ emailId }: { emailId: string | null }) {
    const [email, setEmail] = useState<EmailDetail | null>(null)
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        if (!emailId) return

        async function fetchEmail() {
            setLoading(true)
            const { data } = await supabase
                .from('emails')
                .select('*')
                .eq('id', emailId)
                .single()

            if (data) setEmail(data)
            setLoading(false)
        }

        fetchEmail()
    }, [emailId])

    if (!emailId) {
        return (
            <div className="flex items-center justify-center h-full text-gray-400">
                Select an email to view
            </div>
        )
    }

    if (loading) return <div className="p-8">Loading thread...</div>
    if (!email) return <div className="p-8">Email not found</div>

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex justify-between items-start mb-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{email.subject}</h1>
                    <div className="flex gap-2">
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                            <MoreVertical className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                {email.is_phishing && (
                    <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex gap-3 items-start">
                        <ShieldAlert className="w-5 h-5 text-red-600 mt-0.5" />
                        <div>
                            <h3 className="font-bold text-red-700 dark:text-red-400">Potential Phishing Detected</h3>
                            <p className="text-sm text-red-600 dark:text-red-300 mt-1">{email.phishing_reason}</p>
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
                            {email.from_address[0].toUpperCase()}
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900 dark:text-white">{email.from_address}</div>
                            <div className="text-sm text-gray-500">to {email.to_addresses?.join(', ')}</div>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500">
                        {format(new Date(email.received_at), 'PPP p')}
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="p-8 flex-1">
                <div
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: email.body_html || email.body_text }}
                />
            </div>

            {/* Action Bar */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex gap-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    <Reply className="w-4 h-4" />
                    Reply
                </button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium">
                    Forward
                </button>
            </div>
        </div>
    )
}
