import { connection, disconnection } from './connection/connect'
import WeatherPredictDao from "./Repository/WeatherPredictDao";
import WeatherPredictService from "./Service/WeatherPredictService";
import WeatherPredictServiceImpl from "./Service/impl/WeatherPredictServiceImpl";

/**
 * 排程-預先撈取天氣預測資料
 * @author Gordon Fang
 * @date 2021-05-13
 */
(async (): Promise<void> => {
    connection();
    const weatherPredictService: WeatherPredictService = new WeatherPredictServiceImpl(new WeatherPredictDao());
    await weatherPredictService.saveMonitoringData();
    disconnection();
})();