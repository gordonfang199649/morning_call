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
const api_1 = require("../api/api");
const AirQualityModel_1 = __importDefault(require("../model/AirQualityModel"));
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
    async saveMonitoringData() {
        const airQualityData = await api_1.getAirQualityData(process.env.EPA_API_ID, 0, 1);
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
                return "健康威脅達到緊急，所有人都可能受到影響。";
            case concentration > 200:
                return "健康警報：所有人都可能產生較嚴重的健康影響。";
            case concentration > 150:
                return "對所有人的健康開始產生影響，對於敏感族群可能產生較嚴重的健康影響。";
            case concentration > 100:
                return "空氣污染物可能會對敏感族群的健康造成影響，但是對一般大眾的影響不明顯。";
            case concentration > 50:
                return "空氣品質普通；但對非常少數之極敏感族群產生輕微影響。";
            default:
                return "空氣品質為良好，污染程度低或無污染。";
        }
    }
    async fetchMonitoringData() {
        const airQualityPo = await this.airQualityDao.fetechLatestData();
        console.log('selected one row.');
        return airQualityPo;
    }
}
exports.default = AirQualityServiceImpl;
//# sourceMappingURL=AirQualityServiceImpl.js.map