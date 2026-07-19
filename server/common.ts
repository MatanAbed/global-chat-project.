// אינטרפייס משותף המגדיר את מבנה הודעת הצ'אט שמועברת בין השרת ללקוח
export interface Message {
  _id?: string; // מזהה ייחודי של ההודעה מהדאטאבייס (אופציונלי, כי בזמן שליחה הוא עוד לא קיים)
  content: string; // תוכן ההודעה
  timestamp: Date | string; // זמן שליחת ההודעה
  sender: {
    _id: string; // ה-ID של המשתמש ששלח
    username: string; // שם המשתמש ששלח
    profileImage: string; // קישור לתמונת הפרופיל שלו מ-S3
  };
}