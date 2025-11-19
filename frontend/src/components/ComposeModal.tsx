'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

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

            // Get the first connected account for now (MVP)
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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    account_id: account.id,
                    to,
                    subject,
                    body
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to send email')
            }

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">New Message</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
                        ✕
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <input
                            type="email"
                            placeholder="To"
                            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Subject"
                            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                    </div>
                    <div>
                        <textarea
                            placeholder="Write your message..."
                            className="w-full h-64 p-2 border border-gray-300 dark:border-gray-700 rounded bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex justify-end mt-6 space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                        Discard
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={sending}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium disabled:opacity-50"
                    >
                        {sending ? 'Sending...' : 'Send'}
                    </button>
                </div>
            </div>
        </div>
    )
}
