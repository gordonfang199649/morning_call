import { model, Document, Schema } from "mongoose";
const COLLECTION_NAME = "weatherPredict";

export interface WeatherPredict {
  locationsName: string;
  locationName: string;
  description: string;
  startTime: Date;
  endTime: Date;
  elementValue: string;
  createDate: Date;
}

export interface WeatherPredictDoc extends Document, WeatherPredict { };

const WeatherPredictSchema = new Schema({
  locationsName: {
    types: Schema.Types.String,
    required: true,
    trim: true,
    maxlength: 3,
  },
  locationName: {
    types: Schema.Types.String,
    required: true,
    trim: true,
    maxlength: 10,
  },
  description: {
    types: Schema.Types.String,
    trim: true,
    maxlength: 255,
  },
  startTime: {
    types: Schema.Types.Date,
    required: true,
  },
  endTime: {
    types: Schema.Types.Date,
    required: true,
  },
  elementValue: {
    types: Schema.Types.String,
    trim: true,
    maxlength: 255,
  },
  createDate: {
    types: Schema.Types.Date,
  },
});

export default model(COLLECTION_NAME, WeatherPredictSchema);
