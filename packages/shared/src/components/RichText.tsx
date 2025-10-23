import React from 'react';

interface RichTextProps {
  content: string;
}

export const RichText: React.FC<RichTextProps> = ({ content }) => {
  // Ultra-light markdown renderer
  const renderMarkdown = (text: string): React.ReactNode => {
    if (!text) return null;

    // Split by double newlines to create paragraphs
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      if (!paragraph.trim()) return null;
      
      // Simple markdown parsing
      let processedParagraph = paragraph;
      
      // Bold: **text** or __text__
      processedParagraph = processedParagraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      processedParagraph = processedParagraph.replace(/__(.*?)__/g, '<strong>$1</strong>');
      
      // Italic: *text* or _text_
      processedParagraph = processedParagraph.replace(/\*(.*?)\*/g, '<em>$1</em>');
      processedParagraph = processedParagraph.replace(/_(.*?)_/g, '<em>$1</em>');
      
      // Links: [text](url)
      processedParagraph = processedParagraph.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
      
      // Line breaks
      processedParagraph = processedParagraph.replace(/\n/g, '<br>');
      
      return (
        <p 
          key={index} 
          dangerouslySetInnerHTML={{ __html: processedParagraph }}
        />
      );
    });
  };

  return <>{renderMarkdown(content)}</>;
};
