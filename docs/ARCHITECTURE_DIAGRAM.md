# HelpingHand System Architecture Diagrams

This document contains visual architecture diagrams for the HelpingHand platform.

## High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                   │
├──────────────────────┬──────────────────────┬─────────────────────────────┤
│   Web App (React)   │  Mobile App         │   Landing Page              │
│   - Port 3000       │  (React Native)     │   (Static Site)             │
│   - Vite            │  - Expo             │   - Marketing               │
│   - TypeScript      │  - TypeScript       │   - SEO Optimized            │
└──────────┬──────────┴──────────┬──────────┴──────────────┬─────────────┘
           │                     │                          │
           └─────────────────────┴──────────────────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │      API Gateway           │
                    │  - Express.js              │
                    │  - Authentication          │
                    │  - Rate Limiting           │
                    │  - Request Routing         │
                    │  - CORS Handling           │
                    └─────────────┬─────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
┌───────▼────────┐    ┌───────────▼────────┐    ┌─────────▼─────────┐
│ Event Service  │    │  User Service     │    │  Map Service      │
│                │    │                    │    │                   │
│ - CRUD Events  │    │  - Authentication  │    │  - Geospatial     │
│ - RSVPs        │    │  - Profiles        │    │  - Radius Search  │
│ - Comments     │    │  - Friendships     │    │  - Pin Management │
│ - Capacity     │    │  - Preferences      │    │  - Clustering     │
└───────┬────────┘    └───────────┬────────┘    └─────────┬─────────┘
        │                         │                         │
        └─────────────────────────┼─────────────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
┌───────▼────────┐    ┌───────────▼────────┐    ┌─────────▼─────────┐
│ Notification   │    │  File Service     │    │  Search Service   │
│ Service        │    │                    │    │                   │
│                │    │  - Image Upload    │    │  - Full-text       │
│ - Real-time    │    │  - Optimization   │    │  - Filtering      │
│ - Push Notif   │    │  - CDN Delivery   │    │  - Sorting        │
│ - Email        │    │  - Validation      │    │  - Indexing       │
└────────────────┘    └────────────────────┘    └───────────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │      DATA LAYER           │
                    ├──────────────────────────┤
                    │  PostgreSQL               │
                    │  - Primary Database       │
                    │  - PostGIS Extension     │
                    │  - Full-text Search       │
                    │  - ACID Compliance        │
                    ├──────────────────────────┤
                    │  Redis                    │
                    │  - Caching Layer          │
                    │  - Session Storage        │
                    │  - Pub/Sub                │
                    │  - Rate Limiting          │
                    ├──────────────────────────┤
                    │  S3 / Cloud Storage       │
                    │  - Event Images           │
                    │  - User Avatars           │
                    │  - CDN Integration        │
                    └──────────────────────────┘
```

## Component Interaction Flow

### Event Discovery Flow

```
User Browser/Mobile App
    │
    ├─► Request: GET /api/events?lat=X&lng=Y&radius=Z
    │
    ▼
API Gateway
    │
    ├─► Authenticate JWT Token
    ├─► Rate Limit Check
    │
    ▼
Map Service
    │
    ├─► Check Redis Cache
    │   ├─► Cache Hit: Return cached events
    │   └─► Cache Miss: Continue
    │
    ├─► Query PostgreSQL with PostGIS
    │   └─► ST_DWithin(location, point, radius)
    │
    ├─► Filter by category, date, age
    │
    ├─► Sort by distance
    │
    ├─► Cache results in Redis
    │
    ▼
Response: Event list with coordinates
    │
    ▼
Client renders pins on Google Maps
```

### Event Creation Flow

```
User fills Create Event Form
    │
    ├─► Upload banner image
    │   │
    │   ▼
    │   File Service
    │   ├─► Validate image
    │   ├─► Resize & optimize (Sharp)
    │   ├─► Upload to S3
    │   └─► Return CDN URL
    │
    ├─► Submit event data
    │   │
    │   ▼
    │   API Gateway
    │   ├─► Authenticate
    │   ├─► Validate request
    │   │
    │   ▼
    │   Event Service
    │   ├─► Create event in PostgreSQL
    │   ├─► Store geospatial location
    │   ├─► Set status to 'active'
    │   │
    │   ▼
    │   Notification Service
    │   ├─► Find nearby users
    │   ├─► Create notifications
    │   ├─► Emit via Socket.io
    │   └─► Send push notifications
    │
    ▼
Response: Created event with ID
    │
    ▼
Client updates map with new pin
```

### Real-time Notification Flow

```
Event Occurs (New RSVP, Comment, etc.)
    │
    ▼
Service Layer (Event/User Service)
    │
    ├─► Create notification record in DB
    │
    ├─► Publish to Redis Pub/Sub
    │   └─► Channel: notifications:{userId}
    │
    ▼
Notification Service
    │
    ├─► Subscribe to Redis channels
    │
    ├─► Check user preferences
    │
    ├─► Emit via Socket.io
    │   └─► Event: 'notification'
    │
    ├─► Send push notification (if mobile)
    │
    └─► Send email (if enabled)
    │
    ▼
Client receives notification
    │
    ├─► Update notification badge
    ├─► Show toast notification
    └─► Update UI in real-time
```

## Database Schema Relationships

```
┌─────────────┐
│    Users    │
│─────────────│
│ id (PK)     │
│ email       │
│ name        │
│ location    │
│ ...         │
└──────┬──────┘
       │
       │ 1:N
       │
       ├──────────────────┐
       │                  │
       │                  │
┌──────▼──────┐    ┌──────▼──────┐
│   Events    │    │ Friendships │
│─────────────│    │─────────────│
│ id (PK)     │    │ id (PK)     │
│ host_id(FK) │    │ user_id(FK) │
│ title       │    │ friend_id(FK)│
│ location    │    │ status      │
│ category    │    │ ...         │
│ ...         │    └──────────────┘
└──────┬──────┘
       │
       │ 1:N
       │
       ├──────────────┬──────────────┐
       │              │              │
┌──────▼──────┐ ┌─────▼──────┐ ┌─────▼──────┐
│    RSVPs    │ │  Comments  │ │Notifications│
│─────────────│ │────────────│ │────────────│
│ id (PK)     │ │ id (PK)    │ │ id (PK)    │
│ event_id(FK)│ │ event_id(FK)│ │ user_id(FK)│
│ user_id(FK) │ │ user_id(FK)│ │ type       │
│ status      │ │ content    │ │ message    │
│ ...         │ │ ...        │ │ ...        │
└─────────────┘ └────────────┘ └────────────┘
```

## Deployment Architecture

### Development Environment

```
┌─────────────────────────────────────────┐
│     Developer Machine                   │
│                                         │
│  ┌──────────┐  ┌──────────┐            │
│  │  Client  │  │  Server  │            │
│  │  (Vite)  │  │ (Express)│            │
│  │ :3000    │  │ :5000    │            │
│  └────┬─────┘  └────┬─────┘            │
│       │             │                   │
└───────┼─────────────┼───────────────────┘
        │             │
        ▼             ▼
┌─────────────────────────────────────────┐
│     Docker Compose                      │
│                                         │
│  ┌──────────┐  ┌──────────┐            │
│  │PostgreSQL│  │  Redis   │            │
│  │  :5432   │  │  :6379   │            │
│  └──────────┘  └──────────┘            │
└─────────────────────────────────────────┘
```

### Production Environment

```
┌─────────────────────────────────────────────────────────────┐
│                    CDN (CloudFront/Cloudflare)                │
│                    - Static Assets                            │
│                    - Images                                   │
└───────────────────────────┬───────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌───────▼────────┐  ┌──────▼────────┐
│  Web App       │  │  Mobile App     │  │ Landing Page  │
│  (Vercel)      │  │  (App Stores)  │  │ (Vercel)      │
│  - React SPA   │  │  - iOS/Android  │  │ - Static      │
└───────┬────────┘  └─────────────────┘  └───────────────┘
        │
        │ HTTPS
        │
┌───────▼──────────────────────────────────────────────────────┐
│                    Load Balancer                              │
│                    - SSL Termination                          │
│                    - Request Routing                           │
└───────┬──────────────────────────────────────────────────────┘
        │
        │
┌───────▼──────────────────────────────────────────────────────┐
│              API Gateway (EC2/Cloud Run)                      │
│              - Multiple Instances                              │
│              - Auto-scaling                                   │
└───────┬──────────────────────────────────────────────────────┘
        │
        ├──────────────────┬──────────────────┬──────────────┐
        │                  │                  │              │
┌───────▼────────┐ ┌───────▼────────┐ ┌───────▼────────┐ ┌───▼────┐
│ Event Service  │ │ User Service  │ │ Map Service    │ │ ...   │
│ (Containers)   │ │ (Containers)  │ │ (Containers)   │ │        │
└────────────────┘ └───────────────┘ └────────────────┘ └────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼────────┐ ┌───────▼────────┐ ┌───────▼────────┐
│  PostgreSQL    │ │     Redis      │ │  S3/Storage    │
│  (RDS)         │ │ (ElastiCache)  │ │  (S3 Bucket)   │
│  - Primary     │ │  - Cache       │ │  - Images      │
│  - Replicas    │ │  - Sessions    │ │  - Assets      │
└────────────────┘ └────────────────┘ └────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (Browser/Mobile)                    │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   HTTPS     │  │   JWT Token  │  │   CORS       │      │
│  │   Only      │  │   (httpOnly) │  │   Headers    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└───────────────────────────┬───────────────────────────────────┘
                            │
                            │ HTTPS/TLS
                            │
┌───────────────────────────▼───────────────────────────────────┐
│                    API Gateway                                 │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Helmet     │  │   Rate      │  │   Input     │      │
│  │   Headers    │  │   Limiting  │  │   Validation│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   JWT        │  │   CORS       │  │   CSRF       │      │
│  │   Auth       │  │   Policy     │  │   Protection │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└───────────────────────────┬───────────────────────────────────┘
                            │
┌───────────────────────────▼───────────────────────────────────┐
│                    Service Layer                                │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   SQL       │  │   XSS       │  │   File      │      │
│  │   Injection │  │   Sanitize  │  │   Validation│      │
│  │   Prevention│  │             │  │             │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└───────────────────────────┬───────────────────────────────────┘
                            │
┌───────────────────────────▼───────────────────────────────────┐
│                    Data Layer                                  │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Encrypted  │  │   Backups    │  │   Access    │      │
│  │   Passwords  │  │   (Encrypted)│  │   Control   │      │
│  │   (bcrypt)   │  │              │  │             │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└───────────────────────────────────────────────────────────────┘
```

## Scalability Architecture

### Horizontal Scaling Strategy

```
                    ┌──────────────┐
                    │ Load Balancer│
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼────────┐ ┌───────▼────────┐ ┌───────▼────────┐
│ API Instance 1 │ │ API Instance 2 │ │ API Instance N │
│ (Stateless)    │ │ (Stateless)    │ │ (Stateless)    │
└───────┬────────┘ └───────┬────────┘ └───────┬────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼────────┐ ┌───────▼────────┐ ┌───────▼────────┐
│ PostgreSQL     │ │     Redis       │ │  S3/Storage    │
│ Primary        │ │  Cluster        │ │  (Scalable)    │
│ + Replicas     │ │  (Sharded)      │ │                │
└────────────────┘ └─────────────────┘ └────────────────┘
```

### Caching Strategy

```
Client Request
    │
    ▼
API Gateway
    │
    ├─► Check Rate Limit Cache (Redis)
    │
    ▼
Service Layer
    │
    ├─► Check Response Cache (Redis)
    │   ├─► Cache Hit: Return cached data
    │   └─► Cache Miss: Continue
    │
    ├─► Query Database
    │
    ├─► Process Data
    │
    ├─► Cache Result (Redis)
    │   └─► TTL: 5-15 minutes
    │
    ▼
Return Response
```

## Technology Stack Visualization

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND STACK                            │
├─────────────────────────────────────────────────────────────┤
│ React 18 + TypeScript                                        │
│ ├─► Vite (Build Tool)                                       │
│ ├─► React Router (Routing)                                  │
│ ├─► Redux Toolkit (State)                                   │
│ ├─► React Query (Data Fetching)                             │
│ ├─► Material-UI (Components)                                │
│ └─► Google Maps API (Maps)                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    BACKEND STACK                              │
├─────────────────────────────────────────────────────────────┤
│ Node.js + Express + TypeScript                               │
│ ├─► TypeORM (ORM)                                           │
│ ├─► JWT (Authentication)                                    │
│ ├─► Socket.io (Real-time)                                   │
│ ├─► Multer (File Upload)                                    │
│ ├─► Sharp (Image Processing)                                │
│ └─► Winston (Logging)                                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    DATA STACK                                 │
├─────────────────────────────────────────────────────────────┤
│ PostgreSQL 14+                                               │
│ ├─► PostGIS (Geospatial)                                    │
│ ├─► pg_trgm (Full-text Search)                              │
│ └─► Connection Pooling                                       │
│                                                              │
│ Redis 6+                                                     │
│ ├─► Caching                                                  │
│ ├─► Sessions                                                 │
│ └─► Pub/Sub                                                  │
│                                                              │
│ AWS S3 / Cloud Storage                                       │
│ └─► File Storage                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    MOBILE STACK                               │
├─────────────────────────────────────────────────────────────┤
│ React Native + Expo                                          │
│ ├─► React Navigation (Navigation)                            │
│ ├─► Redux Toolkit (State)                                    │
│ ├─► react-native-maps (Maps)                                  │
│ └─► Expo Notifications (Push)                                │
└─────────────────────────────────────────────────────────────┘
```

---

For detailed architecture documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md)
For database schema, see [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)
For technology stack details, see [TECH_STACK.md](./TECH_STACK.md)
