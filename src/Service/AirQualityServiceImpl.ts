import * as dotenv from "dotenv";
dotenv.config();
import { getAirQualityData } from "../api/api";
import AirQualityModel, { AirQuality, AirQualityDoc } from "../model/AirQualityModel";
import AirQualityDao from "../Repository/AirQualityDao";
import AirQualityService from "./AirQualityService";

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
    const airQualityData: AirQuality = await getAirQualityData(process.env.EPA_API_ID, 0, 1);
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
        return "健康威脅達到緊急，所有人都可能受到影響。";
      case concentration > 200:
        return "健康警報：所有人都可能產生較嚴重的健康影響。";
      case concentration > 150:
        return "對所有人的健康開始產生影響，對於敏感族群可能產生較嚴重的健康影響。";
      case concentration > 100:
        return "空氣污染物可能會對敏感族群的健康造成影響，但是對一般大眾的影響不明顯。";
      case concentration > 50:
        return "空氣品質普通；但對非常少數之極敏感族群產生輕微影響。";
      default:
        return "空氣品質為良好，污染程度低或無污染。";
    }
  }

  /**
   * @override
   */
  public async fetchMonitoringData(): Promise<AirQuality> {
    const airQualityPo: AirQuality = await this.airQualityDao.fetechLatestData();
    console.log('selected one row.')
    return airQualityPo;
  }
}