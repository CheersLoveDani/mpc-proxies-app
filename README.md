# MTG Proxies App

A modern desktop application for creating Magic: The Gathering proxy cards, built with Tauri, React, and TypeScript.

## Features

- 🖥️ **Desktop Application**: Built with Tauri for native performance
- 🎨 **Modern UI**: Clean, responsive design with collapsible sidebar navigation
- 🌙 **Dark Mode**: Automatic dark mode support based on system preferences
- 🚀 **Fast Development**: Hot reload with Vite for rapid development
- 📱 **Responsive**: Works well on different screen sizes

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Backend**: Rust (Tauri)
- **Build Tool**: Vite
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Styling**: CSS with custom properties
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Rust](https://rustup.rs/)
- [pnpm](https://pnpm.io/)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

### Development

#### Web Development (Browser)
```bash
pnpm dev
```
This starts the Vite development server at `http://localhost:5173`

#### Desktop Development (Tauri)
```bash
pnpm tauri dev
```
This opens the application in a desktop window with hot reload.

### Building

#### Web Build
```bash
pnpm build
```

#### Desktop Build
```bash
pnpm tauri build
```

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Layout.tsx      # Main layout with sidebar
│   └── Sidebar.tsx     # Collapsible navigation sidebar
├── pages/              # Page components for each route
│   ├── HomePage.tsx    # Home/dashboard page
│   ├── UsersPage.tsx   # Users management
│   ├── DocumentsPage.tsx # Document templates
│   └── SettingsPage.tsx # Application settings
├── App.tsx            # Main app component with routing
├── App.css           # Global styles and CSS variables
└── main.tsx          # React app entry point

src-tauri/             # Rust backend code
├── src/
│   ├── main.rs       # Tauri main process
│   └── lib.rs        # Rust functions and commands
└── tauri.conf.json   # Tauri configuration
```

## Available Routes

- `/` - Home page with app introduction
- `/users` - User management interface
- `/documents` - Document and template management  
- `/settings` - Application settings and preferences

## Development Notes

- The app uses CSS custom properties for consistent theming
- Sidebar can be collapsed/expanded using the toggle button
- Dark mode is automatically applied based on system preferences
- All components are built with TypeScript for type safety

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/)
- [Tauri Extension](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
