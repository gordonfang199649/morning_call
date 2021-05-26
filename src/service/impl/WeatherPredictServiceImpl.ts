import dayjs, { Dayjs } from "dayjs";
import { getWeatherPredictData } from "../../utility/api/Api";
import WeatherPridictModel, { WeatherPredict, WeatherPredictDoc } from "../../model/WeatherPridictModel";
import WeatherPredictService from "../WeatherPredictService";
import WeatherPredictDao from "../../repository/WeatherPredictDao";
import NoDataError from "../../model/NoDataError";
import { noDataFoundScript } from "../../utility/scripts/Scripts";
import WeatherPredictDto from "../../model/WeatherPredictDto";
import WeatherPredictRelayDto from "../../model/WeatherPredictRelayDto";
import WeatherPredictRelayBo from "../../model/WeatherPredictRelayBo";
import { copyObject } from "../../utility/Utility";

/**
 * WeatherPredictServiceImpl 天氣預測實作服務
 * @author Gordon Fang
 * @date 2021-05-10
 */
export default class WeatherPredictServiceImpl implements WeatherPredictService {
    /** WeatherPredictDao 天氣預報實體持久層 */
    private weatherPredictDao: WeatherPredictDao;

    /**
     * 建構子-依賴注入
     * @param WeatherPredictDao 天氣預測實體持久層
     */
    constructor(weatherPredictDao: WeatherPredictDao) {
        this.weatherPredictDao = weatherPredictDao;
    }

    /**
     * @override
     */
    public async saveMonitoringData(): Promise<any> {
        const weatherPredict: WeatherPredict = await getWeatherPredictData(process.env.CWB_API_ID, process.env.LOCATION_NAME
            , this.formatDateTime(process.env.START_HOUR), this.formatDateTime(process.env.END_HOUR));
        const weatherPredictDoc: WeatherPredictDoc = new WeatherPridictModel(weatherPredict);
        await this.weatherPredictDao.saveMonitoringData(weatherPredictDoc);
    }

    /**
     * 格式化日期時間為YYYY-MM-DDTHH:mm:ss日期格式
     * @param hour 小時
     * @returns 格式化日期時間
     */
    private formatDateTime(hour: string) {
        let dateTime: Dayjs = dayjs().set('hour', Number.parseInt(hour)).set('minute', 0).set('second', 0);
        // 欲撈取資料起始時間點在排程觸發時間點前，將起始、結束時間各加一天
        // 因OPEN API只保留「未來」天氣預測資料
        if (dateTime.isBefore(dayjs())) {
            dateTime = dateTime.add(1, 'day');
        }
        return dateTime.format('YYYY-MM-DDTHH:mm:ss');
    }

    /**
     * @override
     */
    public async fetchMonitoringData(): Promise<WeatherPredictRelayBo> {
        //查看過去24小時內有無資料
        const weatherPredictDto: WeatherPredictDto = this.generateWeatherPredictDto(-1);
        const dataAmount: number = await this.weatherPredictDao.countDataAmount(weatherPredictDto);
        if (dataAmount === 0) {
            return Promise.reject(new NoDataError(noDataFoundScript('weatherPredict')));
        }
        const weatherPredictRelayDto: WeatherPredictRelayDto = await this.weatherPredictDao.fetechLatestData();
        const weatherPredictRelayBo: WeatherPredictRelayBo = new WeatherPredictRelayBo();
        copyObject(weatherPredictRelayBo, weatherPredictRelayDto);
        return weatherPredictRelayBo;
    }

    /**
     * @override
     */
    public async deleteMonitoringData(): Promise<void> {
        const weatherPredictDto: WeatherPredictDto = this.generateWeatherPredictDto(Number.parseInt(process.env.RESERVE_DAYS));
        await this.weatherPredictDao.deleteDataByDuration(weatherPredictDto);
    }

    /**
     * 
     * @param days 
     */
    private generateWeatherPredictDto(days: number): WeatherPredictDto {
        const weatherPredictDto: WeatherPredictDto = new WeatherPredictDto();
        weatherPredictDto.startDate = dayjs().add(days, 'd').toDate();
        weatherPredictDto.endDate = dayjs().toDate();
        return weatherPredictDto;
    }
}