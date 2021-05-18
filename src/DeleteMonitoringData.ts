import dayjs from 'dayjs';
import { connection, disconnection } from './connection/Connection'
import AirQualityDao from './repository/AirQualityDao';
import WeatherPredictDao from "./repository/WeatherPredictDao";
import AirQualityServiceImpl from './service/impl/AirQualityServiceImpl';
import WeatherPredictServiceImpl from "./service/impl/WeatherPredictServiceImpl";
import MonitoringService from './service/MonitoringService';

/**
 * 週期性刪除監測數據
 * @author Gordon Fang
 * @date 2021-05-14
 */
(async (): Promise<void> => {
    connection();
    const weatherPredictService: MonitoringService = new WeatherPredictServiceImpl(new WeatherPredictDao());
    const airQualityService: MonitoringService = new AirQualityServiceImpl(new AirQualityDao());
    try {
        await weatherPredictService.deleteMonitoringData(dayjs().add(-7, 'd').toDate(), dayjs().toDate());
        await airQualityService.deleteMonitoringData(dayjs().add(-7, 'd').toDate(), dayjs().toDate());
    } catch (err) {
        console.error(err);
    } finally {
        disconnection();
    }
})();