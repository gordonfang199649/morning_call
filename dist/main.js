"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Connection_1 = require("./connection/Connection");
const MonitoringDataController_1 = __importDefault(require("./contrtoller/MonitoringDataController"));
const AirQualityDao_1 = __importDefault(require("./repository/AirQualityDao"));
const WeatherPredictDao_1 = __importDefault(require("./repository/WeatherPredictDao"));
const AirQualityServiceImpl_1 = __importDefault(require("./service/impl/AirQualityServiceImpl"));
const WeatherPredictServiceImpl_1 = __importDefault(require("./service/impl/WeatherPredictServiceImpl"));
/**
 * 程式入口點
 * @author Gordon Fang
 * @date 2021-05-19
 */
(async () => {
    await Connection_1.connection();
    const monitoringDataController = new MonitoringDataController_1.default(new WeatherPredictServiceImpl_1.default(new WeatherPredictDao_1.default()), new AirQualityServiceImpl_1.default(new AirQualityDao_1.default()));
    try {
        await monitoringDataController.dispatch(process.argv);
    }
    catch (err) {
        console.error(err);
    }
    finally {
        Connection_1.disconnection();
    }
    ;
})();
//# sourceMappingURL=main.js.map