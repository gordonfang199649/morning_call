import * as dotenv from "dotenv";
dotenv.config();
import { getAirQualityData } from "../../api/api";
import AirQualityIndex from "../../Enum/AirQualityIndex";
import AirQualityModel, { AirQuality, AirQualityDoc } from "../../model/AirQualityModel";
import AirQualityDao from "../../Repository/AirQualityDao";
import { noDataFoundScript } from "../../scripts/scripts";
import AirQualityService from "../AirQualityService";

/**
 * AirQualityServiceImpl 空氣品質實作服務
 * @author Gordon Fang
 * @date 2021-05-10
 */
export default class AirQualityServiceImpl implements AirQualityService {
  /** AirQualityDao 空氣品質實體持久層 */
  private airQualityDao: AirQualityDao;

  /**
   * 建構子
   * @param AirQualityDao 空氣品質實體持久層
   */
  constructor(airQualityDao: AirQualityDao) {
    this.airQualityDao = airQualityDao;
  }

  /**
   * @override
   */
  public async saveMonitoringData(): Promise<void> {
    const airQualityData: AirQuality = await getAirQualityData(0, 6);
    airQualityData.suggestion = this.getSuggestion(airQualityData.concentration);
    const airQualityPo: AirQualityDoc = new AirQualityModel(airQualityData);
    await this.airQualityDao.saveMonitoringData(airQualityPo);
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
  public async fetchMonitoringData(): Promise<AirQuality> {
    const airQualityPo: AirQuality = await this.airQualityDao.fetechLatestData();
    if (airQualityPo === null) {
      return Promise.reject(noDataFoundScript('airQuality'));
    }
    return airQualityPo;
  }

  /**
   * @override
   */
  public async deleteMonitoringData(startDate: Date, endDate: Date): Promise<void> {
    await this.airQualityDao.deleteDataByDuration(startDate, endDate);
  }
}