const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/cybercrime_platform";
  try {
    const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log(`[Database] MongoDB connected: ${conn.connection.host} (Persistent DB)`);
  } catch (err) {
    console.log(`[Database] Local/Cloud MongoDB unavailable (${err.message}). Trying MongoMemoryServer...`);
    try {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      const mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`[Database] MongoDB connected: ${conn.connection.host} (In-Memory Server)`);
    } catch (memErr) {
      console.error(`[Database] Critical DB connection error: ${memErr.message}`);
      // Do not hard exit in production to allow health checks
    }
  }
};

module.exports = connectDB;
