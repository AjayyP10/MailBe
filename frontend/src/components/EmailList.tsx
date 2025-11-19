'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { formatDistanceToNow } from 'date-fns'
import { Mail, Star, AlertTriangle, Trash2 } from 'lucide-react'

interface Email {
    id: string
    subject: string
    from_address: string
    snippet: string
    received_at: string
    category: string
    is_phishing: boolean
    phishing_score: number
}

export default function EmailList({ onSelect }: { onSelect: (emailId: string) => void }) {
    const [emails, setEmails] = useState<Email[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function fetchEmails() {
            const { data, error } = await supabase
                .from('emails')
                .select('*')
                .order('received_at', { ascending: false })
                .limit(50)

            if (data) setEmails(data)
            setLoading(false)
        }

        fetchEmails()
    }, [])

    if (loading) return <div className="p-4">Loading emails...</div>

    return (
        <div className="flex flex-col w-full bg-white dark:bg-gray-900 h-full overflow-y-auto border-r border-gray-200 dark:border-gray-800">
            {emails.map((email) => (
                <div
                    key={email.id}
                    onClick={() => onSelect(email.id)}
                    className={`
            p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
            ${email.is_phishing ? 'bg-red-50 dark:bg-red-900/10' : ''}
          `}
                >
                    <div className="flex justify-between items-start mb-1">
                        <h3 className={`font-semibold text-sm truncate pr-2 ${email.is_phishing ? 'text-red-600' : 'text-gray-900 dark:text-gray-100'}`}>
                            {email.from_address}
                        </h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                            {formatDistanceToNow(new Date(email.received_at), { addSuffix: true })}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 mb-1">
                        {email.is_phishing && <AlertTriangle className="w-4 h-4 text-red-500" />}
                        <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                            {email.subject || '(No Subject)'}
                        </h4>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                        {email.snippet}
                    </p>

                    {email.category && (
                        <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                            {email.category}
                        </span>
                    )}
                </div>
            ))}
        </div>
    )
}
