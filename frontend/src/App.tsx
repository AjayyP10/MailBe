import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import EmailList from './components/EmailList';
import EmailView from './components/EmailView';
import { Email } from './types';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [activeFolder, setActiveFolder] = useState('Inbox');
  const [isLoadingEmails, setIsLoadingEmails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for token in URL params (after OAuth redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');

    if (tokenFromUrl) {
      localStorage.setItem('authToken', tokenFromUrl);
      setToken(tokenFromUrl);
      setIsAuthenticated(true);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // Check localStorage for existing token
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
        setIsAuthenticated(true);
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchEmails();
    }
  }, [isAuthenticated, token]);

  const fetchEmails = async () => {
    setIsLoadingEmails(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/emails', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const emailsData = await response.json();
        setEmails(emailsData);
      } else {
        setError('Failed to fetch emails. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoadingEmails(false);
    }
  };

  const generateReply = async (emailId: string, prompt: string): Promise<string> => {
    const response = await fetch('http://localhost:3001/emails/generate-reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ emailId, prompt })
    });

    if (!response.ok) {
      throw new Error('Failed to generate reply');
    }

    const data = await response.json();
    return data.reply;
  };

  const scanPhishing = async (emailId: string): Promise<void> => {
    const response = await fetch(`http://localhost:3001/emails/scan-phishing/${emailId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to scan for phishing');
    }

    // Refresh emails to get updated categories
    await fetchEmails();
  };

  const handleLogin = (provider: 'google' | 'microsoft') => {
    window.location.href = `http://localhost:3001/auth/${provider}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="App">
        <header>
          <h1>MailBe</h1>
          <div>
            <input
              type="text"
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button onClick={() => handleLogin('google')}>Login with Google</button>
            <button onClick={() => handleLogin('microsoft')}>Login with Outlook</button>
          </div>
        </header>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>Please log in to access your emails.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header>
        <h1>MailBe</h1>
        <div>
          <input
            type="text"
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <div className="email-container">
        <Sidebar activeFolder={activeFolder} onFolderChange={setActiveFolder} />
        {isLoadingEmails ? (
          <div className="loading">Loading emails...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <EmailList
            emails={emails.filter(email =>
              email.category === activeFolder &&
              (searchQuery === '' ||
               email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
               email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
               email.body.toLowerCase().includes(searchQuery.toLowerCase()))
            )}
            selectedEmailId={selectedEmail?.id || null}
            onEmailSelect={setSelectedEmail}
          />
        )}
        <EmailView email={selectedEmail} onGenerateReply={generateReply} onScanPhishing={scanPhishing} />
      </div>
    </div>
  );
}

export default App;
