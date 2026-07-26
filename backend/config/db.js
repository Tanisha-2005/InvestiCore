const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/cybercrime_platform";
  try {
    const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
    console.log(`[Database] MongoDB connected: ${conn.connection.host} (Persistent DB)`);
  } catch (err) {
    console.log(`[Database] Local MongoDB unavailable (${err.message}). Using MongoMemoryServer...`);
    try {
      const mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`[Database] MongoDB connected: ${conn.connection.host} (In-Memory Server)`);
    } catch (memErr) {
      console.error(`[Database] Critical DB connection error: ${memErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
