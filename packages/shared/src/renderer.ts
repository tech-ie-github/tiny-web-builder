import { Theme, RenderOptions } from './types.js';
import { themes } from './themes.js';

export function renderSite(options: RenderOptions): string {
  const { id, header, body, footer, theme } = options;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${id}</title>
    <style>
        ${theme.css}
    </style>
</head>
<body>
    <div class="container">
        <header>
            ${header}
        </header>
        
        <main>
            ${body}
        </main>
        
        <footer>
            ${footer}
        </footer>
    </div>
</body>
</html>`;
}

export function getTheme(themeId: string): Theme {
  return themes[themeId] || themes.Serene;
}

export function getAllThemes(): Theme[] {
  return Object.values(themes);
}
