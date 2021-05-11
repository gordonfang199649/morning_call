import dayjs from "dayjs";
import { model, Document, Schema } from "mongoose";
import Entity from "./Entity";
const COLLECTION_NAME = "weather_Predicts";

export interface WeatherPredict extends Entity {
  type: string;
  locationsName: string;
  startTime: string;
  endTime: string;
  elementValue: string;
  createDate: Date;
}

export interface WeatherPredictDoc extends Document, WeatherPredict { };

const WeatherPredictSchema: Schema = new Schema({
  type: {
    type: Schema.Types.String,
    default: 'WeatherPredict'
  },
  locationsName: {
    type: Schema.Types.String,
    required: true,
  },
  startTime: {
    type: Schema.Types.String,
    required: true,
  },
  endTime: {
    type: Schema.Types.String,
    required: true,
  },
  elementValue: {
    type: Schema.Types.String,
    required: true,
  },
  createDate: {
    type: Schema.Types.Date,
    default: dayjs().toDate()
  },
});

export default model<WeatherPredictDoc>(COLLECTION_NAME, WeatherPredictSchema);
