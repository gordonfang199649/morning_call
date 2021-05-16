import * as dotenv from "dotenv";
dotenv.config();
import dayjs, { Dayjs } from "dayjs";
import { getWeatherPredictData } from "../../api/api";
import WeatherPridictModel, { WeatherPredict, WeatherPredictDoc } from "../../model/WeatherPridictModel";
import WeatherPredictService from "../WeatherPredictService";
import WeatherPredictDao from "../../Repository/WeatherPredictDao";
import NoDataError from "../../model/NoDataError";
import { noDataFoundScript } from "../../scripts/scripts";

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
        let startTime: Dayjs = dayjs().set('hour', Number.parseInt(process.env.START_HOUR)).set('minute', 0).set('second', 0);
        let endTime: Dayjs = dayjs().set('hour', Number.parseInt(process.env.END_HOUR)).set('minute', 0).set('second', 0);

        // 欲撈取資料起始時間點在排程觸發時間點前，將起始、結束時間各加一天
        // 因OPEN API只保留「未來」天氣預測資料
        if (startTime.isBefore(dayjs())) {
            startTime = startTime.add(1, 'day')
            endTime = endTime.add(1, 'day')
        }

        const weatherPredict: WeatherPredict = await getWeatherPredictData(process.env.CWB_API_ID, process.env.LOCATION_NAME
            , this.formatDateTime(startTime), this.formatDateTime(endTime));
        const weatherPredictPo: WeatherPredictDoc = new WeatherPridictModel(weatherPredict);
        await this.weatherPredictDao.saveMonitoringData(weatherPredictPo);
    }

    /**
     * 格式化日期時間為YYYY-MM-DDTHH:mm:ss日期格式
     * @param dateTime 日期時間
     * @returns 格式化日期時間
     */
    private formatDateTime(dateTime: Dayjs) {
        return dateTime.format('YYYY-MM-DDTHH:mm:ss')
    }

    /**
     * @override
     */
    public async fetchMonitoringData(): Promise<WeatherPredict> {
        const weatherPredictPo: WeatherPredict = await this.weatherPredictDao.fetechLatestData();
        if (weatherPredictPo == null) {
            return Promise.reject(new NoDataError(noDataFoundScript('weatherPredict')));
        }
        return weatherPredictPo;
    }

    /**
     * @override
     */
    public async deleteMonitoringData(startDate: Date, endDate: Date): Promise<void> {
        await this.weatherPredictDao.deleteDataByDuration(startDate, endDate);
    }
}