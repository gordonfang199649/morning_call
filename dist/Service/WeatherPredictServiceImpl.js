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
const api_1 = require("../api/api");
const WeatherPridictModel_1 = __importDefault(require("../model/WeatherPridictModel"));
/**
 * WeatherPredictServiceImpl 天氣預報實作服務
 * @author Gordon Fang
 * @date 2021-05-10
 */
class WeatherPredictServiceImpl {
    /**
   * 建構子
   * @param WeatherPredictDao 天氣預報實體持久層
   */
    constructor(weatherPredictDao) {
        this.weatherPredictDao = weatherPredictDao;
    }
    async saveMonitoringData() {
        const startTime = dayjs_1.default().add(0, 'day').set('hour', 6).format('YYYY-MM-DDTHH:mm:ss');
        const endTime = dayjs_1.default().add(0, 'day').set('hour', 9).format('YYYY-MM-DDTHH:mm:ss');
        const weatherPredict = await api_1.getWeatherPredictData(process.env.CWB_API_ID, process.env.LOCATION_NAME, startTime, endTime);
        const weatherPredictPo = new WeatherPridictModel_1.default(weatherPredict);
        await this.weatherPredictDao.saveMonitoringData(weatherPredictPo);
    }
    async fetchMonitoringData() {
        const weatherPredictPo = await this.weatherPredictDao.fetechLatestData();
        return weatherPredictPo;
    }
}
exports.default = WeatherPredictServiceImpl;
//# sourceMappingURL=WeatherPredictServiceImpl.js.map