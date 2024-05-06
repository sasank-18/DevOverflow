import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) return console.log("Missing MongoDb URL");

  if (isConnected) return console.log("MongoDb is already connected!");

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "DevFlow",
    });

    isConnected = true;
    console.log("Mongodb is connected");
  } catch (e) {
    console.log(e);
  }
};
