import WeatherPridictModel, { WeatherPredict, WeatherPredictDoc } from "../model/WeatherPridictModel";

/**
 * WeatherPredictDao
 * @author Gordon Fang
 * @date 2021-05-10
 */
export default class WeatherPredictDao {
    /**
   * 監測數據儲存至資料庫
   * @param weatherPredictPo 天氣預測實體 Document
   * @returns
   */
    public async saveMonitoringData(weatherPredictPo: WeatherPredictDoc): Promise<void> {
        try {
            await weatherPredictPo.save();
            console.log("inserted one row.");
        } catch (err) {
            console.error(err);
        }
    }

    /**
   * 取得資料庫最新監測數據
   * @param
   * @returns WeatherPredict 天氣預測實體
   */
    public async fetechLatestData(): Promise<WeatherPredict> {
        let weatherPredictPo: WeatherPredict;
        weatherPredictPo = await WeatherPridictModel.findOne().sort({ '_id': 'desc' }).exec();
        return weatherPredictPo;
    }
}