import multer from 'multer';
import { Request } from 'express';

// 1. הגדרת אחסון זמני בזיכרון השרת (Memory Storage)
// אנחנו שומרים את הקובץ בזיכרון (Buffer) כדי שנוכל להעלות אותו ישירות ל-AWS S3
const storage = multer.memoryStorage();

// 2. פונקציית סינון (File Filter) כדי לוודא שמעלים רק תמונות
const fileFilter = (req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
  // בדיקת סוג הקובץ (Mime Type) - חייב להתחיל במילה image
  if (file.mimetype.startsWith('image/')) 
  {
    callback(null, true); // מאשר את הקובץ
  } 
  else 
  {
    callback(new Error('Only image files are allowed!') as any, false); // דוחה את הקובץ ומחזיר שגיאה
  }
};

// 3. הגדרת הגבלת גודל הקובץ (למשל עד 5MB כדי לשמור על ביצועים)
const limits = 
{
  fileSize: 5 * 1024 * 1024 // 5 מגה-בייט
};

// 4. יצירת מופע ה-multer הסופי עם כל ההגדרות שלנו
const upload = multer
({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits
});

export default upload;