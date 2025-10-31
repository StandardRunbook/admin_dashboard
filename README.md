# Metrics to Log Streams Dashboard

A Next.js application that allows you to map metrics to log streams with ClickHouse database backend.

## Features

- **ClickHouse Database**: Persistent storage for mappings
- **Dashboard**: Create and manage metric-to-log-stream mappings
- **Search & Filter**: Filter mappings by organization, service, and region
- **Modern UI**: Clean, Stripe-like design with inline CSS

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure ClickHouse

1. Install ClickHouse locally or use a remote instance
2. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

3. Update `.env.local` with your ClickHouse credentials:

```env
CLICKHOUSE_HOST=localhost
CLICKHOUSE_PORT=8123
CLICKHOUSE_DATABASE=metrics_db
CLICKHOUSE_USER=default
CLICKHOUSE_PASSWORD=
```

### 3. Initialize Database

```bash
make setup-db
make create-tables
```

### 4. Run the Development Server

```bash
pnpm dev
# or
make dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── api/mappings/          # API routes for CRUD operations
│   ├── create-mapping/        # Create mapping page
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page with filters
├── components/
│   ├── MetricMappingForm.tsx # Form to create mappings
│   └── MappingsList.tsx      # Expandable list of mappings
├── lib/
│   ├── clickhouse.ts         # ClickHouse client configuration
│   └── db.ts                 # Legacy localStorage (not used)
├── schema.sql                # Database schema
└── Makefile                  # Database management commands
```

## Usage

1. **View Mappings**: Browse all active mappings on the home page
2. **Search & Filter**: Use the search bar and dropdown filters to find specific mappings
3. **Create Mapping**: Click "Create New Mapping" and fill out:
   - Organization (e.g., `acme-corp`)
   - Dashboard Name (e.g., `system-metrics`)
   - Panel Title (e.g., `API Request Rate`)
   - Metric Name (e.g., `http_requests_total`)
   - Service (e.g., `api-service`)
   - Region (e.g., `us-east-1`)
   - Log Stream Name (e.g., `/aws/ecs/api-service`)
4. **Expand Details**: Click on any mapping row to see full details
5. **Delete Mappings**: Click the delete button to remove a mapping

## Makefile Commands

```bash
make help              # Show all available commands
make dev               # Start development server (pnpm dev)
make install           # Install dependencies (pnpm install)
make build             # Build for production (pnpm build)
make setup-db          # Create ClickHouse database
make create-tables     # Create all tables and views
make drop-tables       # Drop all tables (with confirmation)
make reset-db          # Drop and recreate all tables
make test-connection   # Test ClickHouse connection
make query-mappings    # Display all active mappings
make show-stats        # Show database statistics
```

## Technologies

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **ClickHouse** - Database for persistent storage
- **Tailwind CSS v4** - Styling (with inline CSS fallback)
- **pnpm** - Package manager

## Development

Build for production:
```bash
pnpm build
```

Start production server:
```bash
pnpm start
```
