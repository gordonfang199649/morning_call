"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
const connect_1 = require("./connection/connect");
const AirQualityDao_1 = __importDefault(require("./Repository/AirQualityDao"));
const WeatherPredictDao_1 = __importDefault(require("./Repository/WeatherPredictDao"));
const AirQualityServiceImpl_1 = __importDefault(require("./Service/impl/AirQualityServiceImpl"));
const WeatherPredictServiceImpl_1 = __importDefault(require("./Service/impl/WeatherPredictServiceImpl"));
/**
 * 週期性刪除監測數據
 * @author Gordon Fang
 * @date 2021-05-14
 */
(async () => {
    connect_1.connection();
    const weatherPredictService = new WeatherPredictServiceImpl_1.default(new WeatherPredictDao_1.default());
    const airQualityService = new AirQualityServiceImpl_1.default(new AirQualityDao_1.default());
    try {
        await weatherPredictService.deleteMonitoringData(dayjs_1.default().add(-7, 'd').toDate(), dayjs_1.default().toDate());
        await airQualityService.deleteMonitoringData(dayjs_1.default().add(-7, 'd').toDate(), dayjs_1.default().toDate());
    }
    catch (err) {
        console.error(err);
    }
    finally {
        connect_1.disconnection();
    }
})();
//# sourceMappingURL=deleteMonitoringData.js.map