"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
const mongoose_1 = require("mongoose");
const COLLECTION_NAME = "weather_Predicts";
;
const WeatherPredictSchema = new mongoose_1.Schema({
    type: {
        type: mongoose_1.Schema.Types.String,
        default: 'WeatherPredict'
    },
    locationsName: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    startTime: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    endTime: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    elementValue: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    createDate: {
        type: mongoose_1.Schema.Types.Date,
        default: dayjs_1.default().toDate()
    },
});
exports.default = mongoose_1.model(COLLECTION_NAME, WeatherPredictSchema);
//# sourceMappingURL=WeatherPridictModel.js.map