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
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
const api_1 = require("../api/api");
const AirQualityModel_1 = __importDefault(require("../model/AirQualityModel"));
class AirQualityServiceImpl {
    /**
     * 建構子
     * @param airQualityDao AirQualityDao
     */
    constructor(airQualityDao) {
        this.airQualityDao = airQualityDao;
    }
    /**
     * 取得環保署Open API空氣數據、儲存到資料庫
     * @param
     * @returns
     */
    async saveEPAMonitoringData() {
        const airQualityData = await api_1.getAirQualityData(process.env.EPA_API_ID, 0, 1);
        if (airQualityData.hasOwnProperty("data")
            && airQualityData.data.length > 0) {
            //PM2.5懸浮粒子濃度
            const concentration = Number.parseInt(airQualityData.data[0].Concentration);
            dayjs_1.default.extend(utc_1.default);
            dayjs_1.default.extend(timezone_1.default);
            const airQualityPo = new AirQualityModel_1.default({
                siteId: Number.parseInt(airQualityData.data[0].SiteId),
                county: airQualityData.data[0].County,
                siteName: airQualityData.data[0].SiteName,
                monitorDate: dayjs_1.default(airQualityData.data[0].MonitorDate).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss'),
                itemName: airQualityData.data[0].ItemName,
                itemEngName: airQualityData.data[0].ItemEngName,
                concentration: concentration,
                suggestion: this.getSuggestion(concentration),
                createDate: dayjs_1.default().tz('Asia/Taipei').toDate(),
            });
            this.airQualityDao.saveMonitoringData(airQualityPo);
        }
    }
    /**
     * 取得相對建議
     * @param concentration PM2.5懸浮粒子濃度
     * @returns Suggestion
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
    /**
     * 取得目前最新的空氣監測數據
     * @param id
     * @returns 空氣監測數據
     */
    fetchMonitoringData() {
        let airQualityPo;
        this.airQualityDao.fetechLatestData()
            .then((result) => airQualityPo = result)
            .catch((err) => console.error(err));
        return airQualityPo;
    }
}
exports.default = AirQualityServiceImpl;
//# sourceMappingURL=AirQualityServiceImpl.js.map