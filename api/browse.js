import { files, folders } from '../drizzle/schema.js';
import { authenticateUser } from "./_apiUtils.js";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq, and, isNull } from 'drizzle-orm';
import Sentry from "./_sentry.js";

export default async function handler(req, res) {
  console.log("Browse API called:", req.method);
  
  try {
    const user = await authenticateUser(req);
    
    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);

    if (req.method === 'GET') {
      const folderId = req.query.folderId ? parseInt(req.query.folderId) : null;
      console.log("Browsing contents of folder:", folderId);
      
      // Get subfolders
      const folderQuery = folderId 
        ? and(eq(folders.userId, user.id), eq(folders.parentId, folderId))
        : and(eq(folders.userId, user.id), isNull(folders.parentId));
      
      const subfolders = await db.select()
        .from(folders)
        .where(folderQuery);
      
      // Get files
      const filesQuery = folderId
        ? and(eq(files.userId, user.id), eq(files.folderId, folderId))
        : and(eq(files.userId, user.id), isNull(files.folderId));
      
      const folderFiles = await db.select()
        .from(files)
        .where(filesQuery);
      
      // Get current folder details if inside a folder
      let currentFolder = null;
      if (folderId) {
        const folderResult = await db.select()
          .from(folders)
          .where(and(
            eq(folders.id, folderId),
            eq(folders.userId, user.id)
          ));
        
        if (folderResult.length > 0) {
          currentFolder = folderResult[0];
        }
      }
      
      // Get breadcrumb if inside a folder
      let breadcrumb = [];
      if (currentFolder) {
        breadcrumb = await getBreadcrumb(db, currentFolder, user.id);
      }
      
      console.log(`Found ${subfolders.length} folders and ${folderFiles.length} files`);
      res.status(200).json({
        currentFolder,
        breadcrumb,
        folders: subfolders,
        files: folderFiles
      });
    } else {
      console.log("Method not allowed:", req.method);
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in browse API:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Helper function to get breadcrumb path
async function getBreadcrumb(db, folder, userId) {
  console.log("Building breadcrumb for folder:", folder.id);
  const breadcrumb = [folder];
  let currentFolder = folder;
  
  while (currentFolder.parentId) {
    const parentResult = await db.select()
      .from(folders)
      .where(and(
        eq(folders.id, currentFolder.parentId),
        eq(folders.userId, userId)
      ));
    
    if (parentResult.length === 0) break;
    
    currentFolder = parentResult[0];
    breadcrumb.unshift(currentFolder);
  }
  
  console.log("Breadcrumb built with", breadcrumb.length, "items");
  return breadcrumb;
}