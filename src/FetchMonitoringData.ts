import { connection, disconnection } from './connection/Connection'
import WeatherPredictDao from "./repository/WeatherPredictDao";
import WeatherPredictServiceImpl from "./service/impl/WeatherPredictServiceImpl";
import MonitoringService from './service/MonitoringService';

/**
 * 排程-預先撈取天氣預測資料
 * @author Gordon Fang
 * @date 2021-05-13
 */
((): void => {
    connection();
    const weatherPredictService: MonitoringService = new WeatherPredictServiceImpl(new WeatherPredictDao());
    weatherPredictService.saveMonitoringData()
        .catch((err) => {
            console.error(err);
        }).finally(() => {
            disconnection();
        })
})();