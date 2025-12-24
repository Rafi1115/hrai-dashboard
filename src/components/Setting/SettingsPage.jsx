// components/SettingsPage.js
'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getApiUrl } from '../configs/api';

// Use a dynamic import for the JoditEditor to prevent SSR issues.
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

// Centralized configuration for tabs. This makes the component more scalable and easier to manage.
// Each tab has a title for the UI and an apiSlug for backend communication.
const tabConfig = {
  'privacy-security': {
    title: 'Privacy Policy',
    apiSlug: 'privacy_policy',
  },
  'terms-conditions': {
    title: 'Terms & Conditions',
    apiSlug: 'terms_conditions',
  },
  'about-us': {
    title: 'About Us',
    apiSlug: 'about_us',
  },
};

// A helper object to map API setting types back to our tab IDs for easy state updates.
const apiSlugToTabId = Object.entries(tabConfig).reduce((acc, [tabId, config]) => {
  acc[config.apiSlug] = tabId;
  return acc;
}, {});

// Dynamically generate the initial state for tab contents from the configuration.
const initialTabContents = Object.keys(tabConfig).reduce((acc, tabId) => {
    acc[tabId] = { ...tabConfig[tabId], text: '', date: '' };
    return acc;
}, {});


const SettingsPage = ({ onBackClick }) => {
  const editor = useRef(null);
  const [activeTab, setActiveTab] = useState('privacy-security');
  const [editableContent, setEditableContent] = useState('');
  const [tabContents, setTabContents] = useState(initialTabContents);
  const [isLoading, setIsLoading] = useState(true);

  // Effect to fetch all settings data when the component mounts.
  useEffect(() => {
    async function fetchSettings() {
      setIsLoading(true);
      try {
        const res = await fetch(getApiUrl('/api/dashboard/settings/'));
        if (!res.ok) throw new Error('Failed to fetch settings from the server.');
        
        const data = await res.json();
        
        if (data.results && Array.isArray(data.results)) {
          const updatedTabs = { ...initialTabContents };
          
          // Populate the state with data fetched from the API.
          data.results.forEach(setting => {
            const tabId = apiSlugToTabId[setting.setting_type];
            if (tabId) {
              updatedTabs[tabId].text = setting.content;
              updatedTabs[tabId].date = new Date(setting.last_updated).toLocaleString();
            }
          });
          setTabContents(updatedTabs);
        }
      } catch (err) {
        toast.error(err.message || 'Could not load settings.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchSettings();
  }, []);

  // Effect to update the editor's content whenever the active tab or its content changes.
  useEffect(() => {
    setEditableContent(tabContents[activeTab].text);
  }, [activeTab, tabContents]);

  // Memoized configuration for the Jodit editor to prevent re-creation on every render.
  const joditConfig = useMemo(() => ({
    readonly: false,
    spellcheck: false,
    placeholder: 'Start typing...',
    buttons: 'undo,redo,|,bold,italic,underline,strikethrough,|,ul,ol,|,link,cut,copy,paste,|,align,|,source',
    theme: 'light',
    toolbarButtonSize: 'large',
    height: 400, // Set a default height for the editor
  }), []);

  // Generic handler to save changes for the currently active tab.
  const handleSaveAndChange = async () => {
    const currentTabConfig = tabConfig[activeTab];
    if (!currentTabConfig) {
      toast.error('Invalid tab configuration.');
      return;
    }

    const { apiSlug, title } = currentTabConfig;
    const endpoint = getApiUrl(`/api/dashboard/settings/${apiSlug}/`);
    const toastId = toast.loading(`Updating ${title}...`);

    try {
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editableContent }),
      });

      if (!res.ok) {
        // Try to parse error details from the response body for a more specific message.
        const errorData = await res.json().catch(() => ({ detail: `Failed to update ${title}` }));
        throw new Error(errorData.detail || `HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();

      // Update the state with the new content and last updated date from the server response.
      setTabContents(prev => ({
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          text: editableContent,
          date: new Date(data.last_updated).toLocaleString(),
        },
      }));

      toast.success(`${title} updated successfully!`, { id: toastId });
    } catch (err) {
      toast.error(err.message || `An unexpected error occurred while updating ${title}.`, { id: toastId });
    }
  };

  return (
    <div className="bg-white rounded-2xl min-h-screen text-black p-4 sm:p-6 lg:p-8 font-inter">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {onBackClick && (
            <button onClick={onBackClick} className="text-gray-600 hover:text-black mr-4" aria-label="Go back">
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
        </div>
        <button
          className="bg-[#013D3B] text-white px-6 py-2 rounded-md font-medium hover:bg-[#012a29] transition-colors duration-200"
          onClick={() => {
            navigator.clipboard.writeText("http://localhost:3000/signup")
              .then(() => {
                toast.success('URL copied to clipboard!');
              })
              .catch(() => {
                toast.error('Failed to copy URL');
              });
          }}
        >
          Sign Up
        </button>
      </div>

      <div className="border-b border-gray-300">
        <div className="flex justify-start bg-gray-100 rounded-t-lg overflow-x-auto scrollbar-hide">
          {Object.keys(tabConfig).map((tabId) => (
            <button
              key={tabId}
              className={`flex-shrink-0 px-4 py-4 text-base sm:text-lg font-medium relative whitespace-nowrap ${
                activeTab === tabId ? 'text-[#013D3B]' : 'text-gray-600 hover:text-black'
              }`}
              onClick={() => setActiveTab(tabId)}
            >
              {tabConfig[tabId].title}
              {activeTab === tabId && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] -mb-[1px] bg-[#013D3B]"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-b-lg -mt-px">
        {isLoading ? (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">Loading content...</p>
            </div>
        ) : (
            <>
              <h2 className="text-xl font-semibold mb-1">{tabContents[activeTab].title}</h2>
              <p className="text-sm text-gray-600 mb-4">Last Updated: {tabContents[activeTab].date || 'N/A'}</p>
              <div className="rounded-md mb-6 py-2">
                <JoditEditor
                  ref={editor}
                  value={editableContent}
                  config={joditConfig}
                  onChange={(newContent) => setEditableContent(newContent)}
                />
              </div>
              <div className="col-span-full mt-4">
                <button
                  type="button"
                  onClick={handleSaveAndChange}
                  className="w-full mx-auto flex justify-center items-center rounded-md bg-[#013D3B] text-white py-3 font-medium hover:bg-[#012a29] transition-colors duration-200"
                >
                  Save & Change
                </button>
              </div>
            </>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;