import { log } from "../log/log";
import AirQualityModel, { AirQuality, AirQualityDoc } from "../model/AirQualityModel";

/**
 * AirQualityDao 空氣品質實體持久層
 * @author Gordon Fang
 * @date 2021-05-10
 */
export default class AirQualityDao {
  /**logger */
  private logger = log(this.constructor.name);
  /**
   * 監測數據儲存至資料庫
   * @param airQualityPo 空氣品質實體 Document
   * @returns
   */
  public async saveMonitoringData(airQualityPo: AirQualityDoc): Promise<void> {
    await airQualityPo.save();
    this.logger.debug('inserted one row.');
  }

  /**
   * 取得資料庫最新監測數據
   * @param
   * @returns AirQuality 空氣品質實體
   */
  public async fetechLatestData(): Promise<AirQuality> {
    let airQualityPo: AirQuality;
    airQualityPo = await AirQualityModel.findOne().sort({ '_id': 'desc' }).exec();
    this.logger.debug('selected one row.', airQualityPo);
    return airQualityPo;
  }

  /**
   * 刪除區間內的資料
   * @param startDate 資料區間起始日期
   * @param endDate 資料區間結束日期
   */
  public async deleteDataByDuration(startDate: Date, endDate: Date): Promise<void> {
    const rowNumber = await AirQualityModel.countDocuments({
      createDate: {
        $gte: startDate,
        $lte: endDate
      }
    }).exec();

    await AirQualityModel.deleteMany({
      createDate: {
        $gte: startDate,
        $lte: endDate
      }
    }).exec();

    this.logger.debug(`deleted ${rowNumber} row(s).`);
  }
}
