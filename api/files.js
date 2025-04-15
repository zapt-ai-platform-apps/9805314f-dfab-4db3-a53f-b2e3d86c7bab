import { files, folders } from '../drizzle/schema.js';
import { authenticateUser } from "./_apiUtils.js";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq, and } from 'drizzle-orm';
import Sentry from "./_sentry.js";
import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

// Disable body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  console.log("Files API called:", req.method);
  
  try {
    const user = await authenticateUser(req);
    
    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);

    if (req.method === 'GET') {
      const folderId = req.query.folderId ? parseInt(req.query.folderId) : null;
      console.log("Getting files for folderId:", folderId);
      
      const result = await db.select()
        .from(files)
        .where(and(
          eq(files.userId, user.id),
          folderId ? eq(files.folderId, folderId) : isNull(files.folderId)
        ));

      console.log(`Found ${result.length} files`);
      res.status(200).json(result);
    } else if (req.method === 'POST') {
      // File upload logic
      console.log("Handling file upload");
      const form = new IncomingForm({ 
        multiples: true,
        keepExtensions: true,
        uploadDir: '/tmp'  // Temporary directory
      });
      
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Error parsing form:', err);
          Sentry.captureException(err);
          return res.status(500).json({ error: 'Failed to process upload' });
        }
        
        try {
          const uploadedFile = files.file[0];
          const folderId = fields.folderId ? parseInt(fields.folderId[0]) : null;
          console.log("Processing file:", uploadedFile.originalFilename, "for folder:", folderId);
          
          // Check if folder exists and belongs to user
          if (folderId) {
            const folderCheck = await db.select()
              .from(folders)
              .where(and(
                eq(folders.id, folderId),
                eq(folders.userId, user.id)
              ));
            
            if (folderCheck.length === 0) {
              console.error("Folder not found or access denied");
              return res.status(403).json({ error: 'Folder not found or access denied' });
            }
          }
          
          // Create a unique filename
          const uniqueId = randomUUID();
          const fileName = `${uniqueId}-${uploadedFile.originalFilename}`;
          
          // Move file to permanent storage
          // Note: In a production system, you'd use a service like S3 instead
          const storagePath = path.join(process.cwd(), 'uploads');
          await fs.mkdir(storagePath, { recursive: true });
          
          const newPath = path.join(storagePath, fileName);
          await fs.rename(uploadedFile.filepath, newPath);
          console.log("File moved to:", newPath);
          
          // Save file metadata to database
          const result = await db.insert(files)
            .values({
              name: uploadedFile.originalFilename,
              folderId,
              filePath: `/uploads/${fileName}`,
              size: uploadedFile.size,
              mimeType: uploadedFile.mimetype,
              userId: user.id
            })
            .returning();
          
          console.log("File metadata saved to database");
          res.status(201).json(result[0]);
        } catch (error) {
          console.error("Error processing upload:", error);
          Sentry.captureException(error);
          res.status(500).json({ error: 'Failed to process upload' });
        }
      });
    } else if (req.method === 'DELETE') {
      const { id } = JSON.parse(req.body);
      console.log("Deleting file with ID:", id);
      
      // Get file info before deleting
      const fileInfo = await db.select()
        .from(files)
        .where(and(
          eq(files.id, id),
          eq(files.userId, user.id)
        ));
      
      if (fileInfo.length === 0) {
        console.error("File not found");
        return res.status(404).json({ error: 'File not found' });
      }
      
      // Delete file from storage
      try {
        const filePath = path.join(process.cwd(), fileInfo[0].filePath);
        await fs.unlink(filePath);
        console.log("File deleted from storage:", filePath);
      } catch (e) {
        console.error('Error deleting file from storage:', e);
        Sentry.captureException(e);
        // Continue with DB deletion even if file deletion fails
      }
      
      // Delete from database
      await db.delete(files)
        .where(and(
          eq(files.id, id),
          eq(files.userId, user.id)
        ));
      
      console.log("File record deleted from database");
      res.status(200).json({ success: true });
    } else {
      console.log("Method not allowed:", req.method);
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in files API:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}