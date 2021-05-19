import { connection, disconnection } from './connection/Connection'
import MonitoringDataController from './contrtoller/MonitoringDataController';
import AirQualityDao from './repository/AirQualityDao';
import WeatherPredictDao from "./repository/WeatherPredictDao";
import AirQualityServiceImpl from './service/impl/AirQualityServiceImpl';
import WeatherPredictServiceImpl from "./service/impl/WeatherPredictServiceImpl";

/**
 * 程式入口點
 * @author Gordon Fang
 * @date 2021-05-19
 */
(async (): Promise<void> => {
    await connection();
    const monitoringDataController: MonitoringDataController = new MonitoringDataController(
        new WeatherPredictServiceImpl(new WeatherPredictDao()),
        new AirQualityServiceImpl(new AirQualityDao()));
    try {
        await monitoringDataController.dispatch(process.argv);
    }
    catch (err) {
        console.error(err);
    }
    finally {
        disconnection();
    };
})();