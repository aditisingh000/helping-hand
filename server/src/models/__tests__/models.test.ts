import { describe, it, expect } from "@jest/globals";
import "reflect-metadata";
import { validate } from "class-validator";
import { User } from "../User.js";
import { Event } from "../Event.js";
import { RSVP } from "../RSVP.js";

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
});
