import { useState, useEffect, useCallback, useRef } from 'react';
import { SiteContent } from '@tiny-web-builder/shared';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseAutoSaveOptions {
  site: SiteContent;
  onSave: (site: SiteContent) => Promise<void>;
  delay?: number;
  enabled?: boolean;
}

export const useAutoSave = ({ 
  site, 
  onSave, 
  delay = 2000, 
  enabled = true 
}: UseAutoSaveOptions) => {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedSiteRef = useRef<string>('');
  const isSavingRef = useRef(false);

  // Create a stable reference for the site data to avoid unnecessary re-renders
  const siteDataRef = useRef(site);
  siteDataRef.current = site;

  const save = useCallback(async (siteToSave: SiteContent) => {
    if (isSavingRef.current) return;
    
    isSavingRef.current = true;
    setSaveStatus('saving');
    setError(null);
    
    try {
      await onSave(siteToSave);
      setLastSaved(new Date());
      setSaveStatus('saved');
      lastSavedSiteRef.current = JSON.stringify(siteToSave);
      
      // Reset to idle after a short delay to show the "saved" status
      setTimeout(() => {
        if (saveStatus === 'saved') {
          setSaveStatus('idle');
        }
      }, 1500);
    } catch (error) {
      console.error('Auto-save failed:', error);
      setError(error instanceof Error ? error.message : 'Save failed');
      setSaveStatus('error');
      
      // Reset error status after a delay
      setTimeout(() => {
        setSaveStatus('idle');
        setError(null);
      }, 3000);
    } finally {
      isSavingRef.current = false;
    }
  }, [onSave, saveStatus]);

  // Debounced save effect
  useEffect(() => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Create a snapshot of the current site data
    const currentSite = siteDataRef.current;
    const currentSiteString = JSON.stringify(currentSite);
    
    // Only save if the data has actually changed
    if (currentSiteString !== lastSavedSiteRef.current) {
      timeoutRef.current = setTimeout(() => {
        save(currentSite);
      }, delay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [site, delay, enabled, save]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Manual save function for immediate saves
  const saveNow = useCallback((siteToSave?: SiteContent) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Use provided site data or current site data
    const siteData = siteToSave || siteDataRef.current;
    save(siteData);
  }, [save]);

  return {
    saveStatus,
    lastSaved,
    error,
    isSaving: saveStatus === 'saving',
    saveNow
  };
};
