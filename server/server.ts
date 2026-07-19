import express from 'express';
import { createServer } from 'http';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

// ייבוא פונקציית החיבור לדאטאבייס ושרת הסוקטים
import connectDB from './config/db';
import { setupWebSocket } from './sockets/chat.socket';

// ייבוא הראוטרים (Routes)
import authRoutes from './routes/auth';
import usersRoutes from './routes/users';

// טעינת משתני הסביבה מקובץ ה-.env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 1. חיבור מסד הנתונים MongoDB Atlas
connectDB();

// 2. הגדרת מידלוורס (Middleware) כלליים של השרת
app.use(express.json()); // מאפשר לשרת לקרוא גוף בקשה בפורמט JSON (req.body)
app.use(cookieParser()); // מאפשר לשרת לקרוא ולחלץ קוקיז מהבקשות (req.cookies)

// 3. חיבור נתיבי ה-API של האפליקציה
app.use('/auth', authRoutes);   // מנתב את כל הבקשות שמתחילות ב-/auth לראוטר האימות
app.use('/users', usersRoutes); // מנתב את כל הבקשות שמתחילות ב-/users לראוטר המשתמשים

// 4. יצירת שרת HTTP גולמי מתוך אפליקציית ה-Express
// המרצה דורש זאת מכיוון ששרת ה-WebSocket חייב להתלבש על שרת HTTP נקי
const httpServer = createServer(app);

// 5. איתחול והלבשת שרת ה-WebSocket על שרת ה-HTTP שלנו
setupWebSocket(httpServer);

// 6. הרמת השרת המשולב להאזנה בפורט המבוקש
httpServer.listen(PORT, () => 
{
  console.log(`Server is running smoothly on http://localhost:${PORT}`);
});