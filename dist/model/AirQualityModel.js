"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const COLLECTION_NAME = "airQualities";
;
const AirQualitySchema = new mongoose_1.Schema({
    siteId: {
        type: mongoose_1.Schema.Types.Number,
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
        maxlength: 5,
    },
    itemEngName: {
        type: mongoose_1.Schema.Types.String,
        maxlength: 5,
    },
    concentration: {
        type: mongoose_1.Schema.Types.Number,
    },
    suggestion: {
        type: mongoose_1.Schema.Types.String,
        maxlength: 255,
    },
    createDate: {
        type: mongoose_1.Schema.Types.Date,
    },
});
exports.default = mongoose_1.model(COLLECTION_NAME, AirQualitySchema);
//# sourceMappingURL=AirQualityModel.js.map