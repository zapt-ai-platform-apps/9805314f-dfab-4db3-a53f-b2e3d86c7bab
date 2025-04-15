import { pgTable, serial, text, timestamp, integer, bigint } from 'drizzle-orm/pg-core';

export const folders = pgTable('folders', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  parentId: integer('parent_id').references(() => folders.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
  userId: text('user_id').notNull(),
});

export const files = pgTable('files', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  folderId: integer('folder_id').references(() => folders.id, { onDelete: 'cascade' }),
  filePath: text('file_path').notNull(),
  size: bigint('size', { mode: 'number' }).notNull(),
  mimeType: text('mime_type').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  userId: text('user_id').notNull(),
});