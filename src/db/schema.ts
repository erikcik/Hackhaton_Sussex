import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Define valid gender values
export const VALID_GENDERS = ['boy', 'girl', 'other'] as const;
export type Gender = typeof VALID_GENDERS[number];

export const userPreferences = pgTable('user_preferences', {
  id: uuid('id').defaultRandom().primaryKey(),
  cookieId: text('cookie_id').notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  gender: text('gender').notNull().$type<Gender>(),
  mainLanguage: text('main_language').notNull(),
  preferredLanguage: text('preferred_language').notNull(),
  age: integer('age').notNull(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`)
});

// Export all tables to be used with the query builder
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = typeof userPreferences.$inferInsert; 