"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.COLLECTION_NAME = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
exports.COLLECTION_NAME = "WEATHER_PREDICT";
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
exports.default = mongoose_1.default.model(exports.COLLECTION_NAME, weatherPredictSchema);
//# sourceMappingURL=WeatherPridictModel.js.map