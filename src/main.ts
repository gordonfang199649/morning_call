import dotenv from 'dotenv';
import path from 'path';
import { connection, disconnection } from './utility/connection/Connection'
import MonitoringDataController from './contrtoller/MonitoringDataController';
import { log } from './utility/log/log';
import AirQualityDao from './repository/AirQualityDao';
import WeatherPredictDao from "./repository/WeatherPredictDao";
import AirQualityServiceImpl from './service/impl/AirQualityServiceImpl';
import WeatherPredictServiceImpl from "./service/impl/WeatherPredictServiceImpl";
dotenv.config({ path: path.resolve(`./${process.env.NODE_ENV}.env`) });

/**
 * 程式入口點
 * @author Gordon Fang
 * @date 2021-05-19
 */
(async (): Promise<void> => {
    const logger = log("Main");
    logger.info('Application started.');
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
        await disconnection();
    };
    logger.info('Application terminated.');
})();