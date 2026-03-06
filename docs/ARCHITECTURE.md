# HelpingHand System Architecture

## Overview

HelpingHand follows a modern, scalable architecture designed to support high traffic and real-time features. The system is built with microservices principles in mind, allowing for independent scaling of components.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
├──────────────────────┬──────────────────┬───────────────────────┤
│   Web App (React)    │  Mobile App      │   Landing Page        │
│   - Port 3000        │  (React Native)  │   (Static Site)       │
└──────────┬───────────┴────────┬─────────┴───────────┬───────────┘
           │                    │                     │
           └────────────────────┴─────────────────────┘
                              │
                    ┌─────────▼──────────┐
                    │   API Gateway      │
                    │   - Authentication │
                    │   - Rate Limiting  │
                    │   - Request Routing│
                    └─────────┬──────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐  ┌─────────▼────────┐  ┌────────▼─────────┐
│  Event Service │  │  User Service   │  │  Map Service     │
│  - CRUD Events │  │  - Auth         │  │  - Geospatial    │
│  - RSVPs       │  │  - Profiles     │  │  - Radius Search │
│  - Comments    │  │  - Friendships  │  │  - Pin Management│
└───────┬────────┘  └─────────┬────────┘  └────────┬─────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐  ┌─────────▼────────┐  ┌────────▼─────────┐
│ Notification   │  │  File Service   │  │  Search Service  │
│ Service        │  │  - Image Upload │  │  - Full-text      │
│ - Real-time    │  │  - CDN Delivery │  │  - Filtering      │
│ - Push Notif   │  │  - Optimization │  │  - Sorting        │
└────────────────┘  └─────────────────┘  └───────────────────┘
                              │
                    ┌─────────▼──────────┐
                    │   Data Layer       │
                    ├────────────────────┤
                    │  PostgreSQL        │
                    │  - Primary DB      │
                    │  - Geospatial     │
                    │  - Full-text      │
                    ├────────────────────┤
                    │  Redis             │
                    │  - Caching         │
                    │  - Sessions        │
                    │  - Real-time       │
                    ├────────────────────┤
                    │  S3 / Cloud Storage│
                    │  - Event Images    │
                    │  - User Avatars    │
                    └────────────────────┘
```

## Component Architecture

### 1. Client Layer

#### Web Application (React)
- **Framework**: React 18 with TypeScript
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **UI Library**: Material-UI or Tailwind CSS
- **Maps**: @react-google-maps/api
- **Data Fetching**: React Query / TanStack Query

**Key Components:**
```
src/
├── components/
│   ├── Map/
│   │   ├── EventMap.tsx
│   │   ├── EventPin.tsx
│   │   └── EventPopup.tsx
│   ├── Events/
│   │   ├── EventCard.tsx
│   │   ├── EventList.tsx
│   │   └── EventFilters.tsx
│   └── Common/
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Footer.tsx
├── pages/
│   ├── LandingPage.tsx
│   ├── MapPage.tsx
│   ├── EventDetailPage.tsx
│   ├── CreateEventPage.tsx
│   ├── ProfilePage.tsx
│   └── FriendsPage.tsx
└── services/
    ├── api.ts
    ├── auth.ts
    └── maps.ts
```

#### Mobile Application (React Native)
- **Framework**: React Native with Expo
- **Navigation**: React Navigation
- **State Management**: Redux Toolkit
- **Maps**: react-native-maps
- **Push Notifications**: Expo Notifications

**Key Screens:**
```
src/
├── screens/
│   ├── HomeScreen.tsx (Map)
│   ├── EventsScreen.tsx
│   ├── EventDetailScreen.tsx
│   ├── CreateEventScreen.tsx
│   ├── ProfileScreen.tsx
│   └── MessagesScreen.tsx
└── navigation/
    └── AppNavigator.tsx
```

### 2. API Gateway

**Responsibilities:**
- Request routing to appropriate services
- Authentication and authorization
- Rate limiting
- Request/response transformation
- CORS handling
- API versioning

**Technology**: Express.js with middleware stack

**Middleware Stack:**
```javascript
app.use(helmet())              // Security headers
app.use(cors())                // CORS configuration
app.use(rateLimit())          // Rate limiting
app.use(authenticate)         // JWT validation
app.use(validateRequest)      // Request validation
app.use(errorHandler)         // Error handling
```

### 3. Service Layer

#### Event Service
**Responsibilities:**
- Event CRUD operations
- RSVP management
- Comment system
- Event search and filtering
- Capacity management

**Endpoints:**
```
GET    /api/events              # List events with filters
GET    /api/events/:id          # Get event details
POST   /api/events              # Create event
PUT    /api/events/:id          # Update event
DELETE /api/events/:id          # Delete event
POST   /api/events/:id/rsvp     # RSVP to event
DELETE /api/events/:id/rsvp     # Cancel RSVP
GET    /api/events/:id/comments # Get comments
POST   /api/events/:id/comments # Add comment
```

#### User Service
**Responsibilities:**
- User authentication (JWT)
- User profile management
- Friend connections
- User search

**Endpoints:**
```
POST   /api/auth/register       # Register user
POST   /api/auth/login          # Login
POST   /api/auth/refresh        # Refresh token
GET    /api/users/:id           # Get user profile
PUT    /api/users/:id           # Update profile
GET    /api/users/:id/friends   # Get friends list
POST   /api/users/:id/friends   # Add friend
DELETE /api/users/:id/friends   # Remove friend
```

#### Map Service
**Responsibilities:**
- Geospatial queries
- Radius-based event search
- Distance calculations
- Pin clustering for performance

**Technology**: PostgreSQL with PostGIS extension

**Key Queries:**
```sql
-- Find events within radius
SELECT * FROM events
WHERE ST_DWithin(
  location,
  ST_MakePoint(:lng, :lat)::geography,
  :radius
)
ORDER BY ST_Distance(location, ST_MakePoint(:lng, :lat)::geography);
```

#### Notification Service
**Responsibilities:**
- Real-time notifications via WebSocket
- Push notifications for mobile
- Email notifications
- Notification preferences

**Technology**: Socket.io for WebSocket, Expo Push Notifications

#### File Service
**Responsibilities:**
- Image upload handling
- Image optimization and resizing
- CDN integration
- File validation

**Technology**: Multer for uploads, Sharp for image processing, AWS S3

### 4. Data Layer

#### PostgreSQL Database
**Primary Database** for:
- Users and authentication
- Events and RSVPs
- Comments
- Friendships
- Notifications

**Extensions:**
- PostGIS for geospatial data
- pg_trgm for full-text search
- pgcrypto for password hashing

**Connection Pooling**: pg-pool

#### Redis Cache
**Use Cases:**
- Session storage
- API response caching
- Real-time data (Socket.io)
- Rate limiting counters
- Geospatial caching

**Key Patterns:**
```
user:{userId}:profile          # User profile cache
events:radius:{lat}:{lng}      # Cached event lists
event:{eventId}:rsvps          # RSVP count cache
```

#### Object Storage (S3/Cloud Storage)
**Storage for:**
- Event banner images
- User profile photos
- Event photos
- Documents

**CDN Integration**: CloudFront/Cloudflare for fast delivery

## Data Flow

### Event Discovery Flow
```
1. User opens map → Client requests events
2. API Gateway receives request
3. Map Service queries PostgreSQL with geospatial query
4. Results cached in Redis
5. Response sent to client
6. Client renders pins on Google Maps
```

### Event Creation Flow
```
1. User fills form → Client sends POST /api/events
2. API Gateway validates and routes to Event Service
3. File Service uploads image to S3
4. Event Service creates event in PostgreSQL
5. Notification Service notifies nearby users
6. Response with event data sent to client
7. Client updates map with new pin
```

### Real-time Notification Flow
```
1. Event occurs (new RSVP, comment, etc.)
2. Service publishes event to Redis pub/sub
3. Notification Service receives event
4. Socket.io emits to connected clients
5. Client receives notification
6. UI updates in real-time
```

## Security Architecture

### Authentication Flow
```
1. User logs in → POST /api/auth/login
2. Server validates credentials
3. Server generates JWT (access + refresh tokens)
4. Tokens stored in httpOnly cookies
5. Subsequent requests include JWT in Authorization header
6. API Gateway validates JWT on each request
```

### Authorization
- Role-based access control (RBAC)
- Resource-level permissions
- Event ownership validation
- Friend-only features

### Security Measures
- HTTPS only
- JWT token expiration
- Rate limiting per IP/user
- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- XSS protection
- CSRF tokens
- Secure password hashing (bcrypt)

## Scalability Considerations

### Horizontal Scaling
- Stateless API services (can scale horizontally)
- Load balancer distributes requests
- Database read replicas for read-heavy operations
- Redis cluster for distributed caching

### Performance Optimization
- **Database Indexing**: 
  - Geospatial indexes on event locations
  - Indexes on frequently queried fields
- **Caching Strategy**:
  - Redis for hot data
  - CDN for static assets
  - Browser caching for static resources
- **Query Optimization**:
  - Pagination for large result sets
  - Lazy loading for images
  - Pin clustering on map for performance

### Monitoring & Observability
- **Logging**: Winston/Pino for structured logging
- **Metrics**: Prometheus + Grafana
- **APM**: New Relic / Datadog
- **Error Tracking**: Sentry
- **Uptime Monitoring**: Pingdom / UptimeRobot

## Deployment Architecture

### Development Environment
```
Local Development:
- Docker Compose for services
- Local PostgreSQL
- Local Redis
- Mock Google Maps (optional)
```

### Production Environment
```
Cloud Provider (AWS/GCP):
├── Frontend: Vercel / CloudFront
├── API Gateway: Load Balanced EC2/Cloud Run
├── Services: Containerized (Docker/Kubernetes)
├── Database: Managed PostgreSQL (RDS/Cloud SQL)
├── Cache: Managed Redis (ElastiCache/Memorystore)
├── Storage: S3 / Cloud Storage
└── CDN: CloudFront / Cloudflare
```

## Future Architecture Enhancements

### Microservices Migration
As the application grows, services can be split:
- Event Service → Event Management + RSVP Service
- User Service → Auth Service + Profile Service
- Map Service → Geospatial Service + Search Service

### Message Queue
For async processing:
- RabbitMQ / AWS SQS for event processing
- Background jobs for notifications
- Image processing queue

### GraphQL API
Alternative API layer:
- Apollo Server for GraphQL
- Type-safe queries
- Efficient data fetching

## Technology Decisions

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Frontend | React | Large ecosystem, component reusability |
| Backend | Node.js/Express | JavaScript across stack, fast development |
| Database | PostgreSQL | ACID compliance, PostGIS for geospatial |
| Cache | Redis | Fast, supports pub/sub for real-time |
| Maps | Google Maps | Reliable, feature-rich, good documentation |
| Mobile | React Native | Code sharing with web, cross-platform |
| Auth | JWT | Stateless, scalable, industry standard |

---

For detailed database schema, see [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)
For technology stack details, see [TECH_STACK.md](./TECH_STACK.md)
