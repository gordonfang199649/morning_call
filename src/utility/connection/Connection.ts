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
    // 連線 Mongodb 叢集失敗，記錄下 log 後拋錯
    logger.error('disconnected with mongodb.', error);
    throw error;
  }
};

export const disconnection = async () => {
  await disconnect();
  logger.info('disconnected with mongodb.');
}