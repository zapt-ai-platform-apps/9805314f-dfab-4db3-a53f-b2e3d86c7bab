import React, { useState, useEffect } from 'react';
import * as Sentry from '@sentry/browser';
import Breadcrumb from './Breadcrumb';
import FolderList from './FolderList';
import FileList from './FileList';
import FolderCreateModal from './FolderCreateModal';
import FileUploadModal from './FileUploadModal';

const FileBrowser = () => {
  const [currentFolder, setCurrentFolder] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [showUploadFileModal, setShowUploadFileModal] = useState(false);

  const loadFolderContents = async (folderId = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const url = `/api/browse${folderId ? `?folderId=${folderId}` : ''}`;
      console.log('Loading folder contents from:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to load folder contents');
      }
      
      const data = await response.json();
      console.log('Folder contents loaded:', data);
      
      setCurrentFolder(data.currentFolder);
      setBreadcrumb(data.breadcrumb);
      setFolders(data.folders);
      setFiles(data.files);
    } catch (error) {
      console.error('Error loading folder contents:', error);
      Sentry.captureException(error);
      setError('Failed to load folder contents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFolderContents();
  }, []);

  const handleFolderClick = (folder) => {
    console.log('Navigating to folder:', folder.name);
    loadFolderContents(folder.id);
  };

  const handleBreadcrumbClick = (folder) => {
    console.log('Breadcrumb navigation:', folder ? folder.name : 'Home');
    loadFolderContents(folder ? folder.id : null);
  };

  const handleCreateFolder = async (folderName) => {
    try {
      console.log('Creating folder:', folderName, 'in:', currentFolder?.id || 'root');
      const response = await fetch('/api/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: folderName,
          parentId: currentFolder?.id || null,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create folder');
      }
      
      // Reload the current folder contents
      loadFolderContents(currentFolder?.id || null);
      return true;
    } catch (error) {
      console.error('Error creating folder:', error);
      Sentry.captureException(error);
      return false;
    }
  };

  const handleDeleteFolder = async (folderId) => {
    try {
      console.log('Deleting folder with ID:', folderId);
      const response = await fetch('/api/folders', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: folderId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete folder');
      }
      
      // Reload the current folder contents
      loadFolderContents(currentFolder?.id || null);
      return true;
    } catch (error) {
      console.error('Error deleting folder:', error);
      Sentry.captureException(error);
      return false;
    }
  };

  const handleFileUpload = async (file) => {
    try {
      console.log('Uploading file:', file.name, 'to folder:', currentFolder?.id || 'root');
      const formData = new FormData();
      formData.append('file', file);
      if (currentFolder) {
        formData.append('folderId', currentFolder.id);
      }
      
      const response = await fetch('/api/files', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload file');
      }
      
      // Reload the current folder contents
      loadFolderContents(currentFolder?.id || null);
      return true;
    } catch (error) {
      console.error('Error uploading file:', error);
      Sentry.captureException(error);
      return false;
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      console.log('Deleting file with ID:', fileId);
      const response = await fetch('/api/files', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: fileId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete file');
      }
      
      // Reload the current folder contents
      loadFolderContents(currentFolder?.id || null);
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      Sentry.captureException(error);
      return false;
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500 border border-red-200 rounded bg-red-50">
        <h3 className="font-bold">Error</h3>
        <p>{error}</p>
        <button 
          onClick={() => loadFolderContents(currentFolder?.id || null)} 
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-2 md:space-y-0">
        <Breadcrumb 
          items={breadcrumb} 
          onItemClick={handleBreadcrumbClick} 
        />
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowCreateFolderModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
          >
            New Folder
          </button>
          <button 
            onClick={() => setShowUploadFileModal(true)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
          >
            Upload File
          </button>
        </div>
      </div>
      
      {folders.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Folders</h2>
          <FolderList 
            folders={folders} 
            onFolderClick={handleFolderClick} 
            onDeleteFolder={handleDeleteFolder} 
          />
        </div>
      )}
      
      {files.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Files</h2>
          <FileList 
            files={files} 
            onDeleteFile={handleDeleteFile} 
          />
        </div>
      )}
      
      {folders.length === 0 && files.length === 0 && (
        <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500 mb-4">This folder is empty</p>
          <div className="flex justify-center space-x-2">
            <button 
              onClick={() => setShowCreateFolderModal(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
            >
              Create Folder
            </button>
            <button 
              onClick={() => setShowUploadFileModal(true)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
            >
              Upload File
            </button>
          </div>
        </div>
      )}
      
      {/* Modals */}
      {showCreateFolderModal && (
        <FolderCreateModal 
          onClose={() => setShowCreateFolderModal(false)} 
          onCreate={handleCreateFolder}
        />
      )}
      
      {showUploadFileModal && (
        <FileUploadModal 
          onClose={() => setShowUploadFileModal(false)} 
          onUpload={handleFileUpload}
        />
      )}
    </div>
  );
};

export default FileBrowser;