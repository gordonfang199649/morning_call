import dotenv from 'dotenv';
import path from 'path';
import { connection, disconnection } from '../utility/connection/Connection'
import { log } from '../utility/log/log';
import { getAirQualityData, getWeatherPredictData } from '../utility/api/Api';
import AirQualityModel, { AirQuality, AirQualityDoc } from '../model/AirQualityModel';
import AirQualityIndex from '../enum/AirQualityIndex';
import AirQualityDao from '../repository/AirQualityDao';
dotenv.config({ path: path.resolve(`./${process.env.NODE_ENV}.env`) });

/**
 * FetchAirQualityDataJob
 * 從中央氣象局 Open API 取得特定時間點的觀測數據
 * @author Gordon Fang
 * @date 2022-04-17
 */
(async (): Promise<void> => {
    const airQualityDao: AirQualityDao = new AirQualityDao();
    const logger = log("FetchAirQualityDataJob");
    logger.info('FetchAirQualityDataJob started.');
    await connection();

    // 呼叫環境資源資料開放平臺 API
    logger.info('Now calling CWB open API.');
    let airQualityData: AirQuality = null;
    try {
        airQualityData = await getAirQualityData(0, 6);
        airQualityData.suggestion = getSuggestion(airQualityData.concentration);
    } catch (e) {
        // 呼叫 API 過程中有發生錯誤，就不進資料庫 
        logger.error(e);
        throw e;
    }

    // 將蒐集資料儲存到 mongodb 叢集
    logger.info(airQualityData);
    const airQualityDoc: AirQualityDoc = new AirQualityModel(airQualityData);
    await airQualityDao.saveMonitoringData(airQualityDoc);

    await disconnection();
    logger.info('FetchAirQualityDataJob terminated.');
})();

/**
 * 取得相對建議
 * @param concentration PM2.5懸浮粒子濃度
 * @returns Suggestion 建議
 */
function getSuggestion(concentration: number): string {
    switch (true) {
        case concentration > 300:
            return AirQualityIndex.HAZARDOUS;
        case concentration > 200:
            return AirQualityIndex.VERY_UNHEALTHY;
        case concentration > 150:
            return AirQualityIndex.UNHEALTHY;
        case concentration > 100:
            return AirQualityIndex.SENSITIVE;
        case concentration > 50:
            return AirQualityIndex.MODERATE;
        default:
            return AirQualityIndex.GOOD;
    }
}