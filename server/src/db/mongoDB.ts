import mongoose from 'mongoose';
require('dotenv').config()

const MONGO_DB_USERNAME = process.env.MONGO_DB_USERNAME as string;
const MONGO_DB_PASSWORD = process.env.MONGO_DB_PASSWORD as string;


const uri = `mongodb+srv://${MONGO_DB_USERNAME}:${MONGO_DB_PASSWORD}@notify.5b9oady.mongodb.net/notify?retryWrites=true&w=majority`;


export default async function connectToDb() {
  try {
    await mongoose.connect(uri);
    console.log("connected to mongo DB");
  } catch (err) {
    let errorMessage = (err instanceof Error) ? err.stack : "Error connecting to mongo DB";
    console.log(errorMessage);
  }
}



