# Oblivion Warp Config Manager

## Overview

This is a React-based web application designed to help Iranian users manage VPN configurations, specifically focusing on WireGuard and Warp configurations. The application provides a lightweight, user-friendly interface for generating, testing, and managing VPN configurations optimized for users with limited internet access.

## System Architecture

The application follows a full-stack architecture with clear separation between client and server components:

- **Frontend**: React SPA with TypeScript, using Vite for development and build tooling
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for data persistence
- **UI Framework**: Tailwind CSS with shadcn/ui components for consistent design
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing

## Key Components

### Frontend Architecture
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for utility-first styling
- **TanStack Query** for server state management and caching
- **React Hook Form** with Zod validation for form handling
- **Wouter** for minimal routing solution

### Backend Architecture
- **Express.js** server with TypeScript
- **RESTful API** design with proper error handling
- **Modular service architecture** for business logic separation
- **Memory storage** with interface for easy database migration
- **Middleware** for request logging and error handling

### Database Schema
The application uses Drizzle ORM with PostgreSQL, defining a `configurations` table with the following structure:
- Configuration metadata (id, name, created_at)
- WireGuard settings (private_key, public_key, endpoint)
- Network configuration (dns, mtu)
- Warp-specific settings (warp_plus, region)
- Testing results (is_valid, test_results)

### UI/UX Design
- **Responsive design** optimized for both desktop and mobile
- **Bilingual support** (English/Persian) with RTL layout support
- **Dark/light theme** support through CSS variables
- **Accessibility** features through Radix UI primitives
- **Persian font integration** (Vazirmatn) for proper Persian text rendering

## Data Flow

1. **Configuration Generation**: Users input preferences → API calls Warp service → Configuration stored → WireGuard config generated
2. **Configuration Testing**: Selected config → API performs connectivity tests → Results stored and displayed
3. **Configuration Management**: CRUD operations through API → Database updates → UI reflects changes
4. **Export/Download**: Configurations formatted as standard WireGuard files for easy import

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm & drizzle-kit**: Database ORM and migration tools
- **@tanstack/react-query**: Server state management
- **@hookform/resolvers**: Form validation integration
- **zod**: Runtime type validation and schema definition

### UI Dependencies
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Dependencies
- **typescript**: Type safety and better developer experience
- **vite**: Fast build tool and development server
- **tsx**: TypeScript execution for Node.js

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

### Build Process
- **Development**: `npm run dev` - Runs both Vite dev server and Express API
- **Production Build**: `npm run build` - Creates optimized client bundle and server build
- **Production Start**: `npm run start` - Serves the built application

### Environment Configuration
- **Database**: Requires `DATABASE_URL` environment variable for PostgreSQL connection
- **Development Features**: Includes Replit-specific development banner and cartographer integration
- **CORS & Security**: Configured for secure cross-origin requests

### File Structure
- `/client` - React frontend application
- `/server` - Express backend API
- `/shared` - Common TypeScript types and schemas
- `/dist` - Production build output

## Changelog

```
Changelog:
- June 29, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```