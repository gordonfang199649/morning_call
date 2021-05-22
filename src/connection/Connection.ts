import * as dotenv from "dotenv";
dotenv.config();
import { connect, disconnect } from "mongoose";
import { log } from "../log/log";

const logger = log('Connection');
export const connection = async () => {
  try {
    await connect(process.env.DB_SERVER, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('successfully connected with mongodb.');
  } catch (error) {
    await disconnect();
    logger.error('disconnected with mongodb.', error);
  }
};

export const disconnection = async () => {
  await disconnect();
  logger.info('disconnected with mongodb.');
}