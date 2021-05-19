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
const Api_1 = require("../../api/Api");
const WeatherPridictModel_1 = __importDefault(require("../../model/WeatherPridictModel"));
const NoDataError_1 = __importDefault(require("../../model/NoDataError"));
const Scripts_1 = require("../../scripts/Scripts");
/**
 * WeatherPredictServiceImpl 天氣預測實作服務
 * @author Gordon Fang
 * @date 2021-05-10
 */
class WeatherPredictServiceImpl {
    /**
     * 建構子-依賴注入
     * @param WeatherPredictDao 天氣預測實體持久層
     */
    constructor(weatherPredictDao) {
        this.weatherPredictDao = weatherPredictDao;
    }
    /**
     * @override
     */
    async saveMonitoringData() {
        let startTime = dayjs_1.default().set('hour', Number.parseInt(process.env.START_HOUR)).set('minute', 0).set('second', 0);
        let endTime = dayjs_1.default().set('hour', Number.parseInt(process.env.END_HOUR)).set('minute', 0).set('second', 0);
        // 欲撈取資料起始時間點在排程觸發時間點前，將起始、結束時間各加一天
        // 因OPEN API只保留「未來」天氣預測資料
        if (startTime.isBefore(dayjs_1.default())) {
            startTime = startTime.add(1, 'day');
            endTime = endTime.add(1, 'day');
        }
        const weatherPredict = await Api_1.getWeatherPredictData(process.env.CWB_API_ID, process.env.LOCATION_NAME, this.formatDateTime(startTime), this.formatDateTime(endTime));
        const weatherPredictPo = new WeatherPridictModel_1.default(weatherPredict);
        await this.weatherPredictDao.saveMonitoringData(weatherPredictPo);
    }
    /**
     * 格式化日期時間為YYYY-MM-DDTHH:mm:ss日期格式
     * @param dateTime 日期時間
     * @returns 格式化日期時間
     */
    formatDateTime(dateTime) {
        return dateTime.format('YYYY-MM-DDTHH:mm:ss');
    }
    /**
     * @override
     */
    async fetchMonitoringData() {
        const weatherPredictPo = await this.weatherPredictDao.fetechLatestData();
        if (weatherPredictPo === null) {
            return Promise.reject(new NoDataError_1.default(Scripts_1.noDataFoundScript('weatherPredict')));
        }
        return weatherPredictPo;
    }
    /**
     * @override
     */
    async deleteMonitoringData(startDate, endDate) {
        await this.weatherPredictDao.deleteDataByDuration(startDate, endDate);
    }
}
exports.default = WeatherPredictServiceImpl;
//# sourceMappingURL=WeatherPredictServiceImpl.js.map