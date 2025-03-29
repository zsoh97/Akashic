# Akashic - Your Digital Reading Companion

Akashic is a modern web application designed for book enthusiasts to discover, track, and discuss their reading journey.

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router for server-side rendering and routing
- **Chakra UI** - Component library for building accessible and responsive UI
- **Apollo Client** - GraphQL client for state management and data fetching
- **React Hook Form** - Form handling with validation
- **Framer Motion** - Animation library for smooth transitions

### Backend
- **Supabase** - Backend-as-a-Service for authentication and database
- **Prisma** - Type-safe ORM for database operations
- **GraphQL Yoga** - GraphQL server implementation
- **Apollo Server** - GraphQL server for API endpoints

### APIs
- **Google Books API** - Book search and metadata
- **New York Times API** - Bestseller lists

## Core Features

### Book Discovery
- Search books using Google Books API
- Browse NYT bestseller lists
- Genre-based book exploration
- Real-time search suggestions

### User Features
- Email-based authentication via Supabase
- Personal reading lists
- User profiles
- Follow other readers

### Social Features
- Book discussions and reviews
- Nested comments on discussions
- Voting system for discussions and comments

### UI/UX
- Responsive design for all devices
- Dark/light mode support
- Modern and clean interface
- Real-time search suggestions

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Set up environment variables
4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
