import { AirQuality } from "./AirQualityModel";

export default class AirQualityRelayDto implements AirQuality {
    type: string = '';
    siteId: number = 0;
    county: string = '';
    siteName: string = '';
    monitorDate: string = '';
    itemName: string = '';
    itemEngName: string = '';
    concentration: number = 0;
    suggestion: string = '';
    createDate: Date = null;
}