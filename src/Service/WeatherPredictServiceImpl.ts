import * as dotenv from "dotenv";
dotenv.config();
import dayjs from "dayjs";
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

    async saveMonitoringData(): Promise<any> {
        const startTime: string = dayjs().add(0, 'day').set('hour', 6).format('YYYY-MM-DDTHH:mm:ss');
        const endTime: string = dayjs().add(0, 'day').set('hour', 9).format('YYYY-MM-DDTHH:mm:ss');
        const weatherPredict: WeatherPredict = await getWeatherPredictData(process.env.CWB_API_ID, process.env.LOCATION_NAME, startTime, endTime);
        const weatherPredictPo: WeatherPredictDoc = new WeatherPridictModel(weatherPredict);
        await this.weatherPredictDao.saveMonitoringData(weatherPredictPo);
    }

    async fetchMonitoringData(): Promise<WeatherPredict> {
        const weatherPredictPo: WeatherPredict = await this.weatherPredictDao.fetechLatestData();
        return weatherPredictPo;
    }
}