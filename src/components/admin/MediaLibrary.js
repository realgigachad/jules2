'use client';

import { useState, useEffect } from 'react';

export default function MediaLibrary({ isOpen, onClose, onSelectFile }) {
  const [media, setMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMedia = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/cms/media');
      if (!res.ok) throw new Error('Failed to fetch media');
      const data = await res.json();
      // Reverse the array to show newest files first
      setMedia(data.data.reverse());
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

  const handleFileSelect = (url) => {
    onSelectFile(url);
    onClose();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'File upload failed');
      }

      // Refresh the media library to show the new file
      fetchMedia();

    } catch (err) {
      setError(err.message);
      // Still set loading to false on error
      setIsLoading(false);
    } finally {
      e.target.value = null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
        <header className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Media Library</h2>
          <button onClick={onClose} className="text-2xl">&times;</button>
        </header>

        <main className="p-4 flex-grow overflow-y-auto">
          {error && <p className="text-red-500">Error: {error}</p>}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {media.map(url => (
              <div key={url} className="group relative border rounded-md overflow-hidden aspect-square">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                  <button
                    onClick={() => handleFileSelect(url)}
                    className="px-4 py-2 bg-white text-black rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>
          {isLoading && <p className="text-center mt-4">Loading...</p>}
        </main>

        <footer className="p-4 border-t">
          <input
            type="file"
            id="gallery-upload"
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => document.getElementById('gallery-upload').click()}
            className="px-6 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
            disabled={isLoading}
          >
            {isLoading ? 'Uploading...' : 'Upload New File'}
          </button>
        </footer>
      </div>
    </div>
  );
}
