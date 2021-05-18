"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
const Connection_1 = require("./connection/Connection");
const AirQualityDao_1 = __importDefault(require("./repository/AirQualityDao"));
const WeatherPredictDao_1 = __importDefault(require("./repository/WeatherPredictDao"));
const AirQualityServiceImpl_1 = __importDefault(require("./service/impl/AirQualityServiceImpl"));
const WeatherPredictServiceImpl_1 = __importDefault(require("./service/impl/WeatherPredictServiceImpl"));
/**
 * 週期性刪除監測數據
 * @author Gordon Fang
 * @date 2021-05-14
 */
(async () => {
    Connection_1.connection();
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
        Connection_1.disconnection();
    }
})();
//# sourceMappingURL=DeleteMonitoringData.js.map