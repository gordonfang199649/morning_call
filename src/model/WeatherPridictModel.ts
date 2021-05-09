import mongoose from "mongoose";
const { Schema } = mongoose;
export const COLLECTION_NAME = "WEATHER_PREDICT";

const weatherPredictSchema = new Schema({
  _id: {
    types: Schema.Types.ObjectId,
  },
  datasetDescription: {
    types: Schema.Types.String,
    maxlength: 255,
    trim: true,
  },
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
  CreateDate: {
    types: Schema.Types.Date,
    default: Date.now(),
  },
});

export default mongoose.model(COLLECTION_NAME, weatherPredictSchema);
