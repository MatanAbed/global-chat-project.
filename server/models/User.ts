import { Schema, model } from 'mongoose';

// 1. הגדרת ה-Interface של המשתמש עבור TypeScript
export interface IUser 
{
  username: string;
  email: string;
  passwordHash: string;
  profileImage?: string; // סימן שאלה אומר שהשדה אופציונלי (לא חובה)
  createdAt: Date;
}

// 2. הגדרת סכמת ה-Mongoose שתייצר את ה-Collection ב-MongoDB
const userSchema = new Schema<IUser>
({
  username: 
  { 
    type: String, 
    required: [true, 'Username is required'], 
    trim: true 
  },
  email: 
  { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, // מונע הרשמה של אותו אימייל פעמיים
    lowercase: true, // הופך אוטומטית את האימייל לאותיות קטנות
    trim: true 
  },
  passwordHash: 
  { 
    type: String, 
    required: [true, 'Password is required'] 
  },
  profileImage: 
  { 
    type: String, 
    default: '' // אם המשתמש לא העלה תמונה, השדה יהיה ריק כברירת מחדל
  },
  createdAt: 
  { 
    type: Date, 
    default: Date.now // מכניס אוטומטית את תאריך ושעת ההרשמה
  }
}, {
  // מגדיר במפורש את שם ה-Collection בתוך מסד הנתונים
  collection: 'users' 
});

// 3. יצירת המודל וייצוא שלו החוצה
const User = model<IUser>('User', userSchema);
export default User;