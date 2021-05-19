import * as dotenv from "dotenv";
dotenv.config();
import { connect, disconnect } from "mongoose";

export const connection = async () => {
  try {
    await connect(process.env.DB_SERVER, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('successfully connected with mongodb');
  } catch (error) {
    console.error(error);
    await disconnect();
    console.log('disconnected with mongodb.');
  }
};

export const disconnection = async () => {
  await disconnect();
  console.log('disconnected with mongodb.');
}