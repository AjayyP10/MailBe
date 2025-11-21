import React from 'react';
import { Email } from '../types';

interface EmailListProps {
  emails: Email[];
  selectedEmailId: string | null;
  onEmailSelect: (email: Email) => void;
}

const EmailList: React.FC<EmailListProps> = ({ emails, selectedEmailId, onEmailSelect }) => {
  return (
    <div className="email-list">
      {emails.map((email) => (
        <div
          key={email.id}
          className={`email-item ${selectedEmailId === email.id ? 'selected' : ''}`}
          onClick={() => onEmailSelect(email)}
        >
          <h4>{email.subject}</h4>
          <p>{email.from}</p>
          <p>{email.body.substring(0, 100)}...</p>
        </div>
      ))}
    </div>
  );
};

export default EmailList;