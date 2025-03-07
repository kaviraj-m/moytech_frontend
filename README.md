# MoyTech Frontend

A modern web application built with Next.js for managing events, material entries, and moi entries.

## Features

- **Event Management**: Create, edit, and delete events
- **Material Entries**: Track material donations with detailed information
- **Moi Entries**: Manage monetary contributions
- **Data Export**: Export data in PDF and Excel formats
- **Responsive Design**: Beautiful UI that works across all devices

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Data Fetching**: Native Fetch API

## Prerequisites

- Node.js 18.x or later
- npm or yarn package manager

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3001](http://localhost:3001) in your browser

## Project Structure

```
├── public/          # Static files
├── src/
│   ├── app/        # App router pages and layouts
│   │   ├── components/  # Shared components
│   │   ├── dashboard/   # Dashboard and analytics
│   │   ├── events/      # Event management
│   │   ├── material-entries/  # Material entries
│   │   ├── moi-entries/      # Moi entries
│   │   ├── finance/     # Financial management
│   │   └── export/      # Data export functionality
│   └── styles/     # Global styles
├── package.json
└── README.md
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Use functional components with hooks
- Implement proper error handling
- Write meaningful component and variable names

### Component Structure

- Keep components small and focused
- Use proper TypeScript interfaces
- Implement proper prop validation
- Follow React best practices

### State Management

- Use React hooks for local state
- Implement proper data fetching strategies
- Handle loading and error states

## Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Building for Production

1. Build the application:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Start the production server:
   ```bash
   npm start
   # or
   yarn start
   ```

