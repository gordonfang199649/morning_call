"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Connection_1 = require("./connection/Connection");
const WeatherPredictDao_1 = __importDefault(require("./repository/WeatherPredictDao"));
const WeatherPredictServiceImpl_1 = __importDefault(require("./service/impl/WeatherPredictServiceImpl"));
/**
 * 排程-預先撈取天氣預測資料
 * @author Gordon Fang
 * @date 2021-05-13
 */
(() => {
    Connection_1.connection();
    const weatherPredictService = new WeatherPredictServiceImpl_1.default(new WeatherPredictDao_1.default());
    weatherPredictService.saveMonitoringData()
        .catch((err) => {
        console.error(err);
    }).finally(() => {
        Connection_1.disconnection();
    });
})();
//# sourceMappingURL=FetchMonitoringData.js.map