import * as dotenv from "dotenv";
dotenv.config();
import dayjs, { Dayjs } from "dayjs";
import { getWeatherPredictData } from "../api/api";
import WeatherPridictModel, { WeatherPredict, WeatherPredictDoc } from "../model/WeatherPridictModel";
import WeatherPredictService from "./WeatherPredictService";
import WeatherPredictDao from "../Repository/WeatherPredictDao";

/**
 * WeatherPredictServiceImpl 天氣預報實作服務
 * @author Gordon Fang
 * @date 2021-05-10
 */
export default class WeatherPredictServiceImpl implements WeatherPredictService {
    /** WeatherPredictDao 天氣預報實體持久層 */
    private weatherPredictDao: WeatherPredictDao;

    /**
   * 建構子
   * @param WeatherPredictDao 天氣預報實體持久層
   */
    constructor(weatherPredictDao: WeatherPredictDao) {
        this.weatherPredictDao = weatherPredictDao;
    }

    /**
     * @override
     */
    public async saveMonitoringData(): Promise<any> {
        const startTime: Dayjs = dayjs().set('hour', Number.parseInt(process.env.START_HOUR)).set('minute', 0).set('second', 0);
        const endTime: Dayjs = dayjs().set('hour', Number.parseInt(process.env.END_HOUR)).set('minute', 0).set('second', 0);

        // 欲撈取資料起始時間點在排程觸發時間點前，將起始、結束時間各加一天
        // 因OPEN API只保留未來天氣預測資料
        if (startTime.isBefore(dayjs())) {
            this.increaseDays([startTime, endTime], 1);
        }

        const weatherPredict: WeatherPredict = await getWeatherPredictData(process.env.CWB_API_ID, process.env.LOCATION_NAME
            , this.formatDateTime(startTime), this.formatDateTime(endTime));
        const weatherPredictPo: WeatherPredictDoc = new WeatherPridictModel(weatherPredict);
        await this.weatherPredictDao.saveMonitoringData(weatherPredictPo);
    }

    /**
     * 使陣列中的日期時間多加N天
     * @param dateTime 日期時間
     * @param increaseNum 增加天數
     * @returns
     */
    private increaseDays(dateTime: Array<Dayjs>, increaseNum: number): void {
        dateTime.forEach((day) => { day.add(increaseNum, 'day') });
    }


    /**
     * 格式化日期時間為YYYY-MM-DDTHH:mm:ss日期格式
     * @param dateTime 日期時間
     * @returns 格式化日期時間
     */
    private formatDateTime(dateTime: Dayjs) {
        console.log(dateTime.format('YYYY-MM-DDTHH:mm:ss'))
        return dateTime.format('YYYY-MM-DDTHH:mm:ss')
    }

    /**
     * @override
     */
    public async fetchMonitoringData(): Promise<WeatherPredict> {
        const weatherPredictPo: WeatherPredict = await this.weatherPredictDao.fetechLatestData();
        return weatherPredictPo;
    }
}