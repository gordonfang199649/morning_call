import { log } from "../utility/log/log";
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
   * @param airQualityDoc 空氣品質 Document
   */
  public async saveMonitoringData(airQualityDoc: AirQualityDoc): Promise<void> {
    await airQualityDoc.save();
    this.logger.info('inserted one row.');
  }

  /**
   * 取得資料庫最新監測數據
   * @param
   * @returns AirQualityRelayDto 空氣品質 Relay Dto
   */
  public async fetechLatestData(): Promise<AirQuality> {
    const airQualityPo: AirQuality = (await AirQualityModel.findOne().sort({ '_id': 'desc' }).exec()).toObject({ getters: true });
    this.logger.info('selected one row.', airQualityPo);
    return airQualityPo;
  }

  /**
   * 刪除區間內的資料
   * @param AirQualityDto 空氣品質 Dto
   * @returns
   */
  public async deleteDataByDuration(startDate: Date, endDate: Date): Promise<void> {
    const rowNumber = await this.countDataAmount(startDate, endDate);

    await AirQualityModel.deleteMany({
      createDate: {
        $gte: startDate,
        $lte: endDate
      }
    }).exec();

    this.logger.info(`deleted ${rowNumber} row(s).`);
  }

  /**
   * 計算日期區間內資料數
   * @param AirQualityDto 空氣品質 Dto
   * @returns 資料筆數
   */
  public async countDataAmount(startDate: Date, endDate: Date): Promise<number> {
    const rowNumber: number = await AirQualityModel.countDocuments({
      createDate: {
        $gte: startDate,
        $lte: endDate
      }
    }).exec();
    return rowNumber;
  }
}
