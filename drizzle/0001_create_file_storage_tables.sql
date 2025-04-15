CREATE TABLE IF NOT EXISTS "folders" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "parent_id" INTEGER REFERENCES "folders"("id") ON DELETE CASCADE,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "user_id" TEXT NOT NULL,
  UNIQUE("name", "parent_id", "user_id")
);

CREATE TABLE IF NOT EXISTS "files" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "folder_id" INTEGER REFERENCES "folders"("id") ON DELETE CASCADE,
  "file_path" TEXT NOT NULL,
  "size" BIGINT NOT NULL,
  "mime_type" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "user_id" TEXT NOT NULL,
  UNIQUE("name", "folder_id", "user_id")
);