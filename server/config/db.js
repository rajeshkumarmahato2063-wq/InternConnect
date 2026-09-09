import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // In dev environment when Atlas credentials aren't configured yet, fallback gracefully
    console.log('⚠️ Running backend in offline/mock memory mode until MongoDB Atlas URI is connected.');
  }
};

// Graceful Process Termination Listener
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔌 MongoDB connection closed due to application termination.');
  process.exit(0);
});
