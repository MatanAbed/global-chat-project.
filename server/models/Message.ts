import { Schema, model, Types } from 'mongoose';

// 1. הגדרת ה-Interface של ההודעה עבור TypeScript
export interface IMessage 
{
  sender: Types.ObjectId; // מזהה ייחודי של המשתמש ששלח את ההודעה
  content: string;        // תוכן ההודעה הטקסטואלית
  timestamp: Date;        // זמן שליחת ההודעה
}

// 2. הגדרת סכמת ה-Mongoose עבור קולקשן ההודעות
const messageSchema = new Schema<IMessage>
({
  sender: 
  {
    type: Schema.Types.ObjectId,
    ref: 'User', // מקשר ישירות למודל ה-User שכתבנו קודם
    required: [true, 'Sender ID is required']
  },
  content: 
  {
    type: String,
    required: [true, 'Message content cannot be empty'],
    trim: true
  },
  timestamp: 
  {
    type: Date,
    default: Date.now // שומר אוטומטית את הזמן המדויק של שליחת ההודעה
  }
}, {
  // קביעת שם הקולקשן במפורש בבסיס הנתונים
  collection: 'messages'
});

// 3. יצירת המודל וייצוא שלו החוצה
const Message = model<IMessage>('Message', messageSchema);
export default Message;