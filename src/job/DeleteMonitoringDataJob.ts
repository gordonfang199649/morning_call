import dotenv from 'dotenv';
import path from 'path';
import { connection, disconnection } from '../utility/connection/Connection'
import { log } from '../utility/log/log';
import WeatherPredictDao from "../repository/WeatherPredictDao";
import dayjs from 'dayjs';
import AirQualityDao from '../repository/AirQualityDao';
dotenv.config({ path: path.resolve(`./${process.env.NODE_ENV}.env`) });

/**
 * DeleteMonitoringDataJob
 * 刪除特典時間的觀測數據
 * @author Gordon Fang
 * @date 2022-04-17
 */
(async (): Promise<void> => {
    const weatherPredictDao: WeatherPredictDao = new WeatherPredictDao();
    const airQualityDao: AirQualityDao = new AirQualityDao();
    const logger = log("DeleteMonitoringDataJob");
    logger.info('DeleteMonitoringDataJob started.');
    await connection();

    // 計算資料保留起訖日，進行刪除作業
    const startDate: Date = dayjs().add(Number.parseInt(process.env.RESERVE_DAYS), 'd').toDate();
    const endDate: Date = dayjs().toDate();
    await weatherPredictDao.deleteDataByDuration(startDate, endDate);
    await airQualityDao.deleteDataByDuration(startDate, endDate)
    
    await disconnection();
    logger.info('DeleteMonitoringDataJob terminated.');
})();

