import React, { useState, useEffect } from 'react';
import { SiteContent } from '@tiny-web-builder/shared';
import { SaveStatus } from '../hooks/useAutoSave';

interface EditorProps {
  site: SiteContent;
  onSiteChange: (site: SiteContent) => void;
  onSave: () => void;
  onPublish: () => void;
  isLoading: boolean;
  saveStatus?: SaveStatus;
}

export const Editor: React.FC<EditorProps> = ({
  site,
  onSiteChange,
  onSave,
  onPublish,
  isLoading,
  saveStatus = 'idle'
}) => {
  const [localSite, setLocalSite] = useState(site);

  useEffect(() => {
    setLocalSite(site);
  }, [site]);

  const handleFieldChange = (field: keyof SiteContent, value: string) => {
    const updated = {
      ...localSite,
      [field]: value,
      updated_at: new Date().toISOString()
    };
    setLocalSite(updated);
    onSiteChange(updated);
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Site Editor</h2>
      
      <div className="space-y-6">
        {/* Header */}
        <div>
          <label htmlFor="header" className="block text-sm font-medium text-gray-700 mb-2">
            Header
          </label>
          <input
            id="header"
            type="text"
            value={localSite.header}
            onChange={(e) => handleFieldChange('header', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter site header..."
          />
        </div>

        {/* Body */}
        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
            Body Content
          </label>
          <textarea
            id="body"
            rows={8}
            value={localSite.body}
            onChange={(e) => handleFieldChange('body', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your content here... (supports **bold**, *italic*, and [links](url))"
          />
          <p className="mt-1 text-sm text-gray-500">
            Supports basic markdown: **bold**, *italic*, [links](url)
          </p>
        </div>

        {/* Footer */}
        <div>
          <label htmlFor="footer" className="block text-sm font-medium text-gray-700 mb-2">
            Footer
          </label>
          <input
            id="footer"
            type="text"
            value={localSite.footer}
            onChange={(e) => handleFieldChange('footer', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter footer text..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-4 border-t">
          <button
            onClick={onSave}
            disabled={isLoading}
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Draft'}
          </button>
          
          <button
            onClick={onPublish}
            disabled={isLoading}
            className="flex-1 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Publishing...' : 'Publish Site'}
          </button>
        </div>
      </div>
    </div>
  );
};
