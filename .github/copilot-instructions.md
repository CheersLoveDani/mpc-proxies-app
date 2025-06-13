<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# MTG Proxies App - Copilot Instructions

This is a Tauri desktop application for creating Magic: The Gathering proxy cards.

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Backend**: Rust (Tauri)
- **Styling**: CSS with custom properties (CSS variables)
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Package Manager**: pnpm

## Project Structure

- `src/` - React frontend code
  - `components/` - Reusable React components (Layout, Sidebar)
  - `pages/` - Page components for each route
    - `HomePage.tsx` - Main landing page
    - `SettingsPage.tsx` - Application settings
    - `CreateProxiesPage.tsx` - Proxy creation interface
    - `DownloadProxiesPage.tsx` - Download and print management
    - `CustomProxiesPage.tsx` - Coming soon page with external link
  - `App.tsx` - Main app component with routing setup
  - `App.css` - Global styles with CSS variables
- `src-tauri/` - Rust backend code
  - `src/main.rs` - Main Tauri application entry point
  - `src/lib.rs` - Library functions and Tauri commands

## Key Features

- Collapsible sidebar navigation
- Responsive design with CSS Grid and Flexbox
- Dark mode support via CSS `prefers-color-scheme`
- Modern UI with consistent spacing and typography
- Route-based navigation with React Router
- MTG proxy creation and download workflows
- External link integration to CardConjurer

## Application Routes

- `/` - Home page with app introduction
- `/settings` - Application settings and preferences
- `/create-proxies` - Upload card lists and generate proxies
- `/download-proxies` - Download generated proxies in various formats
- `/custom-proxies` - Coming soon page with link to CardConjurer

## Development Guidelines

- Use TypeScript for all new React components
- Follow React functional component patterns with hooks
- Use CSS custom properties for consistent theming
- Implement responsive design principles
- Follow Tauri best practices for desktop app development
- Use semantic HTML elements for accessibility

## Available Commands

- `pnpm dev` - Start web development server
- `pnpm tauri dev` - Start Tauri development mode (desktop app)
- `pnpm build` - Build for production
- `pnpm tauri build` - Build desktop application

## Design System

- Primary color: `#646cff`
- Sidebar width: `250px` (collapsed: `60px`)
- Border radius: `6px` for buttons, `8px` for cards
- Spacing: Use consistent rem-based spacing (0.5rem, 1rem, 1.5rem, 2rem)
