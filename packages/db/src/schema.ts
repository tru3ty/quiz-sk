import { pgTable, serial, text, integer, timestamp, pgEnum, boolean } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id:            text("id").primaryKey(),
  name:          text("name").notNull(),
  email:         text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image:         text("image"),
  createdAt:     timestamp("created_at").notNull().defaultNow(),
  updatedAt:     timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id:        text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token:     text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId:    text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id:                    text("id").primaryKey(),
  accountId:             text("account_id").notNull(),
  providerId:            text("provider_id").notNull(),
  userId:                text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken:           text("access_token"),
  refreshToken:          text("refresh_token"),
  idToken:               text("id_token"),
  accessTokenExpiresAt:  timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope:                 text("scope"),
  password:              text("password"),
  createdAt:             timestamp("created_at").notNull().defaultNow(),
  updatedAt:             timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id:         text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value:      text("value").notNull(),
  expiresAt:  timestamp("expires_at").notNull(),
  createdAt:  timestamp("created_at").defaultNow(),
  updatedAt:  timestamp("updated_at").defaultNow(),
});

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
