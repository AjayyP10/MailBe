'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { XIcon } from '@heroicons/react/24/outline'

interface ComposeModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function ComposeModal({ isOpen, onClose }: ComposeModalProps) {
    const [to, setTo] = useState('')
    const [subject, setSubject] = useState('')
    const [body, setBody] = useState('')
    const [sending, setSending] = useState(false)

    if (!isOpen) return null

    const handleSend = async () => {
        setSending(true)
        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                alert('You must be logged in to send emails')
                return
            }

            // For MVP we just grab the first linked account
            const { data: account } = await supabase
                .from('accounts')
                .select('id')
                .eq('user_id', user.id)
                .single()

            if (!account) {
                alert('No connected email account found')
                return
            }

            const response = await fetch('http://localhost:8000/api/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ account_id: account.id, to, subject, body }),
            })

            if (!response.ok) throw new Error('Failed to send email')

            alert('Email sent successfully!')
            onClose()
            setTo('')
            setSubject('')
            setBody('')
        } catch (error) {
            console.error(error)
            alert('Error sending email')
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl p-8 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">New Message</h2>
                    <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <XIcon className="h-5 w-5" />
                    </button>
                </div>
                <div className="space-y-4">
                    <input
                        type="email"
                        placeholder="To"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Subject"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />
                    <textarea
                        placeholder="Write your message..."
                        className="w-full h-48 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                    />
                </div>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                        Discard
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={sending}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium disabled:opacity-50 flex items-center justify-center"
                    >
                        {sending ? (
                            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z" />
                            </svg>
                        ) : null}
                        {sending ? 'Sending...' : 'Send'}
                    </button>
                </div>
            </div>
        </div>
    )
}
