import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1710000000000 implements MigrationInterface {
  name = "InitialSchema1710000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable PostGIS
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS postgis`);

    // 1. users
    await queryRunner.query(`
      CREATE TABLE users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          bio TEXT,
          avatar_url VARCHAR(500),
          location geography(POINT, 4326),
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
      CREATE INDEX idx_users_email ON users(email);
      CREATE INDEX idx_users_location ON users USING GIST(location);
      CREATE INDEX idx_users_created_at ON users(created_at);
      CREATE INDEX idx_users_email_verification_token ON users(email_verification_token);
    `);

    // 2. events
    await queryRunner.query(`
      CREATE TABLE events (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          host_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          category VARCHAR(50) NOT NULL,
          location geography(POINT, 4326) NOT NULL,
          location_address VARCHAR(500) NOT NULL,
          date_time TIMESTAMP NOT NULL,
          duration_minutes INTEGER DEFAULT 120,
          capacity INTEGER,
          current_rsvps INTEGER DEFAULT 0,
          age_min INTEGER,
          age_max INTEGER,
          banner_url VARCHAR(500),
          is_recurring BOOLEAN DEFAULT FALSE,
          recurrence_pattern VARCHAR(100),
          status VARCHAR(20) DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          cancelled_at TIMESTAMP,
          cancellation_reason TEXT
      );
      CREATE INDEX idx_events_host_id ON events(host_id);
      CREATE INDEX idx_events_location ON events USING GIST(location);
      CREATE INDEX idx_events_category ON events(category);
      CREATE INDEX idx_events_date_time ON events(date_time);
      CREATE INDEX idx_events_status ON events(status);
      CREATE INDEX idx_events_created_at ON events(created_at);
      CREATE INDEX idx_events_category_date ON events(category, date_time);
      CREATE INDEX idx_events_location_date ON events USING GIST(location, date_time);
    `);

    // 3. rsvps
    await queryRunner.query(`
      CREATE TABLE rsvps (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          status VARCHAR(20) DEFAULT 'going',
          guests_count INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          cancelled_at TIMESTAMP,
          UNIQUE(event_id, user_id)
      );
      CREATE INDEX idx_rsvps_event_id ON rsvps(event_id);
      CREATE INDEX idx_rsvps_user_id ON rsvps(user_id);
      CREATE INDEX idx_rsvps_status ON rsvps(status);
      CREATE INDEX idx_rsvps_created_at ON rsvps(created_at);

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
    `);

    // 4. comments
    await queryRunner.query(`
      CREATE TABLE comments (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          content TEXT NOT NULL,
          parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          deleted_at TIMESTAMP,
          is_edited BOOLEAN DEFAULT FALSE
      );
      CREATE INDEX idx_comments_event_id ON comments(event_id);
      CREATE INDEX idx_comments_user_id ON comments(user_id);
      CREATE INDEX idx_comments_parent_id ON comments(parent_id);
      CREATE INDEX idx_comments_created_at ON comments(created_at);
    `);

    // 5. friendships
    await queryRunner.query(`
      CREATE TABLE friendships (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          friend_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          status VARCHAR(20) DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CHECK (user_id != friend_id),
          UNIQUE(user_id, friend_id)
      );
      CREATE INDEX idx_friendships_user_id ON friendships(user_id);
      CREATE INDEX idx_friendships_friend_id ON friendships(friend_id);
      CREATE INDEX idx_friendships_status ON friendships(status);
      CREATE INDEX idx_friendships_bidirectional ON friendships(user_id, friend_id, status);
    `);

    // 6. notifications
    await queryRunner.query(`
      CREATE TABLE notifications (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          type VARCHAR(50) NOT NULL,
          title VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          related_event_id UUID REFERENCES events(id) ON DELETE CASCADE,
          related_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          read BOOLEAN DEFAULT FALSE,
          read_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          action_url VARCHAR(500)
      );
      CREATE INDEX idx_notifications_user_id ON notifications(user_id);
      CREATE INDEX idx_notifications_read ON notifications(user_id, read);
      CREATE INDEX idx_notifications_created_at ON notifications(created_at);
      CREATE INDEX idx_notifications_type ON notifications(type);
    `);

    // 7. event_categories
    await queryRunner.query(`
      CREATE TABLE event_categories (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(50) UNIQUE NOT NULL,
          display_name VARCHAR(100) NOT NULL,
          icon VARCHAR(50),
          color VARCHAR(7),
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 8. user_preferences
    await queryRunner.query(`
      CREATE TABLE user_preferences (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
          default_radius_km INTEGER DEFAULT 10,
          preferred_categories TEXT[],
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
      CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
    `);

    // 9. event_reports
    await queryRunner.query(`
      CREATE TABLE event_reports (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
          reported_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          reason VARCHAR(100) NOT NULL,
          description TEXT,
          status VARCHAR(20) DEFAULT 'pending',
          reviewed_by UUID REFERENCES users(id),
          reviewed_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(event_id, reported_by)
      );
      CREATE INDEX idx_event_reports_event_id ON event_reports(event_id);
      CREATE INDEX idx_event_reports_status ON event_reports(status);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS event_reports CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS user_preferences CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS event_categories CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS notifications CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS friendships CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS comments CASCADE`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_update_rsvp_count ON rsvps CASCADE`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_event_rsvp_count CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS rsvps CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS events CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS users CASCADE`);
  }
}
