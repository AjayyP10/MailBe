import React from 'react';

interface SidebarProps {
  activeFolder: string;
  onFolderChange: (folder: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeFolder, onFolderChange }) => {
  const folders = [
    { name: 'Inbox', icon: '📧' },
    { name: 'Promotional', icon: '📢' },
    { name: 'Potential Scam', icon: '⚠️' },
    { name: 'Scam', icon: '🚨' }
  ];

  return (
    <div className="sidebar">
      <div className="folders">
        {folders.map((folder) => (
          <div
            key={folder.name}
            className={activeFolder === folder.name ? 'active' : ''}
            onClick={() => onFolderChange(folder.name)}
          >
            <span className="folder-icon">{folder.icon}</span>
            {folder.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;