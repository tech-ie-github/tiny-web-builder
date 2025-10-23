import type { FC } from 'react';

interface RichTextProps {
  content: string;
}

const LINE_BREAK = /\n{2,}/g;

const createParagraphs = (text: string): string[] => {
  return text
    .split(LINE_BREAK)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
};

export const RichText: FC<RichTextProps> = ({ content }) => {
  const paragraphs = createParagraphs(content);

  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="leading-relaxed text-lg">
          {paragraph}
        </p>
      ))}
    </div>
  );
};

export default RichText;
