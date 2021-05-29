import { log } from "../utility/log/log";
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
  public async saveMonitoringData(airQualityDoc: AirQualityDoc): Promise<AirQualityRelayDto> {
    await airQualityDoc.save();
    this.logger.debug('inserted one row.');
    const airQualityRelayDto: AirQualityRelayDto = new AirQualityRelayDto();
    copyObject(airQualityRelayDto, airQualityDoc.toObject({ getters: true }));
    return airQualityRelayDto;
  }

  /**
   * 取得資料庫最新監測數據
   * @param
   * @returns AirQualityRelayDto 空氣品質 Relay Dto
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
   * @param AirQualityDto 空氣品質 Dto
   * @returns
   */
  public async deleteDataByDuration(airQualityDto: AirQualityDto): Promise<void> {
    const rowNumber = await this.countDataAmount(airQualityDto);

    await AirQualityModel.deleteMany({
      createDate: {
        $gte: airQualityDto.startDate,
        $lte: airQualityDto.endDate
      }
    }).exec();

    this.logger.debug(`deleted ${rowNumber} row(s).`);
  }

  /**
   * 計算日期區間內資料數
   * @param AirQualityDto 空氣品質 Dto
   * @returns 資料筆數
   */
  public async countDataAmount(airQualityDto: AirQualityDto): Promise<number> {
    const rowNumber: number = await AirQualityModel.countDocuments({
      createDate: {
        $gte: airQualityDto.startDate,
        $lte: airQualityDto.endDate
      }
    }).exec();
    return rowNumber;
  }
}
