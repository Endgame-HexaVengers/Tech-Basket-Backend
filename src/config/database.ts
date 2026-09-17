import mongoose from "mongoose";

let connectionPromise: Promise<typeof mongoose> | null = null;

export const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  const mongodbUri = process.env.MONGODB_URL;
  if (!mongodbUri) {
    throw new Error("MONGODB_URL is missing from the environment");
  }

  connectionPromise ??= mongoose
    .connect(mongodbUri, { serverSelectionTimeoutMS: 5000 })
    .catch((error) => {
      connectionPromise = null;
      throw error;
    });

  await connectionPromise;
  return mongoose;
};