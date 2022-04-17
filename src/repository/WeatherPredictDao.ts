import { log } from "../utility/log/log";
import WeatherPridictModel, { WeatherPredict, WeatherPredictDoc } from "../model/WeatherPridictModel";

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
     */
    public async saveMonitoringData(weatherPredictDoc: WeatherPredictDoc): Promise<void> {
        await weatherPredictDoc.save();
        this.logger.info('inserted one row.');
    }

    /**
     * 取得資料庫最新監測數據
     * @param
     * @returns WeatherPredictRelayDto 天氣預測 Relay Dto
     */
    public async fetechLatestData(): Promise<WeatherPredict> {
        const weatherPredictPo: WeatherPredict = (await WeatherPridictModel.findOne().sort({ '_id': 'desc' }).exec()).toObject({ getters: true });
        this.logger.info('selected one row.', weatherPredictPo);
        return weatherPredictPo;
    }

    /**
     * 刪除區間內的資料
     * @param WeatherPredictDto 天氣預測 Dto
     * @returns
     */
    public async deleteDataByDuration(startDate: Date, endDate: Date): Promise<void> {
        const rowNumber: number = await this.countDataAmount(startDate, endDate);
        await WeatherPridictModel.deleteMany({
            createDate: {
                $gte: startDate,
                $lte: endDate
            }
        }).exec();

        this.logger.info(`deleted ${rowNumber} row(s).`);
    }

    /**
    * 計算日期區間內資料數
    * @param WeatherPredictDto 天氣預測 Dto
    * @returns 資料筆數
    */
    public async countDataAmount(startDate: Date, endDate: Date): Promise<number> {
        const rowNumber: number = await WeatherPridictModel.countDocuments({
            createDate: {
                $gte: startDate,
                $lte: endDate
            }
        }).exec();
        return rowNumber;
    }
}