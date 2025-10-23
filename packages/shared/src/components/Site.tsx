import React from 'react';
import { SiteContent, Theme } from '../types.js';
import { RichText } from './RichText.js';

interface SiteProps {
  content: SiteContent;
  theme: Theme;
}

export const Site: React.FC<SiteProps> = ({ content, theme }) => {
  // Handle undefined data gracefully
  if (!content || !theme) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
        <p>Loading site data...</p>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: theme.css }} />
      <div className="container">
        <header>
          <h1>{content.header}</h1>
        </header>
        
        <main>
          <RichText content={content.body} />
        </main>
        
        <footer>
          <p>{content.footer}</p>
        </footer>
      </div>
    </>
  );
};
