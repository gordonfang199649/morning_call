"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
const mongoose_1 = require("mongoose");
const COLLECTION_NAME = "air_Qualities";
;
const AirQualitySchema = new mongoose_1.Schema({
    type: {
        type: mongoose_1.Schema.Types.String,
        default: 'AirQuality'
    },
    siteId: {
        type: mongoose_1.Schema.Types.Number,
        required: true,
    },
    county: {
        type: mongoose_1.Schema.Types.String,
        trim: true,
        maxlength: 3,
    },
    siteName: {
        type: mongoose_1.Schema.Types.String,
        required: true,
        trim: true,
        maxlength: 10,
    },
    monitorDate: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    itemName: {
        type: mongoose_1.Schema.Types.String,
        required: true,
        maxlength: 5,
    },
    itemEngName: {
        type: mongoose_1.Schema.Types.String,
        maxlength: 5,
    },
    concentration: {
        type: mongoose_1.Schema.Types.Number,
        required: true,
    },
    suggestion: {
        type: mongoose_1.Schema.Types.String,
        maxlength: 255,
    },
    createDate: {
        type: mongoose_1.Schema.Types.Date,
        default: dayjs_1.default().toDate()
    },
});
exports.default = mongoose_1.model(COLLECTION_NAME, AirQualitySchema);
//# sourceMappingURL=AirQualityModel.js.map