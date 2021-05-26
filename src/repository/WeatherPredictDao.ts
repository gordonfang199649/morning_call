import { log } from "../utility/log/log";
import WeatherPredictDto from "../model/WeatherPredictDto";
import WeatherPredictRelayDto from "../model/WeatherPredictRelayDto";
import WeatherPridictModel, { WeatherPredict, WeatherPredictDoc } from "../model/WeatherPridictModel";
import { copyObject } from "../utility/Utility";

/**
 * WeatherPredictDao
 * @author Gordon Fang
 * @date 2021-05-10
 */
export default class WeatherPredictDao {
    /**logger */
    private logger = log(this.constructor.name);

    /**
     * 監測數據儲存至資料庫
     * @param weatherPredictDoc 天氣預測 Document
     * @returns
     */
    public async saveMonitoringData(weatherPredictDoc: WeatherPredictDoc): Promise<void> {
        await weatherPredictDoc.save();
        this.logger.debug('inserted one row.');
    }

    /**
     * 取得資料庫最新監測數據
     * @param
     * @returns WeatherPredict 天氣預測實體
     */
    public async fetechLatestData(): Promise<WeatherPredictRelayDto> {
        const weatherPredictPo: WeatherPredict = (await WeatherPridictModel.findOne().sort({ '_id': 'desc' }).exec()).toObject({ getters: true });
        this.logger.debug('selected one row.', weatherPredictPo);
        const weatherPredictRelayDto: WeatherPredictRelayDto = new WeatherPredictRelayDto();
        copyObject(weatherPredictRelayDto, weatherPredictPo);
        return weatherPredictRelayDto;
    }

    /**
     * 刪除區間內的資料
     * @param startDate 資料區間起始日期
     * @param endDate 資料區間結束日期
     */
    public async deleteDataByDuration(weatherPredictDto: WeatherPredictDto): Promise<void> {
        const rowNumber: number = await this.countDataAmount(weatherPredictDto);
        await WeatherPridictModel.deleteMany({
            createDate: {
                $gte: weatherPredictDto.startDate,
                $lte: weatherPredictDto.endDate
            }
        }).exec();

        this.logger.debug(`deleted ${rowNumber} row(s).`);
    }

    /**
    * 計算日期區間內資料數
    * @param weatherPredictDto
    * @returns 資料數
    */
    public async countDataAmount(weatherPredictDto: WeatherPredictDto): Promise<number> {
        const rowNumber: number = await WeatherPridictModel.countDocuments({
            createDate: {
                $gte: weatherPredictDto.startDate,
                $lte: weatherPredictDto.endDate
            }
        }).exec();
        return rowNumber;
    }
}