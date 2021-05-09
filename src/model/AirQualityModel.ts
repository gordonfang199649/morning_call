import { model, Document, Schema } from "mongoose";
const COLLECTION_NAME = "airQualities";

export interface AirQuality {
  siteId: number;
  county: string;
  siteName: string;
  monitorDate: string;
  itemName: string;
  itemEngName: string;
  concentration: number;
  suggestion: string;
  createDate: Date;
}

export interface AirQualityDoc extends Document, AirQuality { };

const AirQualitySchema: Schema = new Schema({
  siteId: {
    type: Schema.Types.Number,
  },
  county: {
    type: Schema.Types.String,
    trim: true,
    maxlength: 3,
  },
  siteName: {
    type: Schema.Types.String,
    required: true,
    trim: true,
    maxlength: 10,
  },
  monitorDate: {
    type: Schema.Types.String,
    required: true,
  },
  itemName: {
    type: Schema.Types.String,
    maxlength: 5,
  },
  itemEngName: {
    type: Schema.Types.String,
    maxlength: 5,
  },
  concentration: {
    type: Schema.Types.Number,
  },
  suggestion: {
    type: Schema.Types.String,
    maxlength: 255,
  },
  createDate: {
    type: Schema.Types.Date,
  },
});

export default model<AirQualityDoc>(COLLECTION_NAME, AirQualitySchema);
