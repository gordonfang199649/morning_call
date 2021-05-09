"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
require("../connection/connect");
const AirQualityModel_1 = __importDefault(require("../model/AirQualityModel"));
/**
 * AirQualityDao
 */
class AirQualityDao {
    /**
     *
     * @param airQualityPo
     */
    async saveMonitoringData(airQualityPo) {
        try {
            await airQualityPo.save();
            console.log("successfully inserted one row.");
        }
        catch (err) {
            console.error(err);
        }
        await mongoose_1.disconnect();
    }
    /**
     *
     * @param id
     * @returns
     */
    async fetechLatestData() {
        let airQualityPo;
        try {
            await AirQualityModel_1.default.findOne({})
                .sort({ 'monitorDate': 'desc' })
                .exec((err, airQuality) => {
                if (err)
                    throw err;
                airQualityPo = airQuality;
            });
        }
        catch (error) {
            console.error(error);
        }
        // await disconnect();
        return airQualityPo;
    }
}
exports.default = AirQualityDao;
//# sourceMappingURL=AirQualityDao.js.map