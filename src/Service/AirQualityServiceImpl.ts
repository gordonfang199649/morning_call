import * as dotenv from "dotenv";
dotenv.config();
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { getAirQualityData } from "../api/api";
import AirQualityModel, { AirQuality, AirQualityDoc } from "../model/AirQualityModel";
import AirQualityDao from "../Repository/AirQualityDao";
import { AirQualityService } from "./AirQualityService";

export default class AirQualityServiceImpl implements AirQualityService {
  private airQualityDao: AirQualityDao;

  /**
   * 建構子
   * @param airQualityDao AirQualityDao
   */
  constructor(airQualityDao: AirQualityDao) {
    this.airQualityDao = airQualityDao;
  }

  /**
   * 取得環保署Open API空氣數據、儲存到資料庫
   * @param
   * @returns
   */
  public async saveEPAMonitoringData(): Promise<void> {
    const airQualityData: any = await getAirQualityData(process.env.EPA_API_ID, 0, 1);
    if (airQualityData.hasOwnProperty("data")
      && airQualityData.data.length > 0) {
      //PM2.5懸浮粒子濃度
      const concentration = Number.parseInt(airQualityData.data[0].Concentration);

      dayjs.extend(utc);
      dayjs.extend(timezone);
      const airQualityPo: AirQualityDoc = new AirQualityModel({
        siteId: Number.parseInt(airQualityData.data[0].SiteId),
        county: airQualityData.data[0].County,
        siteName: airQualityData.data[0].SiteName,
        monitorDate: airQualityData.data[0].MonitorDate,
        itemName: airQualityData.data[0].ItemName,
        itemEngName: airQualityData.data[0].ItemEngName,
        concentration: concentration,
        suggestion: this.getSuggestion(concentration),
        createDate: dayjs().tz('Asia/Taipei').toDate(),
      });

      this.airQualityDao.saveMonitoringData(airQualityPo);
    }
  }

  /**
   * 取得相對建議
   * @param concentration PM2.5懸浮粒子濃度
   * @returns Suggestion
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
   * 取得目前最新的空氣監測數據
   * @param
   * @returns 空氣監測數據
   */
  public async fetchMonitoringData(): Promise<AirQuality> {
    const airQualityPo: AirQuality = await this.airQualityDao.fetechLatestData();
    console.log('selected one row.')
    return airQualityPo;
  }
}