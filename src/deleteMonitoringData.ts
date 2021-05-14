
import dayjs from 'dayjs';
import { connection, disconnection } from './connection/connect'
import AirQualityDao from './Repository/AirQualityDao';
import WeatherPredictDao from "./Repository/WeatherPredictDao";
import AirQualityService from './Service/AirQualityService';
import AirQualityServiceImpl from './Service/AirQualityServiceImpl';
import WeatherPredictService from "./Service/WeatherPredictService";
import WeatherPredictServiceImpl from "./Service/WeatherPredictServiceImpl";

/**
 * 
 * @author Gordon Fang
 * @date 2021-05-14
 */
(async (): Promise<void> => {
    connection();
    const weatherPredictService: WeatherPredictService = new WeatherPredictServiceImpl(new WeatherPredictDao());
    const airQualityService: AirQualityService = new AirQualityServiceImpl(new AirQualityDao());
    await weatherPredictService.deleteMonitoringData(dayjs().add(-7, 'd').toDate(), dayjs().toDate());
    await airQualityService.deleteMonitoringData(dayjs().add(-7, 'd').toDate(), dayjs().toDate());
    disconnection();
})();