"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const api_1 = require("../../api/api");
const AirQualityIndex_1 = __importDefault(require("../../Enum/AirQualityIndex"));
const AirQualityModel_1 = __importDefault(require("../../model/AirQualityModel"));
const scripts_1 = require("../../scripts/scripts");
/**
 * AirQualityServiceImpl 空氣品質實作服務
 * @author Gordon Fang
 * @date 2021-05-10
 */
class AirQualityServiceImpl {
    /**
     * 建構子
     * @param AirQualityDao 空氣品質實體持久層
     */
    constructor(airQualityDao) {
        this.airQualityDao = airQualityDao;
    }
    /**
     * @override
     */
    async saveMonitoringData() {
        const airQualityData = await api_1.getAirQualityData(0, 6);
        airQualityData.suggestion = this.getSuggestion(airQualityData.concentration);
        const airQualityPo = new AirQualityModel_1.default(airQualityData);
        await this.airQualityDao.saveMonitoringData(airQualityPo);
    }
    /**
     * 取得相對建議
     * @param concentration PM2.5懸浮粒子濃度
     * @returns Suggestion 建議
     */
    getSuggestion(concentration) {
        switch (true) {
            case concentration > 300:
                return AirQualityIndex_1.default.HAZARDOUS;
            case concentration > 200:
                return AirQualityIndex_1.default.VERY_UNHEALTHY;
            case concentration > 150:
                return AirQualityIndex_1.default.UNHEALTHY;
            case concentration > 100:
                return AirQualityIndex_1.default.SENSITIVE;
            case concentration > 50:
                return AirQualityIndex_1.default.MODERATE;
            default:
                return AirQualityIndex_1.default.GOOD;
        }
    }
    /**
     * @override
     */
    async fetchMonitoringData() {
        const airQualityPo = await this.airQualityDao.fetechLatestData();
        if (airQualityPo === null) {
            return Promise.reject(scripts_1.noDataFoundScript('airQuality'));
        }
        return airQualityPo;
    }
    /**
     * @override
     */
    async deleteMonitoringData(startDate, endDate) {
        await this.airQualityDao.deleteDataByDuration(startDate, endDate);
    }
}
exports.default = AirQualityServiceImpl;
//# sourceMappingURL=AirQualityServiceImpl.js.map