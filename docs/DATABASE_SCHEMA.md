# HelpingHand Database Schema

## Overview

The HelpingHand database uses PostgreSQL with PostGIS extension for geospatial capabilities. The schema is designed to support efficient queries for location-based event discovery, user relationships, and real-time features.

## Entity Relationship Diagram

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│    Users    │         │    Events    │         │    RSVPs    │
├─────────────┤         ├──────────────┤         ├─────────────┤
│ id (PK)     │◄──┐     │ id (PK)      │◄──┐     │ id (PK)     │
│ email       │   │     │ host_id (FK) ├───┼─────┤ event_id(FK)│
│ password    │   │     │ title        │   │     │ user_id (FK)│
│ name        │   │     │ description  │   │     │ status      │
│ bio         │   │     │ category     │   │     │ created_at  │
│ avatar_url  │   │     │ location     │   │     └─────────────┘
│ location    │   │     │ (geography)  │   │
│ created_at  │   │     │ date_time    │   │
│ updated_at  │   │     │ capacity     │   │
└─────────────┘   │     │ banner_url   │   │
                  │     │ age_min      │   │
┌─────────────┐   │     │ age_max      │   │
│ Friendships │   │     │ created_at   │   │
├─────────────┤   │     │ updated_at   │   │
│ id (PK)     │   │     └──────────────┘   │
│ user_id (FK)├───┘                        │
│ friend_id   │                            │
│ status      │                            │
│ created_at  │                            │
└─────────────┘                            │
                                           │
┌─────────────┐                            │
│  Comments   │                            │
├─────────────┤                            │
│ id (PK)     │                            │
│ event_id(FK)├───────────────────────────┘
│ user_id(FK) ├───────────────────────────┐
│ content     │                            │
│ created_at  │                            │
│ updated_at  │                            │
└─────────────┘                            │
                                           │
┌─────────────┐                            │
│Notifications│                            │
├─────────────┤                            │
│ id (PK)     │                            │
│ user_id(FK) ├────────────────────────────┘
│ type        │
│ message     │
│ read        │
│ created_at  │
└─────────────┘
```

## Tables

### 1. users

Stores user account information and profiles.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(500),
    location POINT,  -- PostGIS geography type
    location_address VARCHAR(500),
    phone VARCHAR(20),
    date_of_birth DATE,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    is_admin BOOLEAN DEFAULT FALSE
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_location ON users USING GIST(location);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_email_verification_token ON users(email_verification_token);
```

### 2. events

Stores community events with geospatial location data.

```sql
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,  -- 'volunteer', 'social', 'educational', 'sports', 'other'
    location POINT NOT NULL,  -- PostGIS geography type
    location_address VARCHAR(500) NOT NULL,
    date_time TIMESTAMP NOT NULL,
    duration_minutes INTEGER DEFAULT 120,
    capacity INTEGER,
    current_rsvps INTEGER DEFAULT 0,
    age_min INTEGER,
    age_max INTEGER,
    banner_url VARCHAR(500),
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern VARCHAR(100),  -- JSON string for recurrence rules
    status VARCHAR(20) DEFAULT 'active',  -- 'active', 'cancelled', 'completed', 'full'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT
);

-- Indexes
CREATE INDEX idx_events_host_id ON events(host_id);
CREATE INDEX idx_events_location ON events USING GIST(location);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_date_time ON events(date_time);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_created_at ON events(created_at);
CREATE INDEX idx_events_category_date ON events(category, date_time);

-- Composite index for common queries
CREATE INDEX idx_events_location_date ON events USING GIST(location, date_time);
```

### 3. rsvps

Tracks user RSVPs to events.

```sql
CREATE TABLE rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'going',  -- 'going', 'maybe', 'not_going'
    guests_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP,
    UNIQUE(event_id, user_id)
);

-- Indexes
CREATE INDEX idx_rsvps_event_id ON rsvps(event_id);
CREATE INDEX idx_rsvps_user_id ON rsvps(user_id);
CREATE INDEX idx_rsvps_status ON rsvps(status);
CREATE INDEX idx_rsvps_created_at ON rsvps(created_at);

-- Trigger to update event.current_rsvps count
CREATE OR REPLACE FUNCTION update_event_rsvp_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE events 
        SET current_rsvps = current_rsvps + 1 
        WHERE id = NEW.event_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE events 
        SET current_rsvps = current_rsvps - 1 
        WHERE id = OLD.event_id;
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Handle status changes
        IF OLD.status = 'going' AND NEW.status != 'going' THEN
            UPDATE events 
            SET current_rsvps = current_rsvps - 1 
            WHERE id = NEW.event_id;
        ELSIF OLD.status != 'going' AND NEW.status = 'going' THEN
            UPDATE events 
            SET current_rsvps = current_rsvps + 1 
            WHERE id = NEW.event_id;
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_rsvp_count
    AFTER INSERT OR UPDATE OR DELETE ON rsvps
    FOR EACH ROW EXECUTE FUNCTION update_event_rsvp_count();
```

### 4. comments

Stores comments on events.

```sql
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,  -- For nested replies
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    is_edited BOOLEAN DEFAULT FALSE
);

-- Indexes
CREATE INDEX idx_comments_event_id ON comments(event_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);
```

### 5. friendships

Manages user friend connections.

```sql
CREATE TABLE friendships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    friend_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending',  -- 'pending', 'accepted', 'blocked'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (user_id != friend_id),
    UNIQUE(user_id, friend_id)
);

-- Indexes
CREATE INDEX idx_friendships_user_id ON friendships(user_id);
CREATE INDEX idx_friendships_friend_id ON friendships(friend_id);
CREATE INDEX idx_friendships_status ON friendships(status);

-- Index for bidirectional friend queries
CREATE INDEX idx_friendships_bidirectional ON friendships(user_id, friend_id, status);
```

### 6. notifications

Stores user notifications.

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,  -- 'event_rsvp', 'event_comment', 'friend_request', 'event_reminder', etc.
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    related_event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    related_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    action_url VARCHAR(500)  -- Deep link to relevant page
);

-- Indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_notifications_type ON notifications(type);
```

### 7. event_categories

Reference table for event categories with metadata.

```sql
CREATE TABLE event_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),  -- Icon identifier
    color VARCHAR(7),  -- Hex color for map pins
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed data
INSERT INTO event_categories (name, display_name, icon, color) VALUES
('volunteer', 'Volunteer', 'hand-holding-heart', '#FF6B6B'),
('social', 'Social Gathering', 'users', '#4ECDC4'),
('educational', 'Educational', 'book', '#45B7D1'),
('sports', 'Sports & Fitness', 'dumbbell', '#FFA07A'),
('arts', 'Arts & Culture', 'palette', '#9B59B6'),
('food', 'Food & Dining', 'utensils', '#F39C12'),
('outdoor', 'Outdoor Activities', 'tree', '#27AE60'),
('other', 'Other', 'ellipsis-h', '#95A5A6');
```

### 8. user_preferences

Stores user preferences and settings.

```sql
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    default_radius_km INTEGER DEFAULT 10,
    preferred_categories TEXT[],  -- Array of category names
    notification_email BOOLEAN DEFAULT TRUE,
    notification_push BOOLEAN DEFAULT TRUE,
    notification_friend_activity BOOLEAN DEFAULT TRUE,
    notification_event_reminder BOOLEAN DEFAULT TRUE,
    privacy_show_location BOOLEAN DEFAULT TRUE,
    privacy_show_email BOOLEAN DEFAULT FALSE,
    privacy_show_phone BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
```

### 9. event_reports

Stores reports/flagging of events for moderation.

```sql
CREATE TABLE event_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    reported_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending',  -- 'pending', 'reviewed', 'resolved', 'dismissed'
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, reported_by)
);

-- Indexes
CREATE INDEX idx_event_reports_event_id ON event_reports(event_id);
CREATE INDEX idx_event_reports_status ON event_reports(status);
```

## Geospatial Queries

### Find Events Within Radius

```sql
-- Find events within X km of a point
SELECT 
    e.*,
    ST_Distance(e.location, ST_MakePoint(:lng, :lat)::geography) / 1000 AS distance_km
FROM events e
WHERE 
    ST_DWithin(
        e.location,
        ST_MakePoint(:lng, :lat)::geography,
        :radius_meters
    )
    AND e.status = 'active'
    AND e.date_time > NOW()
ORDER BY distance_km ASC
LIMIT :limit
OFFSET :offset;
```

### Find Events by Category in Area

```sql
SELECT 
    e.*,
    ST_Distance(e.location, ST_MakePoint(:lng, :lat)::geography) / 1000 AS distance_km
FROM events e
WHERE 
    ST_DWithin(
        e.location,
        ST_MakePoint(:lng, :lat)::geography,
        :radius_meters
    )
    AND e.category = :category
    AND e.status = 'active'
    AND e.date_time > NOW()
ORDER BY e.date_time ASC;
```

### Find Nearby Users (for friend suggestions)

```sql
SELECT 
    u.*,
    ST_Distance(u.location, ST_MakePoint(:lng, :lat)::geography) / 1000 AS distance_km
FROM users u
WHERE 
    ST_DWithin(
        u.location,
        ST_MakePoint(:lng, :lat)::geography,
        :radius_meters
    )
    AND u.id != :current_user_id
    AND u.is_active = TRUE
ORDER BY distance_km ASC
LIMIT :limit;
```

## Common Query Patterns

### Get Event with Host and RSVP Count

```sql
SELECT 
    e.*,
    u.name AS host_name,
    u.avatar_url AS host_avatar,
    COUNT(r.id) AS rsvp_count,
    COUNT(CASE WHEN r.status = 'going' THEN 1 END) AS going_count
FROM events e
JOIN users u ON e.host_id = u.id
LEFT JOIN rsvps r ON e.id = r.event_id
WHERE e.id = :event_id
GROUP BY e.id, u.id;
```

### Get User's Upcoming Events

```sql
SELECT 
    e.*,
    r.status AS rsvp_status,
    r.created_at AS rsvp_date
FROM events e
JOIN rsvps r ON e.id = r.event_id
WHERE 
    r.user_id = :user_id
    AND r.status = 'going'
    AND e.date_time > NOW()
    AND e.status = 'active'
ORDER BY e.date_time ASC;
```

### Get User's Friends' Events

```sql
SELECT DISTINCT
    e.*,
    r.user_id AS friend_rsvp_user_id
FROM events e
JOIN rsvps r ON e.id = r.event_id
JOIN friendships f ON (
    (f.user_id = :user_id AND f.friend_id = r.user_id) OR
    (f.friend_id = :user_id AND f.user_id = r.user_id)
)
WHERE 
    f.status = 'accepted'
    AND e.date_time > NOW()
    AND e.status = 'active'
ORDER BY e.date_time ASC;
```

## Database Migrations

Migrations should be managed using a tool like:
- **Knex.js** (JavaScript)
- **TypeORM** (TypeScript)
- **Sequelize** (JavaScript)
- **node-pg-migrate** (PostgreSQL specific)

Example migration structure:
```
migrations/
├── 001_create_users_table.sql
├── 002_create_events_table.sql
├── 003_create_rsvps_table.sql
├── 004_add_postgis_extension.sql
├── 005_create_indexes.sql
└── ...
```

## Performance Considerations

### Indexing Strategy
- **Geospatial indexes**: GIST indexes on location columns
- **Composite indexes**: For common query patterns
- **Partial indexes**: For filtered queries (e.g., active events only)

### Query Optimization
- Use `EXPLAIN ANALYZE` to optimize slow queries
- Implement pagination for large result sets
- Use materialized views for complex aggregations
- Cache frequently accessed data in Redis

### Connection Pooling
- Use connection pooling (pg-pool) to manage database connections
- Configure appropriate pool size based on load
- Monitor connection usage

## Data Integrity

### Constraints
- Foreign key constraints ensure referential integrity
- Unique constraints prevent duplicate relationships
- Check constraints validate data ranges
- NOT NULL constraints ensure required fields

### Triggers
- `update_event_rsvp_count`: Automatically updates RSVP count
- `update_updated_at`: Updates timestamp on record changes

### Cascading Deletes
- Deleting a user cascades to their events, RSVPs, comments
- Deleting an event cascades to RSVPs and comments
- Prevents orphaned records

---

For architecture details, see [ARCHITECTURE.md](./ARCHITECTURE.md)
For technology stack, see [TECH_STACK.md](./TECH_STACK.md)
