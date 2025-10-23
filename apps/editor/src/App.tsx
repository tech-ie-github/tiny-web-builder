import React, { useState, useEffect } from 'react';
import { Editor } from './components/Editor';
import { PreviewFrame } from './components/PreviewFrame';
import { SiteContent, themes } from '@tiny-web-builder/shared';
import { useAutoSave } from './hooks/useAutoSave';

const DEVICE_PRESETS = [
  { name: 'Desktop', width: 1440, height: 900 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Mobile', width: 375, height: 812 }
];

function App() {
  const [site, setSite] = useState<SiteContent>({
    id: 'default',
    header: 'TheraPages – Tiny Builder POC',
    body: 'Welcome to your micro site! This is a proof of concept for a tiny website builder using Cloudflare\'s stack.\n\n**Features:**\n- Live preview editing\n- Multiple themes (Serene & Bold)\n- Instant publishing\n- Local development with Miniflare\n\nStart editing to see your changes appear instantly in the preview panel.',
    footer: '© 2025 My Practice',
    theme: 'Serene',
    published: 0,
    updated_at: new Date().toISOString()
  });

  const [selectedDevice, setSelectedDevice] = useState(DEVICE_PRESETS[0]);
  const [isLoading, setIsLoading] = useState(false);

  // Load initial site data
  useEffect(() => {
    const loadSite = async () => {
      try {
        const response = await fetch('/api/site/default?published=0');
        if (response.ok) {
          const data = await response.json();
          setSite(data);
        }
      } catch (error) {
        console.error('Failed to load site:', error);
      }
    };
    loadSite();
  }, []);

  // Auto-save functionality
  const handleAutoSave = async (siteToSave: SiteContent) => {
    const response = await fetch('/api/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(siteToSave),
    });

    if (!response.ok) {
      throw new Error(`Save failed: ${response.statusText}`);
    }

    // Trigger preview refresh
    const previewFrame = document.getElementById('preview-frame') as HTMLIFrameElement;
    if (previewFrame) {
      previewFrame.src = previewFrame.src;
    }
  };

  const { saveStatus, lastSaved, error, isSaving, saveNow } = useAutoSave({
    site,
    onSave: handleAutoSave,
    delay: 2000, // 2 seconds after user stops typing
    enabled: true
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await saveNow(); // Use the autosave function for immediate save
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    setIsLoading(true);
    try {
      // First save the current draft
      await saveNow();
      
      // Then publish
      const response = await fetch(`/api/publish/${site.id}`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('Site published successfully!');
      } else {
        throw new Error(`Publish failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to publish:', error);
      alert('Failed to publish site. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Tiny Web Builder</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Theme Selector */}
              <div className="relative">
                <select
                  value={site.theme}
                  onChange={async (e) => {
                    const newTheme = e.target.value as 'Serene' | 'Bold';
                    const updatedSite = { ...site, theme: newTheme };
                    setSite(updatedSite);
                    // Trigger immediate save for theme changes
                    saveNow(updatedSite);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                >
                  <option value="Serene">Serene Theme</option>
                  <option value="Bold">Bold Theme</option>
                </select>
                {/* Theme change indicator */}
                {saveStatus === 'saving' && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {/* Device Presets */}
              <div className="flex space-x-2">
                {DEVICE_PRESETS.map((device) => (
                  <button
                    key={device.name}
                    onClick={() => setSelectedDevice(device)}
                    className={`px-3 py-2 text-sm rounded-md ${
                      selectedDevice.name === device.name
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {device.name}
                  </button>
                ))}
              </div>

              {/* Auto-save Status */}
              <div className="flex items-center space-x-2">
                {saveStatus === 'saving' && (
                  <div className="flex items-center space-x-1 text-sm text-blue-600">
                    <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </div>
                )}
                {saveStatus === 'saved' && (
                  <div className="flex items-center space-x-1 text-sm text-green-600">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Saved</span>
                  </div>
                )}
                {saveStatus === 'error' && (
                  <div className="flex items-center space-x-1 text-sm text-red-600">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>Save failed</span>
                  </div>
                )}
                {lastSaved && saveStatus === 'idle' && (
                  <span className="text-sm text-gray-500">
                    Last saved: {lastSaved.toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor Panel */}
          <div className="bg-white rounded-lg shadow-sm border">
            <Editor
              site={site}
              onSiteChange={setSite}
              onSave={handleSave}
              onPublish={handlePublish}
              isLoading={isLoading || isSaving}
              saveStatus={saveStatus}
            />
          </div>

          {/* Preview Panel */}
          <div className="bg-white rounded-lg shadow-sm border flex flex-col">
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium text-gray-900">Live Preview</h2>
            </div>
            <div className="p-4 flex-1 min-h-0">
              <PreviewFrame
                device={selectedDevice}
                siteId={site.id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
