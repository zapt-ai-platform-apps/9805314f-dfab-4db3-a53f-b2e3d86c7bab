import { folders } from '../drizzle/schema.js';
import { authenticateUser } from "./_apiUtils.js";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq, and, isNull } from 'drizzle-orm';
import Sentry from "./_sentry.js";

/**
 * Safely parses JSON data if it's a string, returns as-is if already an object
 */
function safeParseJSON(data) {
  if (typeof data === 'object' && data !== null) return data;
  
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('JSON parsing error:', error, 'Data:', data);
    Sentry.captureException(error);
    throw new Error(`Invalid JSON: ${error.message}`);
  }
}

export default async function handler(req, res) {
  console.log("Folders API called:", req.method);
  
  try {
    const user = await authenticateUser(req);
    
    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);

    if (req.method === 'GET') {
      const parentId = req.query.parentId ? parseInt(req.query.parentId) : null;
      console.log("Getting folders with parentId:", parentId);
      
      const folderQuery = parentId 
        ? and(eq(folders.userId, user.id), eq(folders.parentId, parentId))
        : and(eq(folders.userId, user.id), isNull(folders.parentId));
      
      const result = await db.select()
        .from(folders)
        .where(folderQuery);

      console.log(`Found ${result.length} folders`);
      res.status(200).json(result);
    } else if (req.method === 'POST') {
      // Use the safe parsing function instead of direct JSON.parse
      const parsedBody = safeParseJSON(req.body);
      const { name, parentId } = parsedBody;
      
      console.log("Creating folder:", name, "with parentId:", parentId);

      const result = await db.insert(folders)
        .values({
          name,
          parentId: parentId || null,
          userId: user.id
        })
        .returning();

      console.log("Created folder:", result[0]);
      res.status(201).json(result[0]);
    } else if (req.method === 'DELETE') {
      // Use the safe parsing function instead of direct JSON.parse
      const parsedBody = safeParseJSON(req.body);
      const { id } = parsedBody;
      
      console.log("Deleting folder with ID:", id);

      await db.delete(folders)
        .where(and(
          eq(folders.id, id),
          eq(folders.userId, user.id)
        ));

      console.log("Folder deleted successfully");
      res.status(200).json({ success: true });
    } else {
      console.log("Method not allowed:", req.method);
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in folders API:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}