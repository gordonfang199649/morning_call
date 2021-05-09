import AirQualityModel, { AirQuality, AirQualityDoc } from "../model/AirQualityModel";

/**
 * AirQualityDao
 */
export default class AirQualityDao {
  /**
   * 
   * @param airQualityPo 
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
   * 
   * @returns 
   */
  public async fetechLatestData(): Promise<AirQuality> {
    let airQualityPo: AirQuality;
    airQualityPo = await AirQualityModel.findOne().sort({ '_id': 'desc' }).exec();
    return airQualityPo;
  }
}
