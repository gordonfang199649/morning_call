import { log } from "../log/log";
import AirQualityDto from "../model/AirQualityDto";
import AirQualityModel, { AirQuality, AirQualityDoc } from "../model/AirQualityModel";
import AirQualityRelayDto from "../model/AirQualityRelayDto";
import { copyObject } from "../utility/Utility";

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
   * @param airQualitydoc 空氣品質 Document
   * @returns
   */
  public async saveMonitoringData(airQualityDoc: AirQualityDoc): Promise<void> {
    await airQualityDoc.save();
    this.logger.debug('inserted one row.');
  }

  /**
   * 取得資料庫最新監測數據
   * @param
   * @returns AirQuality 空氣品質實體
   */
  public async fetechLatestData(): Promise<AirQualityRelayDto> {
    const airQualityPo: AirQuality = (await AirQualityModel.findOne().sort({ '_id': 'desc' }).exec()).toObject({ getters: true });
    this.logger.debug('selected one row.', airQualityPo);
    const airQualityRelayDto: AirQualityRelayDto = new AirQualityRelayDto();
    copyObject(airQualityRelayDto, airQualityPo);
    return airQualityRelayDto;
  }

  /**
   * 刪除區間內的資料
   * @param startDate 資料區間起始日期
   * @param endDate 資料區間結束日期
   */
  public async deleteDataByDuration(airQualityDto: AirQualityDto): Promise<void> {
    const rowNumber = await AirQualityModel.countDocuments({
      createDate: {
        $gte: airQualityDto.startDate,
        $lte: airQualityDto.endDate
      }
    }).exec();

    await AirQualityModel.deleteMany({
      createDate: {
        $gte: airQualityDto.startDate,
        $lte: airQualityDto.endDate
      }
    }).exec();

    this.logger.debug(`deleted ${rowNumber} row(s).`);
  }
}
