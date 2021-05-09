import { AirQuality } from "../model/AirQualityModel";

export interface AirQualityService {
    saveEPAMonitoringData: any;
    fetchMonitoringData(): Promise<AirQuality>;
}