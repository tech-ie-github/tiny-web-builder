import { Theme } from './types.js';

export const themes: Record<string, Theme> = {
  Serene: {
    id: 'Serene',
    name: 'Serene',
    css: `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: #2c3e50;
        background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
        min-height: 100vh;
      }
      
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
        margin-top: 20px;
        margin-bottom: 20px;
      }
      
      header {
        background: linear-gradient(45deg, #64b5f6, #42a5f5);
        color: white;
        padding: 2rem;
        border-radius: 15px;
        margin-bottom: 2rem;
        text-align: center;
        box-shadow: 0 10px 30px rgba(100, 181, 246, 0.3);
      }
      
      header h1 {
        font-size: 2.5rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        letter-spacing: 0.5px;
      }
      
      main {
        background: white;
        padding: 2rem;
        border-radius: 15px;
        margin-bottom: 2rem;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        border: 1px solid rgba(100, 181, 246, 0.1);
      }
      
      main h2 {
        color: #1976d2;
        font-size: 1.8rem;
        margin-bottom: 1rem;
        font-weight: 500;
      }
      
      main p {
        font-size: 1.1rem;
        margin-bottom: 1rem;
        color: #424242;
        line-height: 1.7;
      }
      
      footer {
        background: #37474f;
        color: white;
        padding: 1.5rem;
        border-radius: 15px;
        text-align: center;
        box-shadow: 0 5px 15px rgba(55, 71, 79, 0.3);
      }
      
      footer p {
        font-size: 0.9rem;
        opacity: 0.9;
      }
      
      @media (max-width: 768px) {
        .container {
          margin: 10px;
          padding: 15px;
        }
        
        header h1 {
          font-size: 2rem;
        }
        
        main {
          padding: 1.5rem;
        }
      }
    `
  },
  
  Bold: {
    id: 'Bold',
    name: 'Bold',
    css: `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        line-height: 1.5;
        color: #1a1a1a;
        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
        min-height: 100vh;
      }
      
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
        background: rgba(255, 255, 255, 0.98);
        border-radius: 0;
        box-shadow: 0 0 0 4px #1a1a1a;
        margin-top: 20px;
        margin-bottom: 20px;
      }
      
      header {
        background: #1a1a1a;
        color: #ffffff;
        padding: 3rem 2rem;
        text-align: center;
        margin-bottom: 2rem;
        border: 4px solid #ff6b6b;
        position: relative;
      }
      
      header::before {
        content: '';
        position: absolute;
        top: -4px;
        left: -4px;
        right: -4px;
        bottom: -4px;
        background: linear-gradient(45deg, #ff6b6b, #ee5a24, #ff6b6b);
        z-index: -1;
      }
      
      header h1 {
        font-size: 3rem;
        font-weight: 900;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 2px;
        text-shadow: 2px 2px 0px #ff6b6b;
      }
      
      main {
        background: #ffffff;
        padding: 2rem;
        margin-bottom: 2rem;
        border: 4px solid #1a1a1a;
        position: relative;
      }
      
      main h2 {
        color: #1a1a1a;
        font-size: 2rem;
        margin-bottom: 1rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 1px;
        border-bottom: 3px solid #ff6b6b;
        padding-bottom: 0.5rem;
      }
      
      main p {
        font-size: 1.2rem;
        margin-bottom: 1rem;
        color: #1a1a1a;
        font-weight: 500;
        line-height: 1.6;
      }
      
      footer {
        background: #1a1a1a;
        color: #ffffff;
        padding: 2rem;
        text-align: center;
        border: 4px solid #ff6b6b;
        position: relative;
      }
      
      footer::before {
        content: '';
        position: absolute;
        top: -4px;
        left: -4px;
        right: -4px;
        bottom: -4px;
        background: linear-gradient(45deg, #ff6b6b, #ee5a24, #ff6b6b);
        z-index: -1;
      }
      
      footer p {
        font-size: 1rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      
      @media (max-width: 768px) {
        .container {
          margin: 10px;
          padding: 15px;
        }
        
        header {
          padding: 2rem 1rem;
        }
        
        header h1 {
          font-size: 2.2rem;
        }
        
        main {
          padding: 1.5rem;
        }
        
        main h2 {
          font-size: 1.5rem;
        }
      }
    `
  }
};
