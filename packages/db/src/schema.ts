import { pgTable, serial, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const eventStatusEnum = pgEnum("event_status", ["draft", "published", "cancelled"]);
export const bookingStatusEnum = pgEnum("booking_status", ["pending", "confirmed", "cancelled"]);

export const venues = pgTable("venues", {
  id:      serial("id").primaryKey(),
  name:    text("name").notNull(),
  address: text("address"),
});

export const events = pgTable("events", {
  id:        serial("id").primaryKey(),
  title:     text("title").notNull(),
  theme:     text("theme").notNull(),
  date:      integer("date").notNull(),
  day:       text("day").notNull(),
  time:      text("time").notNull(),
  seats:     integer("seats").notNull().default(0),
  total:     integer("total").notNull(),
  venueId:   integer("venue_id").references(() => venues.id),
  host:      text("host").notNull(),
  tags:      text("tags").array().notNull().default([]),
  status:    eventStatusEnum("status").notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const eventTemplates = pgTable("event_templates", {
  id:        serial("id").primaryKey(),
  title:     text("title").notNull(),
  theme:     text("theme").notNull().default(""),
  time:      text("time").notNull().default("19:00"),
  total:     integer("total").notNull().default(30),
  host:      text("host").notNull().default(""),
  tags:      text("tags").array().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bookings = pgTable("bookings", {
  id:        serial("id").primaryKey(),
  eventId:   integer("event_id").references(() => events.id).notNull(),
  name:      text("name").notNull(),
  teamName:  text("team_name").notNull(),
  people:    integer("people").notNull(),
  phone:     text("phone").notNull(),
  status:    bookingStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contacts = pgTable("contacts", {
  key:   text("key").primaryKey(),
  value: text("value").notNull(),
});

export const rules = pgTable("rules", {
  id:          serial("id").primaryKey(),
  number:      text("number").notNull(),
  title:       text("title").notNull(),
  description: text("description").notNull(),
  order:       integer("order").notNull().default(0),
});
