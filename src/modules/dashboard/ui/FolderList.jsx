import React from 'react';

const FolderList = ({ folders, onFolderClick, onDeleteFolder }) => {
  const handleDelete = (e, folderId) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this folder? All contents will be deleted permanently.')) {
      onDeleteFolder(folderId);
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {folders.map(folder => (
        <div 
          key={folder.id}
          onClick={() => onFolderClick(folder)}
          className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center">
            <svg className="w-8 h-8 text-yellow-500 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
            </svg>
            <div>
              <p className="font-medium truncate">{folder.name}</p>
              <p className="text-xs text-gray-500">
                {new Date(folder.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <button 
            onClick={(e) => handleDelete(e, folder.id)}
            className="text-red-500 hover:text-red-700 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path>
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default FolderList;