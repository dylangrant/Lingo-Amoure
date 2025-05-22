# LoveLingo - 5 Love Languages App

## Overview

LoveLingo is a web application that helps users strengthen their relationships by recommending thoughtful actions based on the 5 love languages concept. The application allows users to track, schedule, and complete love language-based actions to improve their relationships.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

LoveLingo follows a modern full-stack architecture with the following components:

1. **Frontend**: React-based SPA (Single Page Application) with shadcn/ui components for a consistent and accessible UI.

2. **Backend**: Express.js server handling both REST API endpoints and GraphQL requests through Mercurius.

3. **Database**: The application uses Drizzle ORM for database operations. The schema is defined in shared/schema.ts for type safety across the entire application.

4. **Authentication**: Implemented using Passport.js with OpenID Connect strategy, supporting session-based authentication.

5. **State Management**: Client-side state is managed using a combination of React Query for server state and React Context API for global application state.

## Key Components

### Frontend Components

1. **UI Components**: Built using shadcn/ui library, which provides accessible and customizable React components.

2. **Page Structure**:
   - HomePage: Main dashboard showing recommended actions
   - QuizPage: For taking love languages quiz
   - ActionsPage: For managing love language actions
   - HistoryPage: For viewing historical actions
   - SettingsPage: For configuring user preferences

3. **Layouts**:
   - Header
   - Sidebar (desktop)
   - Bottom Navigation (mobile)

### Backend Components

1. **Express Server**: Handles HTTP requests and serves the frontend in production.

2. **Authentication Module**: Manages user sessions and OpenID Connect authentication.

3. **Storage Interface**: An abstraction layer for database operations, currently implemented with a memory store for development, but designed to be replaced with a persistent database.

4. **GraphQL API**: Provides a type-safe API for more complex data operations.

5. **REST API**: Simple endpoints for CRUD operations.

### Shared Components

1. **Schema Definitions**: Shared between frontend and backend for type safety.

2. **Constants**: Love language definitions and action tier classifications shared across the application.

## Data Flow

1. **Authentication Flow**:
   - User logs in via OpenID Connect
   - Session is created and stored
   - Frontend receives user data

2. **Action Management Flow**:
   - User receives recommendations based on love language
   - User can schedule actions
   - User marks actions as complete
   - History is tracked for completed actions

3. **Settings Flow**:
   - User configures preferences like partner name and primary love language
   - Settings are saved and affect recommendations

## External Dependencies

### Frontend
- React for UI rendering
- React Query for server state management
- shadcn/ui for UI components
- Wouter for routing
- Tailwind CSS for styling

### Backend
- Express for the web server
- Drizzle ORM for database operations
- Passport.js for authentication
- Mercurius for GraphQL

## Deployment Strategy

The application is configured for deployment in the Replit environment:

1. **Development Mode**:
   - Run with `npm run dev`
   - Uses Vite for hot module replacement
   - Server runs in development mode with detailed logging

2. **Production Mode**:
   - Build with `npm run build`
   - Serves static assets from dist/public
   - Optimized for performance

### Database Considerations

The application uses Drizzle ORM and is configured to work with PostgreSQL. The current implementation uses an in-memory store for development, but production would use the PostgreSQL database provided by Replit.

## Getting Started

1. Make sure PostgreSQL is enabled in your Replit.
2. Set up environment variables:
   - DATABASE_URL: Connection string for PostgreSQL
   - SESSION_SECRET: For securing sessions

3. Run `npm install` to install dependencies.
4. Run `npm run db:push` to set up the database schema.
5. Run `npm run dev` to start the development server.

## Project Structure

- `client/`: Frontend React application
  - `src/`: Source code
    - `components/`: UI components
    - `hooks/`: Custom React hooks
    - `lib/`: Utility functions
    - `pages/`: Page components
    - `context/`: React context providers

- `server/`: Backend Express application
  - `index.ts`: Entry point
  - `routes.ts`: API routes
  - `storage.ts`: Data storage interface
  - `auth.js`: Authentication logic
  - `graphql/`: GraphQL schema and resolvers

- `shared/`: Code shared between frontend and backend
  - `schema.ts`: Database schema definitions

## Next Steps

To continue development:

1. Implement the database connection with PostgreSQL
2. Complete the user authentication flow
3. Expand the GraphQL API for more complex data operations
4. Enhance the UI with more interactive components