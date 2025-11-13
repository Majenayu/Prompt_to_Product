# India Renewable Energy & Carbon Tracking Platform

## Overview
A comprehensive digital platform designed to accelerate renewable energy deployment and enable real-time carbon emission tracking across India. This application bridges the gap between national renewable energy targets and local-level implementation for effective climate action.

## Purpose
- Accelerate renewable energy deployment across regions
- Enable real-time tracking and transparent reporting of carbon metrics
- Bridge the gap between national targets and local implementation
- Provide financing information for renewable energy projects
- Facilitate data-driven decision making for climate action

## Current State
The application is a fully functional MVP with:
- Interactive dashboard with national and regional renewable energy metrics
- Project tracker for managing renewable energy installations
- Carbon emission calculator with step-by-step reporting
- Financing hub with government schemes and incentives
- Advanced analytics with data visualizations
- Dark mode support
- Responsive design for all screen sizes

## Recent Changes (November 13, 2025)
- Initial project setup with complete schema definition
- Implemented all frontend components with professional IBM Plex Sans typography
- Built comprehensive dashboard with charts and India map visualization
- Created project tracker with filtering and CRUD operations
- Developed multi-step carbon calculator with benchmarking
- Built financing hub with scheme management
- Implemented advanced analytics with trend visualizations
- Set up complete backend API with in-memory storage
- Added sample data for demonstration purposes

## Project Architecture

### Frontend
- **Framework**: React with TypeScript
- **Routing**: Wouter
- **State Management**: TanStack Query v5
- **UI Components**: Shadcn UI with Radix primitives
- **Styling**: Tailwind CSS with custom design tokens
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod validation
- **Theme**: Light/Dark mode with IBM Plex Sans typography

### Backend
- **Runtime**: Node.js with Express
- **Storage**: In-memory MemStorage (ready for database migration)
- **Validation**: Zod schemas
- **API Design**: RESTful JSON API

### Data Model
1. **Renewable Projects**: Track solar, wind, hydro, and other renewable installations
2. **Carbon Emissions**: Record and analyze organization carbon footprints
3. **Financing Schemes**: Catalog government subsidies, loans, grants, and tax incentives
4. **Regional Capacity**: State-wise renewable energy capacity and targets

## Key Features

### Dashboard
- Real-time metrics: Total capacity, target progress, carbon tracked, active projects
- Interactive India map showing top 10 states by capacity
- Energy mix pie chart (Solar, Wind, Hydro)
- Project status distribution
- Growth trends visualization

### Project Tracker
- Complete CRUD operations for renewable projects
- Advanced filtering by state, technology, and status
- Status badges: Planning, Approved, Under Construction, Operational
- Detailed project cards with capacity, investment, and completion dates

### Carbon Calculator
- Multi-step form (Organization → Emissions → Review)
- Category-based emissions: Energy, Transport, Waste
- Running total calculation
- Benchmark comparison against average
- Visual breakdown charts
- Export functionality (PDF/CSV placeholder)

### Financing Hub
- Browse government financing schemes
- Filter by category: Subsidies, Loans, Grants, Tax Incentives
- Detailed scheme information including eligibility and deadlines
- Add new schemes for administrators

### Analytics
- Technology growth trends over time
- Top states comparison (current vs target)
- Cumulative capacity growth
- Carbon emissions breakdown
- Technology distribution radar chart

## User Preferences
- Design System: IBM Carbon Design System principles
- Color Scheme: Green-focused sustainability theme (--primary: 142 76% 36%)
- Typography: IBM Plex Sans for headers and body, IBM Plex Mono for data
- Visual Style: Professional, data-first, clean interfaces
- Interactions: Subtle hover elevations, smooth transitions
- Accessibility: WCAG AA compliance, keyboard navigation, screen reader support

## Environment
- Development database: In-memory storage with sample data
- No external API keys required for MVP
- Session secret configured for future auth implementation

## Next Steps (Post-MVP)
1. Migrate to persistent PostgreSQL database
2. Implement user authentication and multi-tenant support
3. Add automated data integration with government APIs
4. Implement AI-powered project recommendations
5. Add document management for compliance certificates
6. Create alert system for policy updates and deadlines
7. Implement actual PDF/CSV export functionality
8. Add real-time collaboration features
