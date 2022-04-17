import dayjs from "dayjs";
import { model, Document, Schema } from "mongoose";
import Entity from "./Entity";
const COLLECTION_NAME = "air_Qualities";

export interface AirQuality extends Entity {
  type: string;
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
  type: {
    type: Schema.Types.String,
    default: 'AirQuality'
  },
  siteId: {
    type: Schema.Types.Number,
    required: true,
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
    required: true,
    maxlength: 5,
  },
  itemEngName: {
    type: Schema.Types.String,
    maxlength: 5,
  },
  concentration: {
    type: Schema.Types.Number,
    required: true,
  },
  suggestion: {
    type: Schema.Types.String,
    maxlength: 255,
  },
  createDate: {
    type: Schema.Types.Date,
    default: dayjs().toDate()
  },
});

export default model<AirQualityDoc>(COLLECTION_NAME, AirQualitySchema);
