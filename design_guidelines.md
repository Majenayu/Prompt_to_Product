# Design Guidelines: India Renewable Energy & Carbon Tracking Platform

## Design Approach
**Selected System**: Carbon Design System (IBM) - optimized for data-heavy, enterprise applications requiring clarity, accessibility, and efficient information hierarchy.

**Core Principle**: Data-first design with professional credibility. This is a government/enterprise tool where trust, clarity, and efficiency drive adoption.

## Typography System
- **Primary Font**: IBM Plex Sans (via Google Fonts CDN)
- **Headers**: Semi-bold (600) for primary headings, Medium (500) for subheadings
- **Body**: Regular (400) for content, Medium (500) for emphasis
- **Data/Metrics**: Mono for numerical displays and data tables
- **Scale**: Large impactful numbers for key metrics (text-4xl to text-6xl), standard sizing (text-sm to text-lg) for content hierarchy

## Layout System
**Spacing Primitives**: Use Tailwind units of 1, 2, 4, 6, 8, 12, 16 for consistent rhythm
- Component padding: p-4 to p-6
- Section spacing: py-8 to py-16
- Card gaps: gap-4 to gap-6
- Dashboard grids: gap-6 for desktop, gap-4 for mobile

**Grid Strategy**:
- Dashboard: 12-column responsive grid with mixed column spans (3-col stats, 2-col charts, full-width maps)
- Data cards: 3-4 columns on desktop (grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4)
- Tables: Full-width with horizontal scroll on mobile

## Component Library

### Navigation
- **Top Bar**: Horizontal navigation with logo left, primary navigation center, user profile/notifications right
- **Sidebar** (Dashboard Views): Collapsible left sidebar (280px expanded, 64px collapsed) with icon + label navigation
- Breadcrumb trail for deep navigation paths

### Data Display Components
- **Metric Cards**: Large number displays with trend indicators (↑↓ arrows), comparison text, sparkline charts
- **Charts**: Use Chart.js for line graphs (emission trends), bar charts (capacity by region), pie/donut charts (energy mix), area charts (cumulative growth)
- **Tables**: Striped rows, sortable columns, sticky headers, pagination controls, action buttons per row
- **Progress Bars**: Multi-segment bars showing progress toward targets with numerical labels
- **Map Component**: Interactive India map with state-level data overlays, color intensity for metrics, clickable regions with tooltips

### Forms & Input
- **Filters**: Dropdown selects, date range pickers, multi-select checkboxes, search inputs with clear buttons
- **Data Entry**: Label-above-input pattern, helper text below, validation states (success/error), unit indicators (MW, tons CO2)
- **Carbon Calculator**: Step-by-step form with category cards, number inputs with +/- steppers, running total sidebar

### Information Architecture
- **Status Badges**: Pill-shaped labels with dot indicators (Planning, Approved, Under Construction, Operational)
- **Alerts/Notifications**: Toast notifications for updates, banner alerts for system messages
- **Tooltips**: Contextual help on hover for complex metrics and terminology
- **Empty States**: Illustrative placeholders with clear CTAs when no data exists

## Page Layouts

### Dashboard (Landing)
- Hero Stats Row: 4 large metric cards (Total Capacity, Target Progress, Carbon Reduced, Active Projects)
- Interactive Map: Full-width India map showing installations
- Charts Grid: 2-column layout with key trend visualizations
- Recent Activity Feed: Side panel with latest project updates

### Project Tracker
- Filter Bar: Horizontal controls for state, technology type, status
- Project Cards/Table Toggle: Switch between card grid and detailed table view
- Project Details: Modal or side panel with comprehensive information, timeline, documents

### Carbon Reporting Tool
- Input Form: Multi-section accordion (Energy Usage, Transportation, Waste Management)
- Live Calculation: Sticky summary card showing running total
- Comparison View: Chart comparing to benchmarks and historical data
- Export Options: PDF/CSV download buttons prominently placed

### Financing Hub
- Scheme Cards: Grid layout with funding amount, eligibility criteria, application deadline
- Filter Sidebar: Category filters, amount ranges, region filters
- Detail Pages: Two-column layout (scheme info left, application process right)

## Images
**Map Visualization**: Central interactive SVG/Canvas map of India with state boundaries - this is data-driven, not a static image
**Empty State Illustrations**: Simple, professional line-art style illustrations for empty data states (no projects, no reports submitted)
**Scheme/Financing Section**: Small representative icons/badges for government programs (not photographs)

**No Hero Image**: This is a data platform, not a marketing site. Lead directly with the dashboard metrics and actionable interface.

## Interactions (Minimal)
- Smooth transitions on data updates (300ms ease)
- Hover states: Slight elevation on cards (shadow increase), underline on links
- Chart interactions: Tooltips on hover, click to drill down
- Map: Hover highlights state, click for details panel
- **No decorative animations** - focus on functional micro-interactions for data clarity

## Accessibility Implementation
- WCAG AA contrast ratios throughout
- Keyboard navigation for all interactive elements
- Screen reader labels for data visualizations
- Focus indicators on all form inputs and buttons
- Aria labels for icon-only buttons
- Consistent tab order following logical information flow