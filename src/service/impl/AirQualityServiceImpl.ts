import dayjs from "dayjs";
import { getAirQualityData } from "../../utility/api/Api";
import AirQualityIndex from "../../enum/AirQualityIndex";
import AirQualityDto from "../../model/AirQualityDto";
import AirQualityModel, { AirQuality, AirQualityDoc } from "../../model/AirQualityModel";
import AirQualityRelayBo from "../../model/AirQualityRelayBo";
import AirQualityRelayDto from "../../model/AirQualityRelayDto";
import AirQualityDao from "../../repository/AirQualityDao";
import { noDataFoundScript } from "../../utility/scripts/Scripts";
import { copyObject } from "../../utility/Utility";
import AirQualityService from "../AirQualityService";
import { log } from "../../utility/log/log";
import DataType from "../../enum/DataType";

/**
 * AirQualityServiceImpl 空氣品質實作服務
 * @author Gordon Fang
 * @date 2021-05-10
 */
export default class AirQualityServiceImpl implements AirQualityService {
  /** AirQualityDao 空氣品質實體持久層 */
  private airQualityDao: AirQualityDao;
  /** looger */
  private logger = log(this.constructor.name);
  /**
   * 建構子-依賴注入
   * @param AirQualityDao 空氣品質實體持久層
   */
  constructor(airQualityDao: AirQualityDao) {
    this.airQualityDao = airQualityDao;
  }

  /**
   * @override
   */
  public async saveMonitoringData(): Promise<AirQualityRelayBo> {
    const airQualityData: AirQuality = await getAirQualityData(0, 6);
    airQualityData.suggestion = this.getSuggestion(airQualityData.concentration);
    const airQualityDoc: AirQualityDoc = new AirQualityModel(airQualityData);
    const airQualityRelayDto: AirQualityRelayDto = await this.airQualityDao.saveMonitoringData(airQualityDoc);
    const airQualityRelayBo: AirQualityRelayBo = new AirQualityRelayBo();
    copyObject(airQualityRelayBo, airQualityRelayDto)
    return airQualityRelayBo;
  }

  /**
   * 取得相對建議
   * @param concentration PM2.5懸浮粒子濃度
   * @returns Suggestion 建議
   */
  private getSuggestion(concentration: number): string {
    switch (true) {
      case concentration > 300:
        return AirQualityIndex.HAZARDOUS;
      case concentration > 200:
        return AirQualityIndex.VERY_UNHEALTHY;
      case concentration > 150:
        return AirQualityIndex.UNHEALTHY;
      case concentration > 100:
        return AirQualityIndex.SENSITIVE;
      case concentration > 50:
        return AirQualityIndex.MODERATE;
      default:
        return AirQualityIndex.GOOD;
    }
  }

  /**
   * @override
   */
  public async fetchMonitoringData(): Promise<AirQualityRelayBo> {
    let airQualityRelayDto: AirQualityRelayDto;
    try {
      airQualityRelayDto = await this.airQualityDao.fetechLatestData();
    } catch (error) {
      this.logger.error(error);
      return Promise.reject(noDataFoundScript(DataType.AIR_QUALITY));
    }

    const airQualityRelayBo: AirQualityRelayBo = new AirQualityRelayBo();
    copyObject(airQualityRelayBo, airQualityRelayDto)
    return airQualityRelayBo;
  }

  /**
   * @override
   */
  public async deleteMonitoringData(): Promise<void> {
    const airQualityDto: AirQualityDto = new AirQualityDto();
    airQualityDto.startDate = dayjs().add(Number.parseInt(process.env.RESERVE_DAYS), 'd').toDate();
    airQualityDto.endDate = dayjs().toDate();
    await this.airQualityDao.deleteDataByDuration(airQualityDto);
  }
}