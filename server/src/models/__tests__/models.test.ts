import { describe, it, expect } from "@jest/globals";
import "reflect-metadata";
import { validate } from "class-validator";
import { User } from "../User.js";
import { Event } from "../Event.js";
import { RSVP } from "../RSVP.js";
import { Comment } from "../Comment.js";
import { Notification } from "../Notification.js";
import { EventCategory } from "../EventCategory.js";
import { EventReport } from "../EventReport.js";
import { Friendship } from "../Friendship.js";
import { UserPreference } from "../UserPreference.js";

describe("Database Models Validation", () => {
  describe("User Model", () => {
    it("should pass validation with valid data", async () => {
      const user = new User();
      user.id = "123e4567-e89b-12d3-a456-426614174000";
      user.email = "test@example.com";
      user.passwordHash = "hash";
      user.name = "Test User";
      user.createdAt = new Date();
      user.updatedAt = new Date();
      user.isActive = true;
      user.isAdmin = false;
      user.emailVerified = false;

      const errors = await validate(user);
      expect(errors.length).toBe(0);
    });

    it("should fail validation with invalid email", async () => {
      const user = new User();
      user.id = "123e4567-e89b-12d3-a456-426614174000";
      user.email = "invalid-email";
      user.passwordHash = "hash";
      user.name = "Test User";
      user.createdAt = new Date();
      user.updatedAt = new Date();
      user.isActive = true;
      user.isAdmin = false;
      user.emailVerified = false;

      const errors = await validate(user);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]?.property).toBe("email");
    });
  });

  describe("Event Model", () => {
    it("should pass validation with valid data", async () => {
      const event = new Event();
      event.id = "123e4567-e89b-12d3-a456-426614174000";
      event.hostId = "123e4567-e89b-12d3-a456-426614174001";
      event.title = "Community Cleanup";
      event.description = "Let's clean the park!";
      event.category = "volunteer";
      event.locationAddress = "123 Park Ave";
      event.dateTime = new Date();
      event.durationMinutes = 120;
      event.currentRsvps = 0;
      event.isRecurring = false;
      event.status = "active";
      event.createdAt = new Date();
      event.updatedAt = new Date();

      const errors = await validate(event);
      expect(errors.length).toBe(0);
    });

    it("should fail validation if durationMinutes is negative", async () => {
      const event = new Event();
      event.id = "123e4567-e89b-12d3-a456-426614174000";
      event.hostId = "123e4567-e89b-12d3-a456-426614174001";
      event.title = "Community Cleanup";
      event.description = "Let's clean the park!";
      event.category = "volunteer";
      event.locationAddress = "123 Park Ave";
      event.dateTime = new Date();
      event.durationMinutes = -10; // Invalid, must be min(1)
      event.currentRsvps = 0;
      event.isRecurring = false;
      event.status = "active";
      event.createdAt = new Date();
      event.updatedAt = new Date();

      const errors = await validate(event);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]?.property).toBe("durationMinutes");
    });
  });

  describe("RSVP Model", () => {
    it("should fail if guests count is negative", async () => {
      const rsvp = new RSVP();
      rsvp.id = "123e4567-e89b-12d3-a456-426614174000";
      rsvp.eventId = "123e4567-e89b-12d3-a456-426614174001";
      rsvp.userId = "123e4567-e89b-12d3-a456-426614174002";
      rsvp.status = "going";
      rsvp.guestsCount = -1; // Invalid
      rsvp.createdAt = new Date();
      rsvp.updatedAt = new Date();

      const errors = await validate(rsvp);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]?.property).toBe("guestsCount");
    });
  });

  describe("Comment Model", () => {
    it("should pass validation with valid data", async () => {
      const comment = new Comment();
      comment.id = "123e4567-e89b-12d3-a456-426614174000";
      comment.eventId = "123e4567-e89b-12d3-a456-426614174001";
      comment.userId = "123e4567-e89b-12d3-a456-426614174002";
      comment.content = "Great event!";
      comment.createdAt = new Date();
      comment.updatedAt = new Date();
      comment.isEdited = false;

      const errors = await validate(comment);
      expect(errors.length).toBe(0);
    });
  });

  describe("Notification Model", () => {
    it("should fail validation with title exceeding max length", async () => {
      const notification = new Notification();
      notification.id = "123e4567-e89b-12d3-a456-426614174000";
      notification.userId = "123e4567-e89b-12d3-a456-426614174001";
      notification.type = "reminder";
      notification.title = "a".repeat(256); // max 255
      notification.message = "Message";
      notification.read = false;
      notification.createdAt = new Date();

      const errors = await validate(notification);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]?.property).toBe("title");
    });
  });

  describe("EventCategory Model", () => {
    it("should pass validation with valid data", async () => {
      const category = new EventCategory();
      category.id = "123e4567-e89b-12d3-a456-426614174000";
      category.name = "Test Category";
      category.displayName = "Test";
      category.createdAt = new Date();

      const errors = await validate(category);
      expect(errors.length).toBe(0);
    });
  });

  describe("EventReport Model", () => {
    it("should fail validation with reason exceeding max length", async () => {
      const report = new EventReport();
      report.id = "123e4567-e89b-12d3-a456-426614174000";
      report.eventId = "123e4567-e89b-12d3-a456-426614174001";
      report.reportedBy = "123e4567-e89b-12d3-a456-426614174002";
      report.reason = "a".repeat(101); // max 100
      report.status = "pending";
      report.createdAt = new Date();

      const errors = await validate(report);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]?.property).toBe("reason");
    });
  });

  describe("Friendship Model", () => {
    it("should pass validation with valid data", async () => {
      const friendship = new Friendship();
      friendship.id = "123e4567-e89b-12d3-a456-426614174000";
      friendship.userId = "123e4567-e89b-12d3-a456-426614174001";
      friendship.friendId = "123e4567-e89b-12d3-a456-426614174002";
      friendship.status = "active";
      friendship.createdAt = new Date();
      friendship.updatedAt = new Date();

      const errors = await validate(friendship);
      expect(errors.length).toBe(0);
    });
  });

  describe("UserPreference Model", () => {
    it("should pass validation with valid data", async () => {
      const pref = new UserPreference();
      pref.id = "123e4567-e89b-12d3-a456-426614174000";
      pref.userId = "123e4567-e89b-12d3-a456-426614174001";
      pref.defaultRadiusKm = 10;
      pref.notificationEmail = true;
      pref.notificationPush = true;
      pref.notificationFriendActivity = true;
      pref.notificationEventReminder = true;
      pref.privacyShowLocation = true;
      pref.privacyShowEmail = false;
      pref.privacyShowPhone = false;
      pref.createdAt = new Date();
      pref.updatedAt = new Date();

      const errors = await validate(pref);
      expect(errors.length).toBe(0);
    });
  });
});
