import dotenv from 'dotenv';
import path from 'path';
import { connection, disconnection } from '../utility/connection/Connection'
import { log } from '../utility/log/log';
import WeatherPredictDao from "../repository/WeatherPredictDao";
import WeatherPridictModel, { WeatherPredict, WeatherPredictDoc } from '../model/WeatherPridictModel';
import { getWeatherPredictData } from '../utility/api/Api';
import { formatDateTime } from '../utility/Utility';
dotenv.config({ path: path.resolve(`./${process.env.NODE_ENV}.env`) });

/**
 * FetchWeatherPredictDataJob
 * 從中央氣象局 Open API 取得特定時間點的觀測數據
 * @author Gordon Fang
 * @date 2022-04-17
 */
(async (): Promise<void> => {
    const weatherPredictDao: WeatherPredictDao = new WeatherPredictDao();
    const logger = log("FetchWeatherPredictDataJob");
    logger.info('FetchWeatherPredictDataJob started.');
    await connection();

    // 呼叫中央氣象局開放資料平臺之資料 API
    logger.info('Now calling CWB open API.');
    let weatherPredict: WeatherPredict = null;
    try {
        weatherPredict = await getWeatherPredictData(process.env.CWB_API_ID, process.env.LOCATION_NAME
            , formatDateTime(process.env.START_HOUR), formatDateTime(process.env.END_HOUR));
    } catch (e) {
        // 呼叫 API 過程中有發生錯誤，就不進資料庫 
        logger.error(e);
        throw e;
    }

    // 將蒐集資料儲存到 mongodb 叢集
    logger.info(weatherPredict);
    const weatherPredictDoc: WeatherPredictDoc = new WeatherPridictModel(weatherPredict);
    await weatherPredictDao.saveMonitoringData(weatherPredictDoc);

    await disconnection();
    logger.info('FetchWeatherPredictDataJob terminated.');
})();

