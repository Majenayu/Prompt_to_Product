# Renewable Energy Dashboard for India

A comprehensive web application for tracking renewable energy projects, carbon emissions, financing schemes, and regional capacity data across India. Built with React, Express, and PostgreSQL.

## Features

### 🌍 Interactive Regional Map
- Visualize renewable energy capacity across Indian states
- Color-coded map showing solar, wind, and hydro capacity
- Click on states to view detailed capacity information
- Track progress toward renewable energy targets

### 📊 Analytics Dashboard
- Real-time metrics for renewable energy adoption
- Track total installed capacity across technologies
- Monitor carbon emission reductions
- View investment trends and project statistics

### 🏗️ Project Management
- Browse renewable energy projects across India
- Filter by state, technology (Solar, Wind, Hydro, Biomass, Nuclear), and status
- View project details including capacity, investment, and completion dates
- Add, edit, and delete projects

### 💰 Financing Schemes
- Discover government subsidies, loans, grants, and tax incentives
- Filter by category and target technology
- Access eligibility criteria and application deadlines
- Contact information for scheme administrators

### 🌱 Carbon Calculator
- Calculate carbon emissions for organizations
- Track energy, transport, and waste emissions
- Historical emission tracking and reporting
- Organization-level emission analytics

## Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **TanStack Query** - Server state management
- **Wouter** - Lightweight routing
- **shadcn/ui** - Beautiful, accessible UI components
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **Framer Motion** - Smooth animations

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type-safe server code
- **Drizzle ORM** - Type-safe database queries
- **PostgreSQL** (Neon) - Production database
- **Zod** - Runtime validation

## Prerequisites

- Node.js 20 or higher
- npm or yarn package manager
- PostgreSQL database (optional for local development)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd renewable-energy-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory (optional for local development):

```env
# Optional - Leave blank to use in-memory storage
DATABASE_URL=postgresql://user:password@host:port/database

# Development environment
NODE_ENV=development

# Port configuration (default: 5000)
PORT=5000
```

**Note:** The application automatically falls back to in-memory storage if `DATABASE_URL` is not provided, making it easy to get started without a database.

### 4. Database Setup (Optional)

If you want to use PostgreSQL instead of in-memory storage:

#### Push Schema to Database
```bash
npm run db:push
```

#### Seed Database with Sample Data
```bash
npm run db:seed
```

Or use tsx directly:
```bash
tsx server/seed.ts
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
.
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   └── src/
│       ├── components/    # React components
│       │   ├── ui/       # shadcn/ui components
│       │   ├── app-sidebar.tsx
│       │   ├── india-map.tsx
│       │   └── metric-card.tsx
│       ├── pages/        # Page components
│       │   ├── dashboard.tsx
│       │   ├── projects.tsx
│       │   ├── financing.tsx
│       │   ├── analytics.tsx
│       │   └── carbon-calculator.tsx
│       ├── hooks/        # Custom React hooks
│       ├── lib/          # Utility functions
│       ├── App.tsx       # Main app component
│       └── main.tsx      # Entry point
│
├── server/               # Backend Express application
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API routes
│   ├── storage.ts       # In-memory storage implementation
│   ├── db.ts            # Database connection
│   ├── db-storage.ts    # Database storage implementation
│   ├── seed.ts          # Database seeding script
│   └── vite.ts          # Vite integration
│
├── shared/              # Shared code between client and server
│   └── schema.ts        # Database schema and types
│
├── render.yaml          # Render deployment configuration
├── drizzle.config.ts    # Drizzle ORM configuration
├── vite.config.ts       # Vite configuration
├── tailwind.config.ts   # Tailwind CSS configuration
└── package.json         # Dependencies and scripts
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build frontend and backend for production |
| `npm start` | Start production server |
| `npm run check` | Run TypeScript type checking |
| `npm run db:push` | Push database schema to PostgreSQL |
| `npm run db:seed` | Seed database with sample data |

## API Documentation

### Projects

#### Get All Projects
```http
GET /api/projects
Query Parameters:
  - state: Filter by state name
  - technology: Filter by technology type
  - status: Filter by project status
```

#### Get Project by ID
```http
GET /api/projects/:id
```

#### Create Project
```http
POST /api/projects
Content-Type: application/json

{
  "name": "Solar Park Project",
  "state": "Gujarat",
  "technology": "Solar",
  "capacity": "1500",
  "status": "Operational",
  "description": "Large scale solar park",
  "investmentAmount": "5000000000",
  "completionDate": "2024-12-31"
}
```

#### Delete Project
```http
DELETE /api/projects/:id
```

### Carbon Emissions

#### Get All Emissions
```http
GET /api/carbon-emissions
```

#### Get Emission by ID
```http
GET /api/carbon-emissions/:id
```

#### Create Emission Record
```http
POST /api/carbon-emissions
Content-Type: application/json

{
  "organizationName": "Example Corp",
  "organizationType": "Large Corporation",
  "state": "Maharashtra",
  "reportingPeriod": "2024-Q1",
  "energyEmissions": "1500.50",
  "transportEmissions": "800.25",
  "wasteEmissions": "200.75",
  "totalEmissions": "2501.50"
}
```

#### Delete Emission Record
```http
DELETE /api/carbon-emissions/:id
```

### Financing Schemes

#### Get All Schemes
```http
GET /api/financing-schemes
Query Parameters:
  - category: Filter by category (Subsidies, Loans, Grants, Tax Incentives)
```

#### Get Scheme by ID
```http
GET /api/financing-schemes/:id
```

#### Create Scheme
```http
POST /api/financing-schemes
Content-Type: application/json

{
  "name": "Solar Subsidy Program",
  "description": "Government subsidy for solar installations",
  "category": "Subsidies",
  "fundingAmount": "Up to 30% of project cost",
  "eligibility": "Small businesses and residential",
  "applicationDeadline": "2025-06-30",
  "targetTechnology": "Solar",
  "contactInfo": "solar-subsidy@gov.in"
}
```

#### Delete Scheme
```http
DELETE /api/financing-schemes/:id
```

### Regional Capacity

#### Get All Regional Data
```http
GET /api/regional-capacity
```

#### Get Regional Data by State
```http
GET /api/regional-capacity/:state
```

#### Create Regional Data
```http
POST /api/regional-capacity
Content-Type: application/json

{
  "state": "Tamil Nadu",
  "solarCapacity": "12000",
  "windCapacity": "10000",
  "hydroCapacity": "5000",
  "totalCapacity": "27000",
  "targetCapacity": "35000",
  "population": 72000000
}
```

#### Delete Regional Data
```http
DELETE /api/regional-capacity/:id
```

## Deployment

### Deploying to Render

This application is configured for easy deployment on Render. See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) for detailed instructions.

#### Quick Start with render.yaml

1. Push your code to GitHub, GitLab, or Bitbucket
2. In Render dashboard, click **New +** → **Blueprint**
3. Connect your repository
4. Render will detect `render.yaml` and create:
   - PostgreSQL database
   - Web service with proper configuration
5. Click **Apply** to deploy

#### Manual Deployment

1. Create a PostgreSQL database in Render
2. Create a Web Service with:
   - **Build Command:** `npm install && npm run build && npm run db:push`
   - **Start Command:** `npm start`
   - **Environment Variables:**
     - `NODE_ENV=production`
     - `DATABASE_URL=<your-postgres-url>`
     - `PORT=5000`

3. After first deployment, seed the database:
   ```bash
   tsx server/seed.ts
   ```

### Environment Variables for Production

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment mode (production) | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes (for production) |
| `PORT` | Server port (default: 5000) | No |

## Database Schema

### Renewable Projects
- Project details including name, location, technology type
- Capacity, status, and completion information
- Investment amounts and descriptions

### Carbon Emissions
- Organization-level emission tracking
- Breakdown by energy, transport, and waste
- Reporting period and total emissions

### Financing Schemes
- Government and private financing options
- Categories: Subsidies, Loans, Grants, Tax Incentives
- Eligibility criteria and deadlines

### Regional Capacity
- State-wise renewable energy capacity
- Solar, wind, and hydro breakdowns
- Target capacity and population data

## Features in Detail

### Dashboard
- Overview of total installed capacity across all technologies
- Number of active projects and total investments
- Quick access to key metrics and recent updates
- Visual charts showing technology distribution

### Projects Page
- Comprehensive list of all renewable energy projects
- Advanced filtering by state, technology, and status
- Detailed project cards with key information
- Create new projects with validation

### Financing Page
- Browse available financing schemes
- Filter by category and technology
- View eligibility requirements
- Access application information and deadlines

### Analytics Page
- In-depth analysis of renewable energy trends
- Charts showing capacity growth over time
- Regional comparisons and insights
- Technology-wise breakdown

### Carbon Calculator
- Input organization details and emission sources
- Calculate total carbon footprint
- Track historical emissions
- Generate reports for sustainability planning

## Storage Architecture

The application supports two storage modes:

### In-Memory Storage (Default)
- Perfect for development and testing
- No database setup required
- Data resets on server restart
- Comes pre-seeded with sample data

### PostgreSQL Storage (Production)
- Persistent data storage
- Automatically activated when `DATABASE_URL` is set
- Uses Drizzle ORM for type-safe queries
- Supports Neon serverless PostgreSQL

The storage layer automatically selects the appropriate implementation based on environment configuration.

## Security Best Practices

- Environment variables for sensitive data
- Input validation using Zod schemas
- SQL injection protection via ORM
- Type-safe API routes and database queries
- CORS configuration for production

## Performance

- Server-side rendering for static assets
- Optimized bundle splitting
- Lazy loading of routes
- Efficient database queries with indexes
- Client-side caching with TanStack Query

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or contributions, please open an issue on GitHub.

## Acknowledgments

- Data sources: Ministry of New and Renewable Energy (MNRE), India
- UI components: shadcn/ui
- Icons: Lucide React
- Maps: Custom SVG India map

## Roadmap

- [ ] User authentication and authorization
- [ ] Export data to CSV/PDF
- [ ] Real-time updates using WebSockets
- [ ] Mobile application
- [ ] Advanced analytics and predictions
- [ ] Multi-language support
- [ ] Integration with government APIs
- [ ] Notification system for scheme deadlines
