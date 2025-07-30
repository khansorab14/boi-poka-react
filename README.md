# Boi Poka React App

A modern React application for managing and organizing books with an interactive shelf view and drag-and-drop functionality.

## Features

- 📚 **Interactive Shelf View**: 3D shelf layout with decorative elements
- 🎯 **Drag & Drop**: Reorder books within shelves
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔄 **API Integration**: Real-time book data with pagination
- 🎨 **Modern UI**: Built with Tailwind CSS and React
- 📊 **Multiple Views**: Grid, List, and Shelf view options
- 🔍 **Search & Filter**: Find books by genre, author, and more
- 📖 **Book Details**: Comprehensive book information modal
- 🏷️ **Library Management**: Create and manage multiple libraries

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd boi-poka-react
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables:

```env
VITE_API_BASE_URL=your_api_base_url
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3001`

## Project Structure

```
src/
├── api/                 # API configuration and endpoints
├── components/          # Reusable UI components
│   ├── common/         # Common components (header, footer, etc.)
│   ├── ui/             # UI components (books, shelves, etc.)
│   └── ...
├── pages/              # Page components
│   ├── home/           # Home page and related components
│   ├── user/           # User-related pages
│   └── ...
├── state/              # Zustand stores
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
└── config/             # Configuration files
```

## Key Components

### Shelf View

- **Location**: `src/components/ui/books-view/shelf-view.tsx`
- **Features**:
  - Dynamic shelf creation (10, 8, 8 book pattern)
  - Drag and drop functionality
  - Decorative elements (pen stand, flower pot)
  - Responsive layout

### Home Page

- **Location**: `src/pages/home/home.tsx`
- **Features**:
  - API pagination with scroll loading
  - Multiple view modes (Grid, List, Shelf)
  - Filter and sort functionality
  - Library management

### State Management

- **Auth Store**: `src/state/use-auth-store.tsx`
- **Shelf Store**: `src/store/shelf-book.ts`
- **UI Store**: `src/store/ui-store.tsx`

## API Integration

The app integrates with a backend API for:

- Fetching books with pagination
- Updating book positions
- Managing libraries
- User authentication

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please open an issue on GitHub.
