import dayjs from 'dayjs';
import { connection, disconnection } from './connection/connect'
import AirQualityDao from './Repository/AirQualityDao';
import WeatherPredictDao from "./Repository/WeatherPredictDao";
import AirQualityService from './Service/AirQualityService';
import AirQualityServiceImpl from './Service/impl/AirQualityServiceImpl';
import WeatherPredictService from "./Service/WeatherPredictService";
import WeatherPredictServiceImpl from "./Service/impl/WeatherPredictServiceImpl";

/**
 * 週期性刪除監測數據
 * @author Gordon Fang
 * @date 2021-05-14
 */
(async (): Promise<void> => {
    connection();
    const weatherPredictService: WeatherPredictService = new WeatherPredictServiceImpl(new WeatherPredictDao());
    const airQualityService: AirQualityService = new AirQualityServiceImpl(new AirQualityDao());
    try {
        await weatherPredictService.deleteMonitoringData(dayjs().add(-7, 'd').toDate(), dayjs().toDate());
        await airQualityService.deleteMonitoringData(dayjs().add(-7, 'd').toDate(), dayjs().toDate());
    } catch (err) {
        console.error(err);
    } finally {
        disconnection();
    }
})();