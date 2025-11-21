import React, { useState } from 'react';
import { Email } from '../types';

interface EmailViewProps {
  email: Email | null;
  onGenerateReply?: (emailId: string, prompt: string) => Promise<string>;
  onScanPhishing?: (emailId: string) => Promise<void>;
}

const EmailView: React.FC<EmailViewProps> = ({ email, onGenerateReply, onScanPhishing }) => {
  const [replyPrompt, setReplyPrompt] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  if (!email) {
    return (
      <div className="email-view">
        <p>Select an email to view</p>
      </div>
    );
  }

  const handleGenerateReply = async () => {
    if (!onGenerateReply) return;
    setIsGenerating(true);
    try {
      const reply = await onGenerateReply(email.id, replyPrompt || 'Generate a professional reply');
      setGeneratedReply(reply);
    } catch (error) {
      console.error('Failed to generate reply:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleScanPhishing = async () => {
    if (!onScanPhishing) return;
    setIsScanning(true);
    try {
      await onScanPhishing(email.id);
    } catch (error) {
      console.error('Failed to scan for phishing:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Scam': return '#dc3545';
      case 'Potential Scam': return '#ffc107';
      case 'Promotional': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  return (
    <div className="email-view">
      <h2>{email.subject}</h2>
      <div className="meta">
        <p><strong>From:</strong> {email.from}</p>
        <p><strong>Received:</strong> {new Date(email.receivedAt).toLocaleString()}</p>
        <p><strong>Category:</strong> <span style={{ color: getCategoryColor(email.category), fontWeight: 'bold' }}>{email.category}</span></p>
        {onScanPhishing && (
          <button
            onClick={handleScanPhishing}
            disabled={isScanning}
            style={{ padding: '6px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: isScanning ? 'not-allowed' : 'pointer', marginTop: '10px' }}
          >
            {isScanning ? 'Scanning...' : 'Scan for Phishing'}
          </button>
        )}
      </div>
      <div className="body">
        {email.body}
      </div>

      {email.attachments && email.attachments.length > 0 && (
        <div className="attachments" style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #e9ecef' }}>
          <h3>Attachments</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {email.attachments.map((attachment) => (
              <li key={attachment.id} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '10px' }}>📎</span>
                <span>{attachment.filename} ({(attachment.size / 1024).toFixed(2)} KB)</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {onGenerateReply && (
        <div className="reply-section" style={{ marginTop: '20px', padding: '15px', borderTop: '1px solid #e9ecef' }}>
          <h3>Generate Reply</h3>
          <textarea
            value={replyPrompt}
            onChange={(e) => setReplyPrompt(e.target.value)}
            placeholder="Enter your reply prompt or leave empty for default..."
            rows={3}
            style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
          />
          <button
            onClick={handleGenerateReply}
            disabled={isGenerating}
            style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: isGenerating ? 'not-allowed' : 'pointer' }}
          >
            {isGenerating ? 'Generating...' : 'Generate AI Reply'}
          </button>

          {generatedReply && (
            <div style={{ marginTop: '15px' }}>
              <h4>Generated Reply:</h4>
              <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px', whiteSpace: 'pre-wrap' }}>
                {generatedReply}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmailView;