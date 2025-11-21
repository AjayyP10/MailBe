import React from 'react';

interface SidebarProps {
  activeFolder: string;
  onFolderChange: (folder: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeFolder, onFolderChange }) => {
  const folders = ['Inbox', 'Promotional', 'Potential Scam', 'Scam'];

  return (
    <div className="sidebar">
      <div className="folders">
        {folders.map((folder) => (
          <div
            key={folder}
            className={activeFolder === folder ? 'active' : ''}
            onClick={() => onFolderChange(folder)}
          >
            {folder}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;