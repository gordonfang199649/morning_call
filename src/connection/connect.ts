import { connect, disconnect } from "mongoose";

export const connection = async () => {
  try {
    await connect("mongodb://localhost:27017/dailyInform", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('successfully connected with mongodb');
  } catch (error) {
    console.log(error);
    await disconnect();
    console.log('disconnected with mongodb.')
  }
};

export const disconnection = async () => {
  await disconnect();
  console.log('disconnected with mongodb.')
}