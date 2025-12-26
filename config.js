export const config = {
  botName: "Liviaa Chantika",
  ownerLid: "6285182359268",
  prefix: ".",
  
  // Database path
  databasePath: "./database.json",
  sessionPath: "./session",
  
  // Bot settings
  maxFileSize: 100 * 1024 * 1024, // 100MB
  maxDownloadTime: 300000, // 5 minutes
  
  // AI settings
  aiProvider: "https://api.openai.com/v1",
  aiKey: "YOUR_API_KEY", // Ganti dengan API key
  
  // Anti-spam
  spamThreshold: 5,
  spamTimeframe: 10000, // 10 seconds
  
  // Auto read
  autoRead: true,
  
  // Status
  maintenance: false,
  
  // Colors
  colors: {
    primary: "#FF6B9D",
    secondary: "#9D6BFF",
    success: "#6BFF9D",
    error: "#FF9D6B",
    info: "#6B9DFF"
  }
};
