import AirQualityModel, { AirQuality, AirQualityDoc } from "../model/AirQualityModel";

/**
 * AirQualityDao
 * @author Gordon Fang
 * @date 2021-05-10
 */
export default class AirQualityDao {
  /**
   * 監測數據儲存至資料庫
   * @param airQualityPo 空氣品質實體
   * @returns
   */
  public async saveMonitoringData(airQualityPo: AirQualityDoc): Promise<void> {
    try {
      await airQualityPo.save();
      console.log("inserted one row.");
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * 取得資料庫最新監測數據
   * @param
   * @returns AirQuality 空氣品質實體
   */
  public async fetechLatestData(): Promise<AirQuality> {
    let airQualityPo: AirQuality;
    airQualityPo = await AirQualityModel.findOne().sort({ '_id': 'desc' }).exec();
    return airQualityPo;
  }
}
