import React from 'react';
import './App.css';

function App() {

  return (
    <div className="App">
      <header>
        <h1>MailBe</h1>
        <button>Login with Google</button>
        <button>Login with Outlook</button>
      </header>
      <div className="email-container">
        <div className="sidebar">
          <div className="folders">
            <div>Inbox</div>
            <div>Promotional</div>
            <div>Potential Scam</div>
            <div>Scam</div>
          </div>
        </div>
        <div className="email-list">
          {/* Email list here */}
        </div>
        <div className="email-view">
          {/* Email view here */}
        </div>
      </div>
    </div>
  );
}

export default App;
